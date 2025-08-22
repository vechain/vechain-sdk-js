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
class RLPCodec {
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
        kind: RLPCodec.RLP_FIELDS.concat([RLPCodec.RLP_SIGNATURE])
    };

    private static readonly RLP_UNSIGNED_TRANSACTION_PROFILE: RLPProfile = {
        name: 'tx',
        kind: RLPCodec.RLP_FIELDS
    };

    public static encodeSignedTransactionRequest(
        transactionRequest: SignedTransactionRequest
    ): Uint8Array {
        return RLPCodec.encodeSignedBodyField(
            {
                ...RLPCodec.mapBody(transactionRequest),
                reserved: transactionRequest.isSponsored
                    ? [Uint8Array.of(1)]
                    : [] // encodeReservedField(tx)
            },
            transactionRequest.signature
        );
    }

    public static encodeTransactionRequest(
        transactionRequest: TransactionRequest
    ): Uint8Array {
        return RLPCodec.encodeUnsignedBodyField({
            ...RLPCodec.mapBody(transactionRequest),
            reserved: transactionRequest.isSponsored ? [Uint8Array.of(1)] : [] // encodeReservedField(tx)
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
            RLPCodec.RLP_SIGNED_TRANSACTION_PROFILE
        ).encoded;
    }

    private static encodeUnsignedBodyField(body: RLPValidObject): Uint8Array {
        return RLPProfiler.ofObject(
            body,
            RLPCodec.RLP_UNSIGNED_TRANSACTION_PROFILE
        ).encoded;
    }

    private static mapBody(
        transactionRequest: TransactionRequest
    ): TransactionRequestJSON {
        return {
            blockRef: transactionRequest.blockRef.toString(),
            chainTag: transactionRequest.chainTag,
            clauses: RLPCodec.mapClauses(transactionRequest),
            dependsOn:
                transactionRequest.dependsOn !== null
                    ? transactionRequest.dependsOn.toString()
                    : null,
            expiration: transactionRequest.expiration,
            gas: transactionRequest.gas,
            gasPriceCoef: transactionRequest.gasPriceCoef,
            nonce: transactionRequest.nonce
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
    gasPriceCoef: bigint;
    nonce: number;
    reserved?: {
        features?: number;
        unused?: Uint8Array[];
    };
}

export { RLPCodec };
