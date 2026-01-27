import { RLPDecodingError } from '@common/errors/rlp/RLPDecodingError';
import { Address } from '../../vcdm/Address';
import { Hex } from '../../vcdm/Hex';
import { Clause } from '@thor/thor-client/model/transactions/Clause';
import { TransactionBody } from '@thor/thor-client/model/transactions/TransactionBody';
import {
    fromRlp,
    Hex as ViemHex,
    hexToBigInt,
    hexToNumber,
    padHex
} from 'viem';
import { TransactionBodyCodec } from './TransactionBodyCodec';

type RlpValue = ViemHex | RlpValue[];

/**
 * Class for decoding a RLP encoded raw transaction into a TransactionBody object.
 */
class TransactionBodyDecoder extends TransactionBodyCodec {
    /**
     * Normalizes an empty or null hex value to '0x0' or null.
     * @param value - The Viem hex string to normalize.
     * @param mode - Normalization mode.
     */
    private static normalizeEmptyHex(value: ViemHex): ViemHex;
    private static normalizeEmptyHex(
        value: ViemHex,
        mode: 'null'
    ): ViemHex | null;
    private static normalizeEmptyHex(
        value: ViemHex,
        mode?: 'null'
    ): ViemHex | null {
        if (!value || value === '0x') {
            return mode === 'null' ? null : '0x0';
        }
        return value;
    }

    /**
     * Decodes a RLP encoded raw transaction into a TransactionBody object.
     * @param rawTx - The RLP encoded raw transaction.
     * @returns The decoded TransactionBody object and the signature if present.
     */
    public static decode(rawTx: Hex): {
        body: TransactionBody;
        signature?: Uint8Array;
    } {
        const encodedBytes = rawTx.bytes;
        // check if has prefix
        if (encodedBytes.length < 2) {
            throw new RLPDecodingError(
                'TransactionBodyDecoder.decode',
                'Raw transaction is too short',
                { rawTx }
            );
        }
        // get first byte
        const prefix = encodedBytes[0];
        // check if prefix is dynamic fee prefix
        if (prefix === TransactionBodyCodec.DYNAMIC_FEE_PREFIX) {
            return TransactionBodyDecoder.decodeDynamicFee(encodedBytes);
        }
        return TransactionBodyDecoder.decodeLegacy(encodedBytes);
    }

