import { describe, expect, test } from '@jest/globals';
import { ExpandedBlockResponse } from '@thor/thorest/blocks/response';
import { type ExpandedBlockResponseJSON } from '@thor/thorest/json';

import { ExpandedBlock } from '@thor/thor-client/model';

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

    test('fromResponse wraps expanded response into domain model', () => {
        const response = new ExpandedBlockResponse(BASIC_EXPANDED_BLOCK);
        const block = ExpandedBlock.fromResponse(response);

        expect(block).not.toBeNull();
        expect(block?.data).toEqual(response);
        expect(block?.number).toBe(BASIC_EXPANDED_BLOCK.number);
        expect(block?.transactions).toEqual([]);
    });
});

