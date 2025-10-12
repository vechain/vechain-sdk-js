import {
    Clause,
    TransactionRequest
} from '@thor/thor-client/model/transactions';
import {
    Address,
    BufferKind,
    CompactFixedHexBlobKind,
    Hex,
    HexBlobKind,
    HexUInt,
    InvalidEncodingError,
    NumericKind,
    OptionalFixedHexBlobKind,
    RLP,
    RLPProfile,
    RLPProfiler,
    type RLPValidObject,
    Secp256k1
} from '@common'; // eslint-disable-next-line @typescript-eslint/no-extraneous-class

const FQP = 'packages/sdk/src/thor/signer/TransactionRequestRLPCodec.ts!';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class TransactionRequestRLPCodec {
    private static readonly DYNAMIC_FEE_PREFIX = 0x51;

    private static readonly RLP_SIGNED_STATE = {
        name: 'signature',
        kind: new BufferKind()
    };

    private static readonly RLP_UNSIGNED_STATE = [
        { name: 'beggar', kind: new OptionalFixedHexBlobKind(20) },
        { name: 'originSignature', kind: new BufferKind() },
        { name: 'gasPayerSignature', kind: new BufferKind() }
    ];

    // EIP-1559 dynamic fee transaction fields (type 2)
    private static readonly RLP_DYNAMIC_FEE_TO_HASH = [
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

    private static readonly RLP_DYNAMIC_FEE_SIGNED_REQUEST =
        TransactionRequestRLPCodec.RLP_DYNAMIC_FEE_TO_HASH.concat(
            TransactionRequestRLPCodec.RLP_SIGNED_STATE
        );

    private static readonly RLP_DYNAMIC_FEE_UNSIGNED_REQUEST =
        TransactionRequestRLPCodec.RLP_DYNAMIC_FEE_TO_HASH.concat(
            TransactionRequestRLPCodec.RLP_UNSIGNED_STATE
        );

    private static readonly RLP_LEGACY_TO_HASH = [
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

    private static readonly RLP_LEGACY_SIGNED_REQUEST =
        TransactionRequestRLPCodec.RLP_LEGACY_TO_HASH.concat(
            TransactionRequestRLPCodec.RLP_SIGNED_STATE
        );

    private static readonly RLP_LEGACY_UNSIGNED_REQUEST =
        TransactionRequestRLPCodec.RLP_LEGACY_TO_HASH.concat(
            TransactionRequestRLPCodec.RLP_UNSIGNED_STATE
        );

    public static decode(encoded: Uint8Array): TransactionRequest {
        // Check if this is a dynamic fee transaction (EIP-1559) by looking for 0x51 prefix
        const isDynamicFee =
            encoded.length > 0 &&
            encoded[0] === TransactionRequestRLPCodec.DYNAMIC_FEE_PREFIX;
        // Remove the transaction type prefix if present
        const encodedData = isDynamicFee ? encoded.slice(1) : encoded;
        return TransactionRequestRLPCodec.decodeDynamicFee(encodedData);
    }

    private static decodeClauses(decoded: RLPValidObject): Clause[] {
        return (decoded.clauses as []).map((decodedClause: RLPValidObject) => {
            return new Clause(
                (decodedClause.to as string) != null
                    ? Address.of(decodedClause.to as string)
                    : null,
                BigInt(decodedClause.value as string),
                Hex.of(decodedClause.data as string) ?? undefined
            );
        });
    }

    // Dynamic fee transaction - use maxFeePerGas and maxPriorityFeePerGas
    private static decodeDynamicFee(encoded: Uint8Array): TransactionRequest {
        let rlpProfile: RLPProfile;
        const size = (RLP.ofEncoded(encoded).decoded as unknown[]).length;
        if (
            TransactionRequestRLPCodec.RLP_DYNAMIC_FEE_SIGNED_REQUEST.length ===
            size
        ) {
            rlpProfile = {
                name: 'tx',
                kind: TransactionRequestRLPCodec.RLP_DYNAMIC_FEE_SIGNED_REQUEST
            } satisfies RLPProfile;
        } else if (
            TransactionRequestRLPCodec.RLP_DYNAMIC_FEE_UNSIGNED_REQUEST
                .length === size
        ) {
            rlpProfile = {
                name: 'tx',
                kind: TransactionRequestRLPCodec.RLP_DYNAMIC_FEE_UNSIGNED_REQUEST
            } satisfies RLPProfile;
        } else {
            throw new InvalidEncodingError(
                `${FQP}TransactionRequestRLPCodec.decodeDynamicFee(encoded: Uint8Array): TransactionRequest`,
                `invalid encoded transaction request`
            );
        }
        const decoded = RLPProfiler.ofObjectEncoded(encoded, rlpProfile)
            .object as RLPValidObject;
        const clauses = TransactionRequestRLPCodec.decodeClauses(decoded);
        const signature = decoded.signature as Uint8Array;
        const gasPayerSignature =
            signature !== null && signature !== undefined
                ? signature.slice(Secp256k1.SIGNATURE_LENGTH, signature.length)
                : (decoded.gasPayerSignature as Uint8Array);
        const originSignature =
            signature !== null && signature !== undefined
                ? signature.slice(0, Secp256k1.SIGNATURE_LENGTH)
                : (decoded.originSignature as Uint8Array);
        return new TransactionRequest(
            {
                beggar:
                    decoded.beggar !== null && decoded.beggar !== undefined
                        ? Address.of(decoded.beggar as string)
                        : undefined,
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
                nonce: decoded.nonce as number
            },
            originSignature,
            gasPayerSignature,
            signature
        );
    }

    // Legacy transaction - use gasPriceCoef
    private static decodeLegacy(decoded: unknown[]): number {
        return decoded.length;
    }

    // private static decodeLegacy(decoded: RLPValidObject): TransactionRequest {
    //     const clauses = TransactionRequestRLPCodec.decodeClauses(decoded);
    //     return new TransactionRequest({
    //         beggar:
    //             decoded.beggar !== null
    //                 ? Address.of(decoded.beggar as string)
    //                 : undefined,
    //         blockRef: HexUInt.of(decoded.blockRef as string),
    //         chainTag: decoded.chainTag as number,
    //         clauses,
    //         dependsOn:
    //             decoded.dependsOn === null
    //                 ? null
    //                 : Hex.of(decoded.dependsOn as string),
    //         expiration: decoded.expiration as number,
    //         gas: BigInt(decoded.gas as bigint),
    //         gasPriceCoef: BigInt(decoded.gasPriceCoef as bigint),
    //         nonce: decoded.nonce as number
    //     });
    // }

    public static encode(
        transactionRequest: TransactionRequest,
        isToHash: boolean = false
    ): Uint8Array {
        const body = {
            ...TransactionRequestRLPCodec.mapBody(transactionRequest)
        };
        if (transactionRequest.isDynamicFee) {
            // For EIP-1559 transactions, prepend the transaction type (0x51)
            return new Uint8Array([
                TransactionRequestRLPCodec.DYNAMIC_FEE_PREFIX,
                ...RLPProfiler.ofObject(body, {
                    name: 'tx',
                    kind: isToHash
                        ? TransactionRequestRLPCodec.RLP_DYNAMIC_FEE_TO_HASH
                        : transactionRequest.isSigned
                          ? TransactionRequestRLPCodec.RLP_DYNAMIC_FEE_SIGNED_REQUEST
                          : TransactionRequestRLPCodec.RLP_DYNAMIC_FEE_UNSIGNED_REQUEST
                }).encoded
            ]);
        }
        return RLPProfiler.ofObject(body, {
            name: 'tx',
            kind: isToHash
                ? TransactionRequestRLPCodec.RLP_LEGACY_TO_HASH
                : transactionRequest.isSigned
                  ? TransactionRequestRLPCodec.RLP_LEGACY_SIGNED_REQUEST
                  : TransactionRequestRLPCodec.RLP_LEGACY_UNSIGNED_REQUEST
        }).encoded;
    }

    private static mapBody(transactionRequest: TransactionRequest): Body {
        const baseBody = {
            beggar: transactionRequest.beggar?.toString(),
            blockRef: transactionRequest.blockRef.toString(),
            chainTag: transactionRequest.chainTag,
            clauses: TransactionRequestRLPCodec.mapClauses(transactionRequest),
            dependsOn:
                transactionRequest.dependsOn !== null
                    ? transactionRequest.dependsOn.toString()
                    : null,
            expiration: transactionRequest.expiration,
            gas: transactionRequest.gas,
            gasPayerSignature: transactionRequest.gasPayerSignature,
            nonce: transactionRequest.nonce,
            originSignature: transactionRequest.originSignature,
            reserved: transactionRequest.isIntendedToBeSponsored
                ? [Uint8Array.of(1)]
                : [],
            signature: transactionRequest.signature
        };

        // For dynamic fee transactions, use maxFeePerGas and maxPriorityFeePerGas
        if (transactionRequest.isDynamicFee) {
            return {
                ...baseBody,
                maxFeePerGas: transactionRequest.maxFeePerGas ?? 0n,
                maxPriorityFeePerGas:
                    transactionRequest.maxPriorityFeePerGas ?? 0n
            } satisfies Body;
        }

        // For legacy transactions (type 0), use gasPriceCoef
        return {
            ...baseBody,
            gasPriceCoef: transactionRequest.gasPriceCoef
        } satisfies Body;
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

interface Body {
    beggar?: string;
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
    gasPayerSignature?: Uint8Array;
    gasPriceCoef?: bigint; // Optional for dynamic fee transactions
    nonce: number;
    maxFeePerGas?: bigint; // For EIP-1559 dynamic fee transactions
    maxPriorityFeePerGas?: bigint; // For EIP-1559 dynamic fee transactions
    originSignature: Uint8Array;
    reserved: Uint8Array[]; // For VIP-191 transactions is the beggar address encoded prefixed with one byte valued 1.
    signature: Uint8Array;
}

export { TransactionRequestRLPCodec };
