import { describe, expect, test } from '@jest/globals';
import { ExpandedBlockResponse } from '@thor/thorest/blocks/response';
import { type ExpandedBlockResponseJSON } from '@thor/thorest/blocks/json';
import { type TxWithReceiptJSON } from '@thor/thorest/transactions/json';
import { type OutputJSON } from '@thor/thorest/json/OutputJSON';
import { type EventJSON } from '@thor/thorest/json/EventJSON';
import { type TransferJSON } from '@thor/thorest/json/TransferJSON';

import {
    BlockTransaction,
    ExpandedBlock
} from '@thor/thor-client/model/blocks';

const BASIC_EVENT: EventJSON = {
    address: '0x0000000000000000000000000000000000000001',
    topics: ['0x1'],
    data: '0x2'
};

const BASIC_TRANSFER: TransferJSON = {
    sender: '0x0000000000000000000000000000000000000002',
    recipient: '0x0000000000000000000000000000000000000003',
    amount: '0x1'
};

const BASIC_OUTPUT: OutputJSON = {
    contractAddress: '0x0000000000000000000000000000000000000004',
    events: [BASIC_EVENT],
    transfers: [BASIC_TRANSFER]
};

const BASIC_TRANSACTION: TxWithReceiptJSON = {
    id: '0x0000000100000000000000000000000000000000000000000000000000000000',
    type: 0,
    origin: '0x0000000000000000000000000000000000000005',
    delegator: null,
    size: 1,
    chainTag: 1,
    blockRef: '0x0000000000000000',
    expiration: 32,
    clauses: [],
    gasPriceCoef: undefined,
    maxFeePerGas: null,
    maxPriorityFeePerGas: null,
    gas: '0x1',
    dependsOn: null,
    nonce: '0x1',
    gasUsed: 1,
    gasPayer: '0x0000000000000000000000000000000000000006',
    paid: '0x1',
    reward: '0x1',
    reverted: false,
    outputs: [BASIC_OUTPUT]
};

const BASIC_EXPANDED_BLOCK: ExpandedBlockResponseJSON = {
    number: 2,
    id: '0x0000000200000000000000000000000000000000000000000000000000000000',
    size: 0,
    parentID:
        '0x00000001ffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
    timestamp: 0,
    gasLimit: '0',
    beneficiary: '0x0000000000000000000000000000000000000000',
    gasUsed: '0',
    totalScore: 0,
    txsRoot:
        '0x0000000000000000000000000000000000000000000000000000000000000000',
    txsFeatures: 0,
    stateRoot:
        '0x0000000000000000000000000000000000000000000000000000000000000000',
    receiptsRoot:
        '0x0000000000000000000000000000000000000000000000000000000000000000',
    com: false,
    signer: '0x0000000000000000000000000000000000000000',
    isTrunk: true,
    isFinalized: false,
    transactions: [BASIC_TRANSACTION]
};

/**
 * @group unit
 */
describe('ExpandedBlock', () => {
    test('fromResponse returns null for null input', () => {
        expect(ExpandedBlock.fromResponse(null)).toBeNull();
    });

    test('fromResponse mirrors expanded response into domain model', () => {
        const response = new ExpandedBlockResponse(BASIC_EXPANDED_BLOCK);
        const block = ExpandedBlock.fromResponse(response);

        expect(block).not.toBeNull();
        expect(block?.number).toBe(BASIC_EXPANDED_BLOCK.number);
        expect(block?.id.toString()).toBe(BASIC_EXPANDED_BLOCK.id);
        expect(block?.size).toBe(BASIC_EXPANDED_BLOCK.size);
        expect(block?.parentID.toString()).toBe(BASIC_EXPANDED_BLOCK.parentID);
        expect(block?.timestamp).toBe(BASIC_EXPANDED_BLOCK.timestamp);
        expect(block?.gasLimit).toBe(BigInt(BASIC_EXPANDED_BLOCK.gasLimit));
        expect(block?.beneficiary.toString()).toBe(
            BASIC_EXPANDED_BLOCK.beneficiary
        );
        expect(block?.gasUsed).toBe(BigInt(BASIC_EXPANDED_BLOCK.gasUsed));
        expect(block?.baseFeePerGas).toBeUndefined();
        expect(block?.totalScore).toBe(BASIC_EXPANDED_BLOCK.totalScore);
        expect(block?.txsRoot.toString()).toBe(BASIC_EXPANDED_BLOCK.txsRoot);
        expect(block?.txsFeatures).toBe(BASIC_EXPANDED_BLOCK.txsFeatures);
        expect(block?.stateRoot.toString()).toBe(
            BASIC_EXPANDED_BLOCK.stateRoot
        );
        expect(block?.receiptsRoot.toString()).toBe(
            BASIC_EXPANDED_BLOCK.receiptsRoot
        );
        expect(block?.com).toBe(BASIC_EXPANDED_BLOCK.com);
        expect(block?.signer.toString()).toBe(BASIC_EXPANDED_BLOCK.signer);
        expect(block?.transactions).toHaveLength(1);

        const tx = block?.transactions.at(0);
        expect(tx).toBeInstanceOf(BlockTransaction);
        expect(tx?.id.toString()).toBe(BASIC_TRANSACTION.id);
        expect(tx?.outputs).toHaveLength(1);

        const [output] = tx?.outputs ?? [];
        expect(output?.contractAddress?.toString()).toBe(
            BASIC_OUTPUT.contractAddress
        );
        expect(output?.events).toHaveLength(1);
        expect(output?.transfers).toHaveLength(1);

        expect(block?.isTrunk).toBe(true);
        expect(block?.isFinalized).toBe(false);
    });
});
