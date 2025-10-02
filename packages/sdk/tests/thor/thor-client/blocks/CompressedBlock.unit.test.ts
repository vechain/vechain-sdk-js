import { describe, expect, test } from '@jest/globals';
import { RegularBlockResponse } from '@thor/thorest/blocks/response';
import { type RegularBlockResponseJSON } from '@thor/thorest/json';

import { CompressedBlock } from '@thor/thor-client/model';

const BASIC_BLOCK_JSON: RegularBlockResponseJSON = {
    number: 1,
    id: '0x0000000100000000000000000000000000000000000000000000000000000000',
    size: 0,
    parentID:
        '0x00000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
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

describe('CompressedBlock', () => {
    test('fromResponse returns null for null input', () => {
        expect(CompressedBlock.fromResponse(null)).toBeNull();
    });

    test('fromResponse wraps response into domain model', () => {
        const response = new RegularBlockResponse(BASIC_BLOCK_JSON);
        const block = CompressedBlock.fromResponse(response);

        expect(block).not.toBeNull();
        expect(block?.data).toEqual(response);
        expect(block?.number).toBe(BASIC_BLOCK_JSON.number);
    });
});

