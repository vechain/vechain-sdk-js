import {
    Clause,
    TransactionRequest,
    SignedTransactionRequest,
    SponsoredTransactionRequest
} from '@thor/thor-client/model/transactions';
import * as nc_utils from '@noble/curves/abstract/utils';
import {
    Address,
    Blake2b256,
    BufferKind,
    CompactFixedHexBlobKind,
    Hex,
    HexBlobKind,
    HexUInt,
    IllegalArgumentError,
    NumericKind,
    OptionalFixedHexBlobKind,
    Quantity,
    RLP,
    type RLPProfile,
    RLPProfiler,
    type RLPValidObject,
    Secp256k1
} from '@common';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class RLPCodecTransactionRequest {
    /**
     * RLP_FIELDS is an array of objects that defines the structure and encoding scheme
     * for various components in a transaction using Recursive Length Prefix (RLP) encoding.
     * Each object in the array represents a field in the transaction, specifying its name and kind.
     * The `kind` attribute is an instance of an RLP coder that determines how the field is encoded.
     *
     * Properties
     * - `chainTag` - Represent the id of the chain the transaction is sent to.
     * - `blockRef` - Represent the last block of the chain the transaction is sent to.
     * - `expiration` -  Represent the expiration date of the transaction.
     * - `clauses` - List of clause objects, each containing:
     *   - `to` - Represent the destination of the transaction.
     *   - `value` - Represent the 'wei' quantity (VET or VTHO) value the transaction is worth.
     *   - `data` - Represent the content of the transaction.
     * - `gasPriceCoef` - Represent the gas price coefficient of the transaction.
     * - `gas` - Represent the gas limit of the transaction.
     * - `dependsOn` - Represent the hash of the transaction the current transaction depends on.
     * - `nonce` - Represent the nonce of the transaction.
     * - `reserved` -  Reserved field.
     */

    private static readonly RLP_FIELDS = [
        { name: 'chainTag', kind: new NumericKind(1) },
        { name: 'blockRef', kind: new CompactFixedHexBlobKind(8) },
        { name: 'expiration', kind: new NumericKind(4) },
        {
            name: 'clauses',
            kind: {
                item: [
                    {
                        name: 'to',
                        kind: new OptionalFixedHexBlobKind(20)
                    },
                    { name: 'value', kind: new NumericKind(32) },
                    { name: 'data', kind: new HexBlobKind() }
                ]
            }
        },
        { name: 'gasPriceCoef', kind: new NumericKind(1) },
        { name: 'gas', kind: new NumericKind(8) },
        { name: 'dependsOn', kind: new OptionalFixedHexBlobKind(32) },
        { name: 'nonce', kind: new NumericKind(8) },
        { name: 'reserved', kind: { item: new BufferKind() } }
    ];

    // EIP-1559 dynamic fee transaction fields (type 2)
    private static readonly RLP_DYNAMIC_FEE_FIELDS = [
        { name: 'chainTag', kind: new NumericKind(1) },
        { name: 'blockRef', kind: new CompactFixedHexBlobKind(8) },
        { name: 'expiration', kind: new NumericKind(4) },
        {
            name: 'clauses',
            kind: {
                item: [
                    {
                        name: 'to',
                        kind: new OptionalFixedHexBlobKind(20)
                    },
                    { name: 'value', kind: new NumericKind(32) },
                    { name: 'data', kind: new HexBlobKind() }
                ]
            }
        },
        { name: 'maxPriorityFeePerGas', kind: new NumericKind(32) },
        { name: 'maxFeePerGas', kind: new NumericKind(32) },
        { name: 'gas', kind: new NumericKind(8) },
        { name: 'dependsOn', kind: new OptionalFixedHexBlobKind(32) },
        { name: 'nonce', kind: new NumericKind(8) },
        { name: 'reserved', kind: { item: new BufferKind() } }
    ];

    /**
     * Represents a Recursive Length Prefix (RLP) of the transaction signature.
     *
     * Properties
     * - `name` - A string indicating the name of the field in the RLP structure.
     * - `kind` - RLP profile type.
     */

    private static readonly RLP_SIGNATURE = {
        name: 'signature',
        kind: new BufferKind()
    };

    /**
     * Represents a Recursive Length Prefix (RLP) of the signed transaction.
     *
     * Properties
     * - `name` - A string indicating the name of the field in the RLP structure.
     * - `kind` - RLP profile type.
     */

    private static readonly RLP_SIGNED_TRANSACTION_PROFILE: RLPProfile = {
        name: 'tx',
        kind: RLPCodecTransactionRequest.RLP_FIELDS.concat([
            RLPCodecTransactionRequest.RLP_SIGNATURE
        ])
    };

    public static readonly RLP_UNSIGNED_TRANSACTION_PROFILE: RLPProfile = {
        name: 'tx',
        kind: RLPCodecTransactionRequest.RLP_FIELDS
    };

    private static readonly RLP_SIGNED_DYNAMIC_FEE_TRANSACTION_PROFILE: RLPProfile =
        {
            name: 'tx',
            kind: RLPCodecTransactionRequest.RLP_DYNAMIC_FEE_FIELDS.concat([
                RLPCodecTransactionRequest.RLP_SIGNATURE
            ])
        };

    private static readonly RLP_UNSIGNED_DYNAMIC_FEE_TRANSACTION_PROFILE: RLPProfile =
        {
            name: 'tx',
            kind: RLPCodecTransactionRequest.RLP_DYNAMIC_FEE_FIELDS
        };

    /**
     * Decodes an encoded transaction and returns an instance of a TransactionRequest,
     * SignedTransactionRequest, or SponsoredTransactionRequest based on the encoded data.
     *
     * @param {Uint8Array} encoded - The encoded transaction data to decode.
     * @return {TransactionRequest | SignedTransactionRequest | SponsoredTransactionRequest}
     *         Returns a TransactionRequest if the transaction is unsigned.
     *         Returns a SignedTransactionRequest if the transaction is signed.
     *         Returns a SponsoredTransactionRequest if the transaction is signed and includes a gas payer.
     * @throws {IllegalArgumentError} Throws an error if the encoded data is invalid.
     */
    public static decode(
        encoded: Uint8Array
    ):
        | TransactionRequest
        | SignedTransactionRequest
        | SponsoredTransactionRequest {
        try {
            // Check if this is a dynamic fee transaction (EIP-1559) by looking for 0x51 prefix
            const isDynamicFee = encoded.length > 0 && encoded[0] === 0x51;

            // Remove the transaction type prefix if present
            const rlpData = isDynamicFee ? encoded.slice(1) : encoded;

            // Determine if transaction is signed by checking RLP structure length
            const rlpDecoded = RLP.ofEncoded(rlpData).decoded as unknown[];
            const expectedUnsignedLength = isDynamicFee
                ? (
                      RLPCodecTransactionRequest
                          .RLP_UNSIGNED_DYNAMIC_FEE_TRANSACTION_PROFILE
                          .kind as []
                  ).length
                : (
                      RLPCodecTransactionRequest
                          .RLP_UNSIGNED_TRANSACTION_PROFILE.kind as []
                  ).length;
            const isSigned = rlpDecoded.length > expectedUnsignedLength;

            // Select appropriate RLP profile based on transaction type and signature status
            let profile: RLPProfile;
            if (isDynamicFee) {
                profile = isSigned
                    ? RLPCodecTransactionRequest.RLP_SIGNED_DYNAMIC_FEE_TRANSACTION_PROFILE
                    : RLPCodecTransactionRequest.RLP_UNSIGNED_DYNAMIC_FEE_TRANSACTION_PROFILE;
            } else {
                profile = isSigned
                    ? RLPCodecTransactionRequest.RLP_SIGNED_TRANSACTION_PROFILE
                    : RLPCodecTransactionRequest.RLP_UNSIGNED_TRANSACTION_PROFILE;
            }

            // Decode using the appropriate profile
            const decoded = RLPProfiler.ofObjectEncoded(rlpData, profile)
                .object as RLPValidObject;

            // Parse clauses
            const clauses = (decoded.clauses as []).map(
                (decodedClause: RLPValidObject) => {
                    return Clause.of({
                        to: (decodedClause.to as string) ?? null,
                        value:
                            typeof decodedClause.value === 'number'
                                ? Quantity.of(decodedClause.value).toString()
                                : typeof decodedClause.value === 'string'
                                  ? Quantity.of(
                                        HexUInt.of(decodedClause.value).bi
                                    ).toString()
                                  : Quantity.PREFIX,
                        data: (decodedClause.data as string) ?? undefined
                    });
                }
            );

            const isIntendedToBeSponsored = (decoded.reserved as []).length > 0;

            // Create transaction request with appropriate fields based on transaction type
            let transactionRequest: TransactionRequest;
            if (isDynamicFee) {
                // Dynamic fee transaction - use maxFeePerGas and maxPriorityFeePerGas
                transactionRequest = new TransactionRequest({
                    blockRef: HexUInt.of(decoded.blockRef as string),
                    chainTag: decoded.chainTag as number,
                    clauses,
                    dependsOn:
                        decoded.dependsOn === null
                            ? null
                            : Hex.of(decoded.dependsOn as string),
                    expiration: decoded.expiration as number,
                    gas: BigInt(decoded.gas as bigint),
                    gasPriceCoef: 0n, // Dynamic fee transactions use 0 for gasPriceCoef
                    maxFeePerGas:
                        decoded.maxFeePerGas !== undefined &&
                        decoded.maxFeePerGas !== null
                            ? BigInt(decoded.maxFeePerGas as bigint)
                            : undefined,
                    maxPriorityFeePerGas:
                        decoded.maxPriorityFeePerGas !== undefined &&
                        decoded.maxPriorityFeePerGas !== null
                            ? BigInt(decoded.maxPriorityFeePerGas as bigint)
                            : undefined,
                    nonce: decoded.nonce as number,
                    isIntendedToBeSponsored
                });
            } else {
                // Legacy transaction - use gasPriceCoef
                transactionRequest = new TransactionRequest({
                    blockRef: HexUInt.of(decoded.blockRef as string),
                    chainTag: decoded.chainTag as number,
                    clauses,
                    dependsOn:
                        decoded.dependsOn === null
                            ? null
                            : Hex.of(decoded.dependsOn as string),
                    expiration: decoded.expiration as number,
                    gas: BigInt(decoded.gas as bigint),
                    gasPriceCoef: BigInt(decoded.gasPriceCoef as bigint),
                    nonce: decoded.nonce as number,
                    isIntendedToBeSponsored
                });
            }

            if (isSigned) {
                const signature = decoded.signature as Uint8Array;
                const encodedTransactionRequest =
                    RLPCodecTransactionRequest.encodeTransactionRequest(
                        transactionRequest
                    );
                const originSignature = signature.slice(
                    0,
                    Secp256k1.SIGNATURE_LENGTH
                );
                const originHash = Blake2b256.of(
                    encodedTransactionRequest
                ).bytes;
                const origin = Address.ofPublicKey(
                    Secp256k1.recover(originHash, originSignature)
                );
                const signedTransactionRequest = new SignedTransactionRequest({
                    ...transactionRequest,
                    origin,
                    originSignature,
                    signature
                });
                if (signature.length > Secp256k1.SIGNATURE_LENGTH) {
                    const gasPayerSignature = signature.slice(
                        Secp256k1.SIGNATURE_LENGTH,
                        Secp256k1.SIGNATURE_LENGTH * 2
                    );
                    const gasPayerHash = Blake2b256.of(
                        nc_utils.concatBytes(originHash, origin.bytes)
                    ).bytes;
                    const gasPayer = Address.ofPublicKey(
                        Secp256k1.recover(gasPayerHash, gasPayerSignature)
                    );
                    return new SponsoredTransactionRequest({
                        ...signedTransactionRequest,
                        gasPayer,
                        gasPayerSignature
                    });
                }
                return signedTransactionRequest;
            }
            return transactionRequest;
        } catch (error) {
            throw new IllegalArgumentError(
                `${RLPCodecTransactionRequest.decode.name}(encoded: Uint8Array)`,
                'invalid encoded data',
                { encoded },
                error as Error
            );
        }
    }

    /**
     * Encodes a given transaction request into a Uint8Array.
     *
     * @param {TransactionRequest | SignedTransactionRequest} transactionRequest - The transaction request to encode, which can be either a TransactionRequest or a SignedTransactionRequest.
     * @return {Uint8Array} The encoded transaction request as a Uint8Array.
     */
    public static encode(
        transactionRequest: TransactionRequest | SignedTransactionRequest
    ): Uint8Array {
        if (transactionRequest instanceof SignedTransactionRequest) {
            return RLPCodecTransactionRequest.encodeSignedTransactionRequest(
                transactionRequest
            );
        }
        return RLPCodecTransactionRequest.encodeTransactionRequest(
            transactionRequest
        );
    }

    private static encodeSignedTransactionRequest(
        transactionRequest: SignedTransactionRequest
    ): Uint8Array {
        const isDynamicFee = transactionRequest.isDynamicFee();
        const body = {
            ...RLPCodecTransactionRequest.mapBody(transactionRequest),
            reserved:
                transactionRequest.isIntendedToBeSponsored === true
                    ? [Uint8Array.of(1)]
                    : [] // encodeReservedField(tx)
        };

        if (isDynamicFee) {
            const encodedTx =
                RLPCodecTransactionRequest.encodeSignedDynamicFeeBodyField(
                    body,
                    transactionRequest.signature
                );
            // For EIP-1559 transactions, prepend the transaction type (0x51)
            return new Uint8Array([0x51, ...encodedTx]);
        }

        return RLPCodecTransactionRequest.encodeSignedBodyField(
            body,
            transactionRequest.signature
        );
    }

    private static encodeTransactionRequest(
        transactionRequest: TransactionRequest
    ): Uint8Array {
        const isDynamicFee = transactionRequest.isDynamicFee();
        const body = {
            ...RLPCodecTransactionRequest.mapBody(transactionRequest),
            reserved:
                transactionRequest.isIntendedToBeSponsored === true
                    ? [Uint8Array.of(1)]
                    : [] // encodeReservedField(tx)
        };

        if (isDynamicFee) {
            const encodedTx =
                RLPCodecTransactionRequest.encodeUnsignedDynamicFeeBodyField(
                    body
                );
            // For EIP-1559 transactions, prepend the transaction type (0x51)
            return new Uint8Array([0x51, ...encodedTx]);
        }

        return RLPCodecTransactionRequest.encodeUnsignedBodyField(body);
    }

    private static encodeSignedBodyField(
        body: RLPValidObject,
        signature: Uint8Array
    ): Uint8Array {
        return RLPProfiler.ofObject(
            {
                ...body,
                signature
            },
            RLPCodecTransactionRequest.RLP_SIGNED_TRANSACTION_PROFILE
        ).encoded;
    }

    private static encodeUnsignedBodyField(body: RLPValidObject): Uint8Array {
        return RLPProfiler.ofObject(
            body,
            RLPCodecTransactionRequest.RLP_UNSIGNED_TRANSACTION_PROFILE
        ).encoded;
    }

    private static encodeSignedDynamicFeeBodyField(
        body: RLPValidObject,
        signature: Uint8Array
    ): Uint8Array {
        return RLPProfiler.ofObject(
            {
                ...body,
                signature
            },
            RLPCodecTransactionRequest.RLP_SIGNED_DYNAMIC_FEE_TRANSACTION_PROFILE
        ).encoded;
    }

    private static encodeUnsignedDynamicFeeBodyField(
        body: RLPValidObject
    ): Uint8Array {
        return RLPProfiler.ofObject(
            body,
            RLPCodecTransactionRequest.RLP_UNSIGNED_DYNAMIC_FEE_TRANSACTION_PROFILE
        ).encoded;
    }

    private static mapBody(
        transactionRequest: TransactionRequest
    ): TransactionRequestJSON {
        const baseBody = {
            blockRef: transactionRequest.blockRef.toString(),
            chainTag: transactionRequest.chainTag,
            clauses: RLPCodecTransactionRequest.mapClauses(transactionRequest),
            dependsOn:
                transactionRequest.dependsOn !== null
                    ? transactionRequest.dependsOn.toString()
                    : null,
            expiration: transactionRequest.expiration,
            gas: transactionRequest.gas,
            nonce: transactionRequest.nonce
        };

        // For dynamic fee transactions, use maxFeePerGas and maxPriorityFeePerGas
        if (transactionRequest.isDynamicFee()) {
            return {
                ...baseBody,
                maxFeePerGas: transactionRequest.maxFeePerGas ?? 0n,
                maxPriorityFeePerGas:
                    transactionRequest.maxPriorityFeePerGas ?? 0n
            } satisfies TransactionRequestJSON;
        }

        // For legacy transactions (type 0), use gasPriceCoef
        return {
            ...baseBody,
            gasPriceCoef: transactionRequest.gasPriceCoef
        } satisfies TransactionRequestJSON;
    }

    private static mapClauses(transactionRequest: TransactionRequest): Array<{
        to: string | null;
        value: bigint;
        data: string;
    }> {
        return transactionRequest.clauses.map(
            (
                clause: Clause
            ): { to: string | null; value: bigint; data: string } => {
                return {
                    to: clause.to?.toString() ?? null,
                    value: clause.value,
                    data: clause.data?.toString() ?? Hex.PREFIX
                };
            }
        );
    }
}

interface TransactionRequestJSON {
    blockRef: string;
    chainTag: number;
    clauses: Array<{
        to: string | null;
        value: bigint;
        data: string;
    }>;
    dependsOn: string | null;
    expiration: number;
    gas: bigint;
    gasPriceCoef?: bigint; // Optional for dynamic fee transactions
    nonce: number;
    maxFeePerGas?: bigint; // For EIP-1559 dynamic fee transactions
    maxPriorityFeePerGas?: bigint; // For EIP-1559 dynamic fee transactions
    reserved?: {
        features?: number;
        unused?: Uint8Array[];
    };
}

export { RLPCodecTransactionRequest };
