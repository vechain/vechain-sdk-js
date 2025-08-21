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
} from '@vcdm';

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

    private static readonly RLP_UNSIGNED_TRANSACTION_PROFILE: RLPProfile = {
        name: 'tx',
        kind: RLPCodecTransactionRequest.RLP_FIELDS
    };

    public static encodeSignedTransactionRequest(
        transactionRequest: SignedTransactionRequest
    ): Uint8Array {
        const clauses = this.mapClauses(transactionRequest);
        return RLPCodecTransactionRequest.encodeSignedBodyField(
            {
                ...transactionRequest.toJSON(),
                clauses,
                reserved: transactionRequest.isDelegated
                    ? [Uint8Array.of(1)]
                    : [] // encodeReservedField(tx)
            },
            transactionRequest.signature
        );
    }

    public static encodeTransactionRequest(
        transactionRequest: TransactionRequest
    ): Uint8Array {
        const clauses =
            RLPCodecTransactionRequest.mapClauses(transactionRequest);
        return RLPCodecTransactionRequest.encodeUnsignedBodyField({
            ...transactionRequest.toJSON(),
            clauses,
            reserved: transactionRequest.isDelegated ? [Uint8Array.of(1)] : [] // encodeReservedField(tx)
        });
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

export { RLPCodecTransactionRequest };
