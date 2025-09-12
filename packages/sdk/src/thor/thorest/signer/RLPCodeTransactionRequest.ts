import {
    type Clause,
    type SignedTransactionRequest,
    type TransactionRequest
} from '@thor';
import {
    BufferKind,
    CompactFixedHexBlobKind,
    Hex,
    HexBlobKind,
    NumericKind,
    OptionalFixedHexBlobKind,
    type RLPProfile,
    RLPProfiler,
    type RLPValidObject
} from '@common';

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class RLPCodecTransactionRequest {
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

    private static readonly RLP_SIGNATURE = {
        name: 'signature',
        kind: new BufferKind()
    };

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

    public static encodeSignedTransactionRequest(
        transactionRequest: SignedTransactionRequest
    ): Uint8Array {
        const isDynamicFee = transactionRequest.isDynamicFee();
        const body = {
            ...RLPCodecTransactionRequest.mapBody(transactionRequest),
            reserved: transactionRequest.isIntendedToBeSponsored
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

    public static encodeTransactionRequest(
        transactionRequest: TransactionRequest
    ): Uint8Array {
        const isDynamicFee = transactionRequest.isDynamicFee();
        const body = {
            ...RLPCodecTransactionRequest.mapBody(transactionRequest),
            reserved: transactionRequest.isIntendedToBeSponsored
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
