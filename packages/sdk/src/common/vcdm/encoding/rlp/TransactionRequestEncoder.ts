import { Clause } from '@thor/thor-client/model/transactions/Clause';
import { ByteArray, Hex, hexToBigInt, toBytes, toHex, toRlp } from 'viem';
import { TransactionRequest } from '@thor/thor-client/model/transactions';
import { RLPEncodingError } from '@common/errors';

type RlpValue = Hex | RlpValue[];

/**
 * Options for the transaction request encoder.
 */
interface TransactionRequestEncoderOptions {
    /**
     * Whether the encoding is for hashing purposes (ignores the signature field).
     */
    withoutSignature?: boolean;
}

/**
 * Class for encoding transaction requests using Recursive Length Prefix (RLP) encoding.
 * Viem is use to encode the transaction request into a RLP encoded Uint8Array.
 */
class TransactionRequestEncoder {
    private static readonly EMPTY_HEX = '0x'; // RLP encodes as empty byte array
    private static readonly DYNAMIC_FEE_PREFIX = 0x51;

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
        value: string | number | bigint | ByteArray,
        options: {
            maxSize?: number;
            canonical?: boolean;
            zeroAsEmpty?: boolean;
        } = { canonical: false, zeroAsEmpty: false }
    ): Hex {
        try {
            const tempHexValue = toHex(value);
            // if hex value is empty return empty
            if (tempHexValue === TransactionRequestEncoder.EMPTY_HEX) {
                return TransactionRequestEncoder.EMPTY_HEX;
            }
            // if hex value is numerically 0 return empty if zeroIsEmpty is true
            if (BigInt(tempHexValue) === 0n && options.zeroAsEmpty) {
                return TransactionRequestEncoder.EMPTY_HEX;
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
     * Encodes a TransactionRequest into a RLP encoded Uint8Array.
     * @param transactionRequest - The TransactionRequest to encode.
     * @param options - The options for the encoding:
     * - withoutSignature: Whether the encoding is for hashing purposes (ignores the signature field).
     * @returns The RLP encoded Uint8Array.
     */
    public static encodeTransactionRequest(
        transactionRequest: TransactionRequest,
        options?: TransactionRequestEncoderOptions
    ): Uint8Array {
        if (transactionRequest.isDynamicFee) {
            return TransactionRequestEncoder.encodeDynamicFeeTransactionRequest(
                transactionRequest,
                options
            );
        }
        return TransactionRequestEncoder.encodeLegacyTransactionRequest(
            transactionRequest,
            options
        );
    }

    /**
     * Encodes a legacy transaction request into a RLP encoded Uint8Array.
     * @param transactionRequest - The transaction request to encode.
     * @param options - The options for the encoding
     * @returns The RLP encoded Uint8Array.
     */
    private static encodeLegacyTransactionRequest(
        transactionRequest: TransactionRequest,
        options?: TransactionRequestEncoderOptions
    ): Uint8Array {
        try {
            // encode each field of the transaction body
            const encodedParts: RlpValue[] = [
                TransactionRequestEncoder.convertToHex(
                    transactionRequest.chainTag,
                    { maxSize: 1 }
                ),
                // block ref is max 8 bytes
                TransactionRequestEncoder.convertToHex(
                    transactionRequest.blockRef.bytes,
                    { maxSize: 8, canonical: true }
                ),
                TransactionRequestEncoder.convertToHex(
                    transactionRequest.expiration,
                    { maxSize: 4 }
                ),
                TransactionRequestEncoder.convertClauses(
                    transactionRequest.clauses
                ),
                // gas price coef is only present in legacy transactions
                TransactionRequestEncoder.convertToHex(
                    transactionRequest.gasPriceCoef ?? 0n,
                    { maxSize: 1, zeroAsEmpty: true }
                ),
                TransactionRequestEncoder.convertToHex(transactionRequest.gas, {
                    maxSize: 8
                }),
                // depends on is optional, encode it as an empty bytes if it is not present
                TransactionRequestEncoder.convertToHex(
                    transactionRequest.dependsOn?.bytes ?? new Uint8Array(),
                    { maxSize: 32 }
                ),
                TransactionRequestEncoder.convertToHex(
                    transactionRequest.nonce,
                    {
                        maxSize: 8
                    }
                ),
                // encode the reserved field
                TransactionRequestEncoder.convertReservedField(
                    transactionRequest
                )
            ];
            // if to hash, dont add signature
            if (options?.withoutSignature) {
                return toBytes(toRlp(encodedParts));
            }
            // add signature if present
            if (transactionRequest.signature !== undefined) {
                return toBytes(
                    toRlp([
                        ...encodedParts,
                        toHex(transactionRequest.signature)
                    ])
                );
            }
            return toBytes(toRlp(encodedParts));
        } catch (error) {
            if (error instanceof RLPEncodingError) {
                throw error;
            }
            throw new RLPEncodingError(
                'encodeLegacyTransactionRequest',
                'Error when encoding legacy transaction request',
                { transactionRequest },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Encodes a dynamic fee transaction request into a RLP encoded Uint8Array.
     * @param transactionRequest - The transaction request to encode.
     * @param options - The options for the encoding
     * @returns The RLP encoded Uint8Array.
     */
    private static encodeDynamicFeeTransactionRequest(
        transactionRequest: TransactionRequest,
        options?: TransactionRequestEncoderOptions
    ): Uint8Array {
        try {
            // encode each field of the transaction body
            const encodedParts: RlpValue[] = [
                TransactionRequestEncoder.convertToHex(
                    transactionRequest.chainTag,
                    { maxSize: 1 }
                ),
                // block ref is max 8 bytes
                TransactionRequestEncoder.convertToHex(
                    transactionRequest.blockRef.bytes,
                    { maxSize: 8, canonical: true }
                ),
                TransactionRequestEncoder.convertToHex(
                    transactionRequest.expiration,
                    { maxSize: 4 }
                ),
                TransactionRequestEncoder.convertClauses(
                    transactionRequest.clauses
                ),
                // max fee fields are present in dynamic fee transactions
                TransactionRequestEncoder.convertToHex(
                    transactionRequest.maxPriorityFeePerGas ?? 0n,
                    { maxSize: 32, zeroAsEmpty: true, canonical: true }
                ),
                TransactionRequestEncoder.convertToHex(
                    transactionRequest.maxFeePerGas ?? 0n,
                    { maxSize: 32, zeroAsEmpty: true, canonical: true }
                ),
                TransactionRequestEncoder.convertToHex(transactionRequest.gas, {
                    maxSize: 8
                }),
                // depends on is optional, encode it as an empty bytes if it is not present
                TransactionRequestEncoder.convertToHex(
                    transactionRequest.dependsOn?.bytes ?? new Uint8Array(),
                    { maxSize: 32 }
                ),
                TransactionRequestEncoder.convertToHex(
                    transactionRequest.nonce,
                    {
                        maxSize: 8
                    }
                ),
                // encode the reserved field
                TransactionRequestEncoder.convertReservedField(
                    transactionRequest
                )
            ];
            // if to hash, dont add signature but add prefix
            if (options?.withoutSignature) {
                return new Uint8Array([
                    TransactionRequestEncoder.DYNAMIC_FEE_PREFIX,
                    ...toBytes(toRlp(encodedParts))
                ]);
            }
            // add signature if present
            const encodedWithSignature =
                transactionRequest.signature !== undefined
                    ? [...encodedParts, toHex(transactionRequest.signature)]
                    : encodedParts;
            const bytes = toBytes(toRlp(encodedWithSignature));
            // dynamic fee transactions are prefixed with 0x51
            return new Uint8Array([
                TransactionRequestEncoder.DYNAMIC_FEE_PREFIX,
                ...bytes
            ]);
        } catch (error) {
            if (error instanceof RLPEncodingError) {
                throw error;
            }
            throw new RLPEncodingError(
                'encodeDynamicFeeTransactionRequest',
                'Error when encoding dynamic fee transaction request',
                { transactionRequest },
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
            TransactionRequestEncoder.convertClause(clause)
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
                TransactionRequestEncoder.convertToHex(
                    clause.to?.bytes ?? new Uint8Array(),
                    { maxSize: 20, canonical: false }
                ),
                // valie is optional, encode it as 0n if it is not present
                TransactionRequestEncoder.convertToHex(clause.value ?? 0n, {
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
        transactionRequest: TransactionRequest
    ): RlpValue[] {
        try {
            const features =
                transactionRequest.reserved?.features ??
                (transactionRequest.isDelegated ? 1 : 0);

            // If no features, omit reserved entirely
            if (features === 0) return [];

            return [
                TransactionRequestEncoder.convertToHex(features, {
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
                { transactionRequest },
                error instanceof Error ? error : undefined
            );
        }
    }
}

export { type TransactionRequestEncoderOptions, TransactionRequestEncoder };
