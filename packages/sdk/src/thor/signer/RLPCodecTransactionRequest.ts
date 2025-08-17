import { type Clause, type TransactionRequest } from '@thor';
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
    private static readonly RLP_FEATURES = {
        name: 'reserved.features',
        kind: new NumericKind(4)
    };

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

    public static encodeTransactionRequest(
        transactionRequest: TransactionRequest
    ): Uint8Array {
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
        return RLPCodecTransactionRequest.encodeBodyField({
            ...transactionRequest.toJSON(),
            clauses,
            reserved: [] // encodeReservedField(tx)
        });
    }

    private static encodeBodyField(body: RLPValidObject): Uint8Array {
        return RLPProfiler.ofObject(
            body,
            RLPCodecTransactionRequest.RLP_UNSIGNED_TRANSACTION_PROFILE
        ).encoded;
    }
}

export { RLPCodecTransactionRequest };
