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
    NumericKind,
    OptionalFixedHexBlobKind,
    type RLPProfile,
    RLPProfiler,
    type RLPValidObject
} from '@common'; // eslint-disable-next-line @typescript-eslint/no-extraneous-class

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class TransactionRequestRLPCodec {
    // EIP-1559 dynamic fee transaction fields (type 2)
    private static readonly RLP_DYNAMIC_FEE_CRYPTO_FIELDS = [
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

    private static readonly RLP_DYNAMIC_FEE_REQUEST_FIELDS = [
        ...TransactionRequestRLPCodec.RLP_DYNAMIC_FEE_CRYPTO_FIELDS,
        {
            name: 'beggar',
            kind: new OptionalFixedHexBlobKind(Address.DIGITS / 2)
        },
        {
            name: 'gasPayerSignature',
            kind: new BufferKind()
        },
        {
            name: 'originSignature',
            kind: new BufferKind()
        },
        {
            name: 'signature',
            kind: new BufferKind()
        }
    ];

    private static readonly RLP_DYNAMIC_FEE_REQUEST_PROFILE: RLPProfile = {
        name: 'tx',
        kind: TransactionRequestRLPCodec.RLP_DYNAMIC_FEE_REQUEST_FIELDS
    };

    private static readonly RLP_DYNAMIC_FEE_SIGNED_REQUEST_PROFILE: RLPProfile =
        {
            name: 'tx',
            kind: [
                ...TransactionRequestRLPCodec.RLP_DYNAMIC_FEE_CRYPTO_FIELDS,
                { name: 'signature', kind: new BufferKind() }
            ]
        };

    private static readonly RLP_LEGACY_CRYPTO_FIELDS = [
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

    private static readonly RLP_LEGACY_REQUEST_FIELDS = [
        ...TransactionRequestRLPCodec.RLP_LEGACY_CRYPTO_FIELDS,
        {
            name: 'beggar',
            kind: new OptionalFixedHexBlobKind(Address.DIGITS / 2)
        },
        {
            name: 'gasPayerSignature',
            kind: new BufferKind()
        },
        {
            name: 'originSignature',
            kind: new BufferKind()
        },
        {
            name: 'signature',
            kind: new BufferKind()
        }
    ];

    private static readonly RLP_LEGACY_REQUEST_PROFILE: RLPProfile = {
        name: 'tx',
        kind: TransactionRequestRLPCodec.RLP_LEGACY_REQUEST_FIELDS
    };

    private static readonly RLP_LEGACY_SIGNED_REQUEST_PROFILE: RLPProfile = {
        name: 'tx',
        kind: [
            ...TransactionRequestRLPCodec.RLP_LEGACY_CRYPTO_FIELDS,
            { name: 'signature', kind: new BufferKind() }
        ]
    };

    public static decode(encoded: Uint8Array): TransactionRequest {
        // Check if this is a dynamic fee transaction (EIP-1559) by looking for 0x51 prefix
        const isDynamicFee = encoded.length > 0 && encoded[0] === 0x51;

        // Remove the transaction type prefix if present
        const rlpData = isDynamicFee ? encoded.slice(1) : encoded;

        // Select the appropriate RLP profile based on transaction type and signature status
        let profile: RLPProfile;
        if (isDynamicFee) {
            profile =
                TransactionRequestRLPCodec.RLP_DYNAMIC_FEE_REQUEST_PROFILE;
        } else {
            profile = TransactionRequestRLPCodec.RLP_LEGACY_REQUEST_PROFILE;
        }

        // Decode using the appropriate profile
        const decoded = RLPProfiler.ofObjectEncoded(rlpData, profile)
            .object as RLPValidObject;

        if (isDynamicFee) {
            // Dynamic fee transaction - use maxFeePerGas and maxPriorityFeePerGas
            return TransactionRequestRLPCodec.decodeDynamicFee(decoded);
        } else {
            // Legacy transaction - use gasPriceCoef
            return TransactionRequestRLPCodec.decodeLegacy(decoded);
        }
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
    private static decodeDynamicFee(
        decoded: RLPValidObject
    ): TransactionRequest {
        const clauses = TransactionRequestRLPCodec.decodeClauses(decoded);
        return new TransactionRequest(
            {
                beggar:
                    decoded.beggar !== null
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
            decoded.originSignature !== null
                ? (decoded.originSignature as Uint8Array)
                : undefined,
            decoded.gasPayerSignature !== null
                ? (decoded.gasPayerSignature as Uint8Array)
                : undefined,
            decoded.signature !== null
                ? (decoded.signature as Uint8Array)
                : undefined
        );
    }

    // Legacy transaction - use gasPriceCoef
    private static decodeLegacy(decoded: RLPValidObject): TransactionRequest {
        const clauses = TransactionRequestRLPCodec.decodeClauses(decoded);
        return new TransactionRequest(
            {
                beggar:
                    decoded.beggar !== null
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
                gasPriceCoef: BigInt(decoded.gasPriceCoef as bigint),
                nonce: decoded.nonce as number
            },
            decoded.originSignature !== null
                ? (decoded.originSignature as Uint8Array)
                : undefined,
            decoded.gasPayerSignature !== null
                ? (decoded.gasPayerSignature as Uint8Array)
                : undefined,
            decoded.signature !== null
                ? (decoded.signature as Uint8Array)
                : undefined
        );
    }

    public static encode(transactionRequest: TransactionRequest): Uint8Array {
        const body = {
            ...TransactionRequestRLPCodec.mapRequestBody(transactionRequest)
        };
        if (transactionRequest.isDynamicFee) {
            return new Uint8Array([
                0x51,
                ...RLPProfiler.ofObject(body, {
                    name: 'tx',
                    kind: TransactionRequestRLPCodec.RLP_DYNAMIC_FEE_REQUEST_FIELDS
                }).encoded
            ]);
        }
        return RLPProfiler.ofObject(body, {
            name: 'tx',
            kind: TransactionRequestRLPCodec.RLP_LEGACY_REQUEST_FIELDS
        }).encoded;
    }

    public static encodeToSign(
        transactionRequest: TransactionRequest
    ): Uint8Array {
        const body = {
            ...TransactionRequestRLPCodec.mapCryptoBody(transactionRequest),
            beggar: undefined,
            gasPayerSignature: undefined,
            originSignature: undefined,
            signature: undefined
        };
        if (transactionRequest.isDynamicFee) {
            // For EIP-1559 transactions, prepend the transaction type (0x51)
            return new Uint8Array([
                0x51,
                ...RLPProfiler.ofObject(body, {
                    name: 'tx',
                    kind: TransactionRequestRLPCodec.RLP_DYNAMIC_FEE_CRYPTO_FIELDS
                }).encoded
            ]);
        }
        return RLPProfiler.ofObject(body, {
            name: 'tx',
            kind: TransactionRequestRLPCodec.RLP_LEGACY_CRYPTO_FIELDS
        }).encoded;
    }

    public static encodeToSend(
        transactionRequest: TransactionRequest
    ): Uint8Array {
        const body = {
            ...TransactionRequestRLPCodec.mapSignedBody(transactionRequest),
            beggar: undefined,
            gasPayerSignature: undefined,
            originSignature: undefined
        };
        if (transactionRequest.isDynamicFee) {
            // For EIP-1559 transactions, prepend the transaction type (0x51)
            return new Uint8Array([
                0x51,
                ...RLPProfiler.ofObject(
                    body,
                    TransactionRequestRLPCodec.RLP_DYNAMIC_FEE_SIGNED_REQUEST_PROFILE
                ).encoded
            ]);
        }
        return RLPProfiler.ofObject(
            body,
            TransactionRequestRLPCodec.RLP_LEGACY_SIGNED_REQUEST_PROFILE
        ).encoded;
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

    private static mapCryptoBody(
        transactionRequest: TransactionRequest
    ): CryptoBody {
        const baseBody = {
            blockRef: transactionRequest.blockRef.toString(),
            chainTag: transactionRequest.chainTag,
            clauses: TransactionRequestRLPCodec.mapClauses(transactionRequest),
            dependsOn:
                transactionRequest.dependsOn !== null
                    ? transactionRequest.dependsOn.toString()
                    : null,
            expiration: transactionRequest.expiration,
            gas: transactionRequest.gas,
            nonce: transactionRequest.nonce,
            reserved: transactionRequest.isIntendedToBeSponsored
                ? [Uint8Array.of(1)]
                : [] // encodeReservedField(tx)
        };

        // For dynamic fee transactions, use maxFeePerGas and maxPriorityFeePerGas
        if (transactionRequest.isDynamicFee) {
            return {
                ...baseBody,
                maxFeePerGas: transactionRequest.maxFeePerGas ?? 0n,
                maxPriorityFeePerGas:
                    transactionRequest.maxPriorityFeePerGas ?? 0n
            } satisfies CryptoBody;
        }

        // For legacy transactions (type 0), use gasPriceCoef
        return {
            ...baseBody,
            gasPriceCoef: transactionRequest.gasPriceCoef
        } satisfies CryptoBody;
    }

    private static mapRequestBody(
        transactionRequest: TransactionRequest
    ): RequestBody {
        return {
            ...TransactionRequestRLPCodec.mapCryptoBody(transactionRequest),
            beggar: transactionRequest.beggar?.toString(),
            gasPayerSignature: transactionRequest.gasPayerSignature,
            originSignature: transactionRequest.originSignature,
            signature: transactionRequest.signature
        } satisfies RequestBody;
    }

    private static mapSignedBody(
        transactionRequest: TransactionRequest
    ): SignedBody {
        return {
            ...TransactionRequestRLPCodec.mapCryptoBody(transactionRequest),
            signature: transactionRequest.signature
        } satisfies SignedBody;
    }
}

interface CryptoBody {
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
    reserved: Uint8Array[];
}

interface RequestBody extends CryptoBody {
    beggar?: string;
    gasPayerSignature?: Uint8Array;
    originSignature?: Uint8Array;
    signature?: Uint8Array;
}

interface SignedBody extends CryptoBody {
    signature?: Uint8Array;
}

export { TransactionRequestRLPCodec };
