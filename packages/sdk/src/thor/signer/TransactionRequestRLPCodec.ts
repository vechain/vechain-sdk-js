import {
    Clause,
    TransactionRequest
} from '@thor/thor-client/model/transactions';
import {
    Address,
    Blake2b256,
    BufferKind,
    CompactFixedHexBlobKind,
    Hex,
    HexBlobKind,
    InvalidEncodingError,
    NumericKind,
    OptionalFixedHexBlobKind,
    RLP,
    type RLPProfile,
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
        const body = TransactionRequestRLPCodec.decodeBody(decoded);
        const signature = decoded.signature as Uint8Array;
        const gasPayerSignature =
            signature !== null && signature !== undefined
                ? signature.slice(Secp256k1.SIGNATURE_LENGTH, signature.length)
                : (decoded.gasPayerSignature as Uint8Array);
        const originSignature =
            signature !== null && signature !== undefined
                ? signature.slice(0, Secp256k1.SIGNATURE_LENGTH)
                : (decoded.originSignature as Uint8Array);
        let beggar: Address | undefined;
        if (decoded.beggar !== null && decoded.beggar !== undefined) {
            beggar = Address.of(decoded.beggar as string);
        } else if (signature?.length === Secp256k1.SIGNATURE_LENGTH * 2) {
            const originHash = Blake2b256.of(
                new Uint8Array([
                    TransactionRequestRLPCodec.DYNAMIC_FEE_PREFIX,
                    ...RLPProfiler.ofObject(
                        { ...body },
                        {
                            name: 'tx',
                            kind: TransactionRequestRLPCodec.RLP_DYNAMIC_FEE_TO_HASH
                        }
                    ).encoded
                ])
            ).bytes;
            beggar = Address.ofPublicKey(
                Secp256k1.recover(originHash, originSignature)
            );
        }
        return new TransactionRequest(
            {
                ...TransactionRequestRLPCodec.mapBodyToTransactionRequest(body),
                beggar
            },
            originSignature,
            gasPayerSignature,
            signature
        );
    }

    private static decodeBody(decoded: RLPValidObject): Body {
        const clauses: Array<{
            to: string | null;
            value: bigint;
            data: string;
        }> = (decoded.clauses as RLPValidObject[]).map(
            (decodedClause: RLPValidObject) => ({
                to: (decodedClause.to as string) ?? null,
                value: BigInt(decodedClause.value as string),
                data: (decodedClause.data as string) ?? Hex.PREFIX
            })
        );
        return {
            blockRef: decoded.blockRef as string,
            chainTag: decoded.chainTag as number,
            clauses,
            dependsOn:
                decoded.dependsOn === null
                    ? null
                    : (decoded.dependsOn as string),
            expiration: decoded.expiration as number,
            gas: BigInt(decoded.gas as bigint),
            gasPriceCoef: 0n, // Dynamic fee transactions use 0 for gasPriceCoef
            gasPayerSignature: decoded.gasPayerSignature as Uint8Array,
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
            originSignature: Uint8Array.of(),
            reserved: decoded.reserved as Uint8Array[],
            signature: decoded.signature as Uint8Array
        } satisfies Body;
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
            ...TransactionRequestRLPCodec.mapTransactionRequestToBody(
                transactionRequest
            )
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

    private static mapBodyToTransactionRequest(body: Body): TransactionRequest {
        // Convert clause data back to Clause objects.
        const clauses: Clause[] = body.clauses.map((clauseData) => {
            return new Clause(
                clauseData.to !== null ? Address.of(clauseData.to) : null,
                clauseData.value,
                clauseData.data !== Hex.PREFIX ? Hex.of(clauseData.data) : null
            );
        });
        // Create TransactionRequestParam object.
        const params = {
            beggar:
                body.beggar !== undefined ? Address.of(body.beggar) : undefined,
            blockRef: Hex.of(body.blockRef),
            chainTag: body.chainTag,
            clauses,
            dependsOn: body.dependsOn !== null ? Hex.of(body.dependsOn) : null,
            expiration: body.expiration,
            gas: body.gas,
            gasPriceCoef: body.gasPriceCoef,
            nonce: body.nonce,
            maxFeePerGas: body.maxFeePerGas,
            maxPriorityFeePerGas: body.maxPriorityFeePerGas
        };
        // Create and return TransactionRequest with signatures.
        return new TransactionRequest(
            params,
            body.originSignature,
            body.gasPayerSignature,
            body.signature
        );
    }

    private static mapTransactionRequestToBody(
        transactionRequest: TransactionRequest
    ): Body {
        const clauses: Array<{
            to: string | null;
            value: bigint;
            data: string;
        }> = transactionRequest.clauses.map(
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
        const baseBody = {
            beggar: transactionRequest.beggar?.toString(),
            blockRef: transactionRequest.blockRef.toString(),
            chainTag: transactionRequest.chainTag,
            clauses: clauses,
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
    gasPayerSignature: Uint8Array;
    gasPriceCoef?: bigint; // Optional for dynamic fee transactions
    nonce: number;
    maxFeePerGas?: bigint; // For EIP-1559 dynamic fee transactions
    maxPriorityFeePerGas?: bigint; // For EIP-1559 dynamic fee transactions
    originSignature: Uint8Array;
    reserved: Uint8Array[]; // For VIP-191 transactions is the beggar address encoded prefixed with one byte valued 1.
    signature: Uint8Array;
}

export { TransactionRequestRLPCodec };
