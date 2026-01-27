import { Clause } from '@thor/thor-client/model/transactions/Clause';
import {
    ByteArray,
    Hex,
    hexToBigInt,
    isBytes,
    toBytes,
    toHex,
    toRlp
} from 'viem';
import { RLPEncodingError } from '@common/errors';
import { TransactionBody } from '@thor/thor-client/model/transactions/TransactionBody';
import { TransactionBodyCodec } from './TransactionBodyCodec';

type RlpValue = Hex | RlpValue[];

/**
 * Class for encoding transaction bodies using Recursive Length Prefix (RLP) encoding.
 * Viem is use to encode the transaction body into a RLP encoded Uint8Array.
 */
class TransactionBodyEncoder extends TransactionBodyCodec {
    /**
     * Converts a value to a viem hex string ready to be encoded as RLP.
     * @param value - The value to convert.
     * @param options - The options for the conversion:
     * - maxSize: The maximum size of the hex string.
     * - canonical: Whether to remove leading zeros from the hex string.
     * - zeroAsEmpty: Whether to return 0x if the value is 0 (instead of 0x00).
     * @returns The trimmed hex string.
     * @throws RLPEncodingError if the value is too large to be encoded.
     */
    private static convertToHex(
        value: number | bigint | ByteArray,
        options: {
            maxSize?: number;
            canonical?: boolean;
            zeroAsEmpty?: boolean;
        } = { canonical: false, zeroAsEmpty: false }
    ): Hex {
        try {
            // check value type and throw error if not valid type
            if (
                typeof value !== 'number' &&
                typeof value !== 'bigint' &&
                !isBytes(value)
            ) {
                throw new RLPEncodingError(
                    'convertToHex',
                    `Value is not a valid type: ${typeof value}`,
                    { value }
                );
            }

            const tempHexValue = toHex(value);
            // if hex value is empty return empty
            if (tempHexValue === TransactionBodyEncoder.EMPTY_HEX) {
                return TransactionBodyEncoder.EMPTY_HEX;
            }
            // if hex value is numerically 0 return empty if zeroIsEmpty is true
            if (BigInt(tempHexValue) === 0n && options.zeroAsEmpty) {
                return TransactionBodyEncoder.EMPTY_HEX;
            }
            // remove any leading zeros if canonical form is true
            const hexValue = options.canonical
                ? toHex(hexToBigInt(tempHexValue))
                : tempHexValue;
            // check against any max size
            if (options?.maxSize && hexValue.length > options.maxSize * 2 + 2) {
                throw new RLPEncodingError(
                    'toMaxedHex',
                    `Value is too large to be encoded: ${hexValue}`,
                    { value, maxSize: options?.maxSize }
                );
            }
            return hexValue;
        } catch (error) {
            if (error instanceof RLPEncodingError) {
                throw error;
            }
            throw new RLPEncodingError(
                'convertToHex',
                `Error when converting value to hex: ${value}`,
                { value, options },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Encodes a TransactionBody into a RLP encoded Uint8Array.
     * @param transactionBody - The TransactionBody to encode.
     * @param signature - The signature of the transaction.
     * @returns The RLP encoded Uint8Array.
     */
    public static encodeTransactionBody(
        transactionBody: TransactionBody,
        signature?: Uint8Array
    ): Uint8Array {
        if (TransactionBodyCodec.isDynamicFee(transactionBody)) {
            return TransactionBodyEncoder.encodeDynamicFeeTransactionBody(
                transactionBody,
                signature
            );
        }
        return TransactionBodyEncoder.encodeLegacyTransactionBody(
            transactionBody,
            signature
        );
    }

    /**
     * Encodes a legacy transaction body into a RLP encoded Uint8Array.
     * @param transactionBody - The transaction body to encode.
     * @param signature - The signature of the transaction.
     * @returns The RLP encoded Uint8Array.
     */
    private static encodeLegacyTransactionBody(
        transactionBody: TransactionBody,
        signature?: Uint8Array
    ): Uint8Array {
        try {
            // encode each field of the transaction body
            const encodedParts: RlpValue[] = [
                TransactionBodyEncoder.convertToHex(transactionBody.chainTag, {
                    maxSize: 1
                }),
                // block ref is max 8 bytes
                TransactionBodyEncoder.convertToHex(
                    transactionBody.blockRef.bytes,
                    { maxSize: 8, canonical: true }
                ),
                TransactionBodyEncoder.convertToHex(
                    transactionBody.expiration,
                    { maxSize: 4 }
                ),
                TransactionBodyEncoder.convertClauses(transactionBody.clauses),
                // gas price coef is only present in legacy transactions
                TransactionBodyEncoder.convertToHex(
                    transactionBody.gasPriceCoef ?? 0n,
                    { maxSize: 1, zeroAsEmpty: true }
                ),
                TransactionBodyEncoder.convertToHex(transactionBody.gas, {
                    maxSize: 8
                }),
                // depends on is optional, encode it as an empty bytes if it is not present
                TransactionBodyEncoder.convertToHex(
                    transactionBody.dependsOn?.bytes ?? new Uint8Array(),
                    { maxSize: 32 }
                ),
                TransactionBodyEncoder.convertToHex(transactionBody.nonce, {
                    maxSize: 8
                }),
                // encode the reserved field
                TransactionBodyEncoder.convertReservedField(transactionBody)
            ];
            // add signature if present
            if (signature !== undefined) {
                return toBytes(toRlp([...encodedParts, toHex(signature)]));
            }
            // return without signature
            return toBytes(toRlp(encodedParts));
        } catch (error) {
            if (error instanceof RLPEncodingError) {
                throw error;
            }
            throw new RLPEncodingError(
                'encodeLegacyTransactionBody',
                'Error when encoding legacy transaction body',
                { transactionBody },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Encodes a dynamic fee transaction body into a RLP encoded Uint8Array.
     * @param transactionBody - The transaction body to encode.
     * @param signature - The signature of the transaction.
     * @returns The RLP encoded Uint8Array.
     */
    private static encodeDynamicFeeTransactionBody(
        transactionBody: TransactionBody,
        signature?: Uint8Array
    ): Uint8Array {
        try {
            // encode each field of the transaction body
            const encodedParts: RlpValue[] = [
                TransactionBodyEncoder.convertToHex(transactionBody.chainTag, {
                    maxSize: 1
                }),
                // block ref is max 8 bytes
                TransactionBodyEncoder.convertToHex(
                    transactionBody.blockRef.bytes,
                    { maxSize: 8, canonical: true }
                ),
                TransactionBodyEncoder.convertToHex(
                    transactionBody.expiration,
                    { maxSize: 4 }
                ),
                TransactionBodyEncoder.convertClauses(transactionBody.clauses),
                // max fee fields are present in dynamic fee transactions
                TransactionBodyEncoder.convertToHex(
                    transactionBody.maxPriorityFeePerGas ?? 0n,
                    { maxSize: 32, zeroAsEmpty: true, canonical: true }
                ),
                TransactionBodyEncoder.convertToHex(
                    transactionBody.maxFeePerGas ?? 0n,
                    { maxSize: 32, zeroAsEmpty: true, canonical: true }
                ),
                TransactionBodyEncoder.convertToHex(transactionBody.gas, {
                    maxSize: 8
                }),
                // depends on is optional, encode it as an empty bytes if it is not present
                TransactionBodyEncoder.convertToHex(
                    transactionBody.dependsOn?.bytes ?? new Uint8Array(),
                    { maxSize: 32 }
                ),
                TransactionBodyEncoder.convertToHex(transactionBody.nonce, {
                    maxSize: 8
                }),
                // encode the reserved field
                TransactionBodyEncoder.convertReservedField(transactionBody)
            ];
            // dont add signature
            if (signature === undefined) {
                return new Uint8Array([
                    TransactionBodyCodec.DYNAMIC_FEE_PREFIX,
                    ...toBytes(toRlp(encodedParts))
                ]);
            }
            // add signature if present
            const encodedWithSignature =
                signature !== undefined
                    ? [...encodedParts, toHex(signature)]
                    : encodedParts;
            const bytes = toBytes(toRlp(encodedWithSignature));
            // dynamic fee transactions are prefixed with 0x51
            return new Uint8Array([
                TransactionBodyCodec.DYNAMIC_FEE_PREFIX,
                ...bytes
            ]);
        } catch (error) {
            if (error instanceof RLPEncodingError) {
                throw error;
            }
            throw new RLPEncodingError(
                'encodeDynamicFeeTransactionBody',
                'Error when encoding dynamic fee transaction body',
                { transactionBody },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Encodes a list of clauses into a RLP encoded Uint8Array.
     * @param clauses - The list of clauses to encode.
     * @returns The RLP encoded Uint8Array.
     */
    private static convertClauses(clauses: Clause[]): RlpValue[] {
        return clauses.map((clause) =>
            TransactionBodyEncoder.convertClause(clause)
        );
    }

    /**
     * Converts a clause into a RLP encoded Uint8Array.
     * @param clause - The clause to encode.
     * @returns The RLP encoded Uint8Array.
     */
    private static convertClause(clause: Clause): RlpValue[] {
        try {
            const rlpValue = [
                // to is optional, encode it as an empty bytes if it is not present
                TransactionBodyEncoder.convertToHex(
                    clause.to?.bytes ?? new Uint8Array(),
                    { maxSize: 20, canonical: false }
                ),
                // valie is optional, encode it as 0n if it is not present
                TransactionBodyEncoder.convertToHex(clause.value ?? 0n, {
                    maxSize: 32,
                    zeroAsEmpty: true
                }),
                // data is optional, encode it as an empty bytes if it is not present
                toHex(clause.data?.bytes ?? new Uint8Array())
            ];
            return rlpValue;
        } catch (error) {
            if (error instanceof RLPEncodingError) {
                throw error;
            }
            throw new RLPEncodingError(
                'convertClause',
                'Error when converting clause to RLP encoded value',
                { clause },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Encodes a reserved field into a RLP encoded Uint8Array.
     * @param reserved - The reserved field to encode.
     * @returns The RLP encoded Uint8Array.
     */
    private static convertReservedField(
        transactionBody: TransactionBody
    ): RlpValue[] {
        try {
            const features = transactionBody.reserved?.features ?? 0;

            // If no features, omit reserved entirely
            if (features === 0) return [];

            return [
                TransactionBodyEncoder.convertToHex(features, {
                    maxSize: 1,
                    zeroAsEmpty: true
                })
            ] as const;
        } catch (error) {
            if (error instanceof RLPEncodingError) {
                throw error;
            }
            throw new RLPEncodingError(
                'convertReservedField',
                'Error when converting reserved field to RLP encoded value',
                { transactionBody },
                error instanceof Error ? error : undefined
            );
        }
    }
}

export { TransactionBodyEncoder };