    /**
     * Decodes a RLP encoded legacy transaction body into a TransactionBody object.
     * @param encodedBytes - The RLP encoded legacy transaction body.
     * @returns The decoded TransactionBody object and the signature if present.
     */
    private static decodeLegacy(encodedBytes: Uint8Array): {
        body: TransactionBody;
        signature?: Uint8Array;
    } {
        try {
            // RLP decode
            const decoded = fromRlp(encodedBytes) as RlpValue[];
            // check the number of items in the decoded array (10 unsigned, 11 signed)
            if (
                decoded.length !==
                    TransactionBodyCodec.FIELDS_COUNT_LEGACY_UNSIGNED &&
                decoded.length !==
                    TransactionBodyCodec.FIELDS_COUNT_LEGACY_SIGNED
            ) {
                throw new RLPDecodingError(
                    'TransactionBodyDecoder.decodeLegacy',
                    'Invalid number of items in decoded array',
                    { itemsCount: decoded.length }
                );
            }
            // build the transaction body
            const decodedBody: TransactionBody = {
                chainTag: hexToNumber(decoded[0] as ViemHex),
                blockRef: Hex.of(padHex(decoded[1] as ViemHex, { size: 8 })),
                expiration: hexToNumber(decoded[2] as ViemHex),
                clauses: TransactionBodyDecoder.decodeClauses(
                    decoded[3] as RlpValue[]
                ),
                gasPriceCoef: hexToBigInt(
                    TransactionBodyDecoder.normalizeEmptyHex(
                        decoded[4] as ViemHex
                    )
                ),
                maxPriorityFeePerGas: undefined,
                maxFeePerGas: undefined,
                gas: hexToBigInt(
                    TransactionBodyDecoder.normalizeEmptyHex(
                        decoded[5] as ViemHex
                    )
                ),
                dependsOn:
                    TransactionBodyDecoder.normalizeEmptyHex(
                        decoded[6] as ViemHex,
                        'null'
                    ) !== null
                        ? Hex.of(
                              TransactionBodyDecoder.normalizeEmptyHex(
                                  decoded[6] as ViemHex,
                                  'null'
                              ) as ViemHex
                          )
                        : null,
                nonce: hexToBigInt(
                    TransactionBodyDecoder.normalizeEmptyHex(
                        decoded[7] as ViemHex
                    )
                ),
                reserved: {
                    features: TransactionBodyDecoder.decodeReservedFieldFeature(
                        decoded[8]
                    ),
                    unused: []
                }
            };
            // check if signature is present
            if (
                decoded.length ===
                TransactionBodyCodec.FIELDS_COUNT_LEGACY_SIGNED
            ) {
                // return the transaction body and the signature
                return {
                    body: decodedBody,
                    signature: Hex.of(decoded[9] as ViemHex).bytes
                };
            }
            // return the transaction body
            return { body: decodedBody };
        } catch (error) {
            if (error instanceof RLPDecodingError) {
                throw error;
            }
            throw new RLPDecodingError(
                'TransactionBodyDecoder.decodeLegacy',
                'Error when decoding legacy transaction body',
                { encodedBytes },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Decodes a RLP encoded dynamic fee transaction request into a TransactionRequest object.
     * @param encodedBytes - The RLP encoded dynamic fee transaction request.
     * @returns The decoded TransactionRequest object.
     */
    private static decodeDynamicFee(encodedBytes: Uint8Array): {
        body: TransactionBody;
        signature?: Uint8Array;
    } {
        try {
            // remove the prefix byte
            const encodedBytesWithoutPrefix = encodedBytes.slice(1);
            // RLP decode
            const decoded = fromRlp(encodedBytesWithoutPrefix) as RlpValue[];
            // check the number of items in the decoded array (10 unsigned, 11 signed)
            if (
                decoded.length !==
                    TransactionBodyCodec.FIELDS_COUNT_DYNAMIC_FEE_UNSIGNED &&
                decoded.length !==
                    TransactionBodyCodec.FIELDS_COUNT_DYNAMIC_FEE_SIGNED
            ) {
                throw new RLPDecodingError(
                    'TransactionBodyDecoder.decodeDynamicFee',
                    'Invalid number of items in decoded array',
                    { itemsCount: decoded.length }
                );
            }
            // build the transaction body
            const decodedBody: TransactionBody = {
                chainTag: hexToNumber(decoded[0] as ViemHex),
                blockRef: Hex.of(padHex(decoded[1] as ViemHex, { size: 8 })),
                expiration: hexToNumber(decoded[2] as ViemHex),
                clauses: TransactionBodyDecoder.decodeClauses(
                    decoded[3] as RlpValue[]
                ),
                gasPriceCoef: undefined,
                maxPriorityFeePerGas: hexToBigInt(
                    TransactionBodyDecoder.normalizeEmptyHex(
                        decoded[4] as ViemHex
                    )
                ),
                maxFeePerGas: hexToBigInt(
                    TransactionBodyDecoder.normalizeEmptyHex(
                        decoded[5] as ViemHex
                    )
                ),
                gas: hexToBigInt(
                    TransactionBodyDecoder.normalizeEmptyHex(
                        decoded[6] as ViemHex
                    )
                ),
                dependsOn:
                    TransactionBodyDecoder.normalizeEmptyHex(
                        decoded[7] as ViemHex,
                        'null'
                    ) !== null
                        ? Hex.of(
                              TransactionBodyDecoder.normalizeEmptyHex(
                                  decoded[7] as ViemHex,
                                  'null'
                              ) as ViemHex
                          )
                        : null,
                nonce: hexToBigInt(
                    TransactionBodyDecoder.normalizeEmptyHex(
                        decoded[8] as ViemHex
                    )
                ),
                reserved: {
                    features: TransactionBodyDecoder.decodeReservedFieldFeature(
                        decoded[9]
                    ),
                    unused: []
                }
            };
            // check if signature is present
            if (
                decoded.length ===
                TransactionBodyCodec.FIELDS_COUNT_DYNAMIC_FEE_SIGNED
            ) {
                // return the transaction body and the signature
                return {
                    body: decodedBody,
                    signature: Hex.of(decoded[10] as ViemHex).bytes
                };
            }
            // return the transaction body
            return { body: decodedBody };
        } catch (error) {
            if (error instanceof RLPDecodingError) {
                throw error;
            }
            throw new RLPDecodingError(
                'TransactionBodyDecoder.decodeDynamicFee',
                'Error when decoding dynamic fee transaction body',
                { encodedBytes },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Decodes a RLP encoded clauses into a Clause array.
     * @param decoded - The RLP encoded clauses.
     * @returns The decoded Clause array.
     */
    private static decodeClauses(decoded: RlpValue[]): Clause[] {
        return decoded.map((clause) => {
            return TransactionBodyDecoder.decodeClause(clause as RlpValue[]);
        });
    }

    /**
     * Decodes a RLP encoded clause into a Clause object.
     * @param clause - The RLP encoded clause.
     * @returns The decoded Clause object.
     */
    private static decodeClause(clause: RlpValue[]): Clause {
        const toDecoded = TransactionBodyDecoder.normalizeEmptyHex(
            clause[0] as ViemHex,
            'null'
        );
        const toValue = toDecoded !== null ? Address.of(toDecoded) : null;
        const valueValue = hexToBigInt(
            TransactionBodyDecoder.normalizeEmptyHex(clause[1] as ViemHex)
        );
        const dataDecoded = TransactionBodyDecoder.normalizeEmptyHex(
            clause[2] as ViemHex,
            'null'
        );
        const dataValue = dataDecoded !== null ? Hex.of(dataDecoded) : null;
        return new Clause(toValue, valueValue, dataValue);
    }

    /**
     * Decodes a RLP encoded reserved field features into a number.
     * @param decoded - The RLP encoded reserved field features.
     * @returns The decoded reserved field features.
     */
    private static decodeReservedFieldFeature(decoded: RlpValue): number {
        return hexToNumber(
            TransactionBodyDecoder.normalizeEmptyHex(decoded[0] as ViemHex)
        );
    }
}

export { TransactionBodyDecoder };
