import { describe } from '@jest/globals';
import {
    Clause,
    ClauseBuilder,
    Transaction,
    type TransactionBody
} from '@thor';
import { SOLO_NETWORK } from '@utils';
import {
    Address,
    BlockRef,
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
} from '@vcdm';
import type { RegularBlockResponseJSON } from '@thor/blocks/json';
import { TEST_ACCOUNTS } from '../fixture';
import { TransactionRequest } from '@thor/model/TransactionRequest';

const { TRANSACTION_RECEIVER } = TEST_ACCOUNTS.TRANSACTION;

const RLP_FEATURES = {
    name: 'reserved.features',
    kind: new NumericKind(4)
};

const RLP_FIELDS = [
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

const RLP_UNSIGNED_TRANSACTION_PROFILE: RLPProfile = {
    name: 'tx',
    kind: RLP_FIELDS
};

function encodeBodyField(body: RLPValidObject): Uint8Array {
    return RLPProfiler.ofObject(body, RLP_UNSIGNED_TRANSACTION_PROFILE).encoded;
}

function encode(tx: Transaction): Uint8Array {
    return encodeBodyField({
        ...tx.body,
        clauses: tx.body.clauses as Array<{
            to: string | null;
            value: bigint;
            data: string;
        }>,
        reserved: [] // encodeReservedField(tx)
    });
}

function encodeTR(tr: TransactionRequest): Uint8Array {
    const clauses: Array<{ to: string | null; value: bigint; data: string }> =
        tr.clauses.map(
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
    return encodeBodyField({
        ...tr.toJSON(),
        clauses,
        reserved: [] // encodeReservedField(tx)
    });
}

// function encodeReservedField(tx: Transaction): Uint8Array[] {
//     // Check if is reserved or not
//     const reserved = tx.body.reserved ?? {};
//     // Init kind for features
//     const featuresKind = RLP_FEATURES.kind;
//     // Features list
//     const featuresList = [
//         featuresKind.data(reserved.features ?? 0, RLP_FEATURES.name).encode(),
//         ...(reserved.unused ?? [])
//     ];
//     // Trim features list
//     while (featuresList.length > 0) {
//         if (featuresList[featuresList.length - 1].length === 0) {
//             featuresList.pop();
//         } else {
//             break;
//         }
//     }
//     return featuresList;
// }

describe('codec', () => {
    const block = {
        number: 88,
        id: '0x00000058f9f240032e073f4a078c5f0f3e04ae7272e4550de41f10723d6f8b2e',
        size: 364,
        parentID:
            '0x000000577127e6426fbe5a303755ba64c167f173bb4e9b60156a62bced1551d8',
        timestamp: 1749224420,
        gasLimit: '150000000',
        beneficiary: '0xf077b491b355e64048ce21e3a6fc4751eeea77fa',
        gasUsed: '0',
        totalScore: 88,
        txsRoot:
            '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
        txsFeatures: 1,
        stateRoot:
            '0xe030c534b66bd1c1b156ada9508bd639cdcbeb7ea1e932f4fd998857b3c4f30a',
        receiptsRoot:
            '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
        com: false,
        signer: '0xf077b491b355e64048ce21e3a6fc4751eeea77fa',
        isTrunk: true,
        isFinalized: false,
        baseFeePerGas: '0x9184e72a000',
        transactions: []
    } satisfies RegularBlockResponseJSON;

    const clause = ClauseBuilder.transferVET(
        Address.of(TRANSACTION_RECEIVER.address),
        1n
    );

    const c = new Clause(
        Address.of(TRANSACTION_RECEIVER.address),
        1n,
        null,
        null,
        null
    );

    const txBody: TransactionBody = {
        chainTag: SOLO_NETWORK.chainTag,
        blockRef: BlockRef.of(block.id).toString(),
        expiration: 32,
        clauses: [clause],
        gasPriceCoef: 0,
        gas: 100000,
        dependsOn: null,
        nonce: 8
    };

    test('test 1', () => {
        const tx = Transaction.of(txBody);
        console.log(HexUInt.of(tx.encode(false)).toString());
        console.log(HexUInt.of(encode(tx)).toString());
    });

    test('test 2', () => {
        const tr = new TransactionRequest(
            BlockRef.of(block.id),
            SOLO_NETWORK.chainTag,
            [c],
            32,
            100000n,
            0n,
            8,
            null
        );
        console.log(HexUInt.of(encodeTR(tr)).toString());
    });
});
