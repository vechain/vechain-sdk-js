import { describe, expect, test } from '@jest/globals';
import { ExpandedBlockResponse } from '@thor/thorest/blocks/response';
import { type ExpandedBlockResponseJSON } from '@thor/thorest/json';

import { ExpandedBlock } from '@thor/thor-client/model/blocks';

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
    transactions: []
};

describe('ExpandedBlock', () => {
    test('fromResponse returns null for null input', () => {
        expect(ExpandedBlock.fromResponse(null)).toBeNull();
    });

    test('fromResponse mirrors expanded response into domain model', () => {
        const response = new ExpandedBlockResponse(BASIC_EXPANDED_BLOCK);
        const block = ExpandedBlock.fromResponse(response);

        expect(block).not.toBeNull();
        expect(block?.number).toBe(BASIC_EXPANDED_BLOCK.number);
        expect(block?.id).toBe(BASIC_EXPANDED_BLOCK.id);
        expect(block?.size).toBe(BASIC_EXPANDED_BLOCK.size);
        expect(block?.parentID).toBe(BASIC_EXPANDED_BLOCK.parentID);
        expect(block?.timestamp).toBe(BASIC_EXPANDED_BLOCK.timestamp);
        expect(block?.gasLimit).toBe(BigInt(BASIC_EXPANDED_BLOCK.gasLimit));
        expect(block?.beneficiary).toBe(BASIC_EXPANDED_BLOCK.beneficiary);
        expect(block?.gasUsed).toBe(BigInt(BASIC_EXPANDED_BLOCK.gasUsed));
        expect(block?.baseFeePerGas).toBeUndefined();
        expect(block?.totalScore).toBe(BASIC_EXPANDED_BLOCK.totalScore);
        expect(block?.txsRoot).toBe(BASIC_EXPANDED_BLOCK.txsRoot);
        expect(block?.txsFeatures).toBe(BASIC_EXPANDED_BLOCK.txsFeatures);
        expect(block?.stateRoot).toBe(BASIC_EXPANDED_BLOCK.stateRoot);
        expect(block?.receiptsRoot).toBe(BASIC_EXPANDED_BLOCK.receiptsRoot);
        expect(block?.com).toBe(BASIC_EXPANDED_BLOCK.com);
        expect(block?.signer).toBe(BASIC_EXPANDED_BLOCK.signer);
        expect(block?.transactions).toEqual([]);
        expect(block?.isTrunk).toBe(true);
        expect(block?.isFinalized).toBe(false);
    });
});

