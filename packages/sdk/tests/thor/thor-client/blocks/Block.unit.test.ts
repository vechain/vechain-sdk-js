import { describe, expect, test } from '@jest/globals';
import { RegularBlockResponse } from '@thor/thorest/blocks/response';
import { type RegularBlockResponseJSON } from '@thor/thorest/json';

import { Block } from '@thor/thor-client/model/blocks';

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

describe('Block', () => {
    test('fromResponse returns null when response is null', () => {
        expect(Block.fromResponse(null)).toBeNull();
    });

    test('fromResponse mirrors regular block response', () => {
        const response = new RegularBlockResponse(BASIC_BLOCK_JSON);
        const block = Block.fromResponse(response);

        expect(block).not.toBeNull();
        expect(block?.number).toBe(BASIC_BLOCK_JSON.number);
        expect(block?.id).toBe(BASIC_BLOCK_JSON.id);
        expect(block?.size).toBe(BASIC_BLOCK_JSON.size);
        expect(block?.parentID).toBe(BASIC_BLOCK_JSON.parentID);
        expect(block?.timestamp).toBe(BASIC_BLOCK_JSON.timestamp);
        expect(block?.gasLimit).toBe(BigInt(BASIC_BLOCK_JSON.gasLimit));
        expect(block?.beneficiary).toBe(BASIC_BLOCK_JSON.beneficiary);
        expect(block?.gasUsed).toBe(BigInt(BASIC_BLOCK_JSON.gasUsed));
        expect(block?.baseFeePerGas).toBeUndefined();
        expect(block?.totalScore).toBe(BASIC_BLOCK_JSON.totalScore);
        expect(block?.txsRoot).toBe(BASIC_BLOCK_JSON.txsRoot);
        expect(block?.txsFeatures).toBe(BASIC_BLOCK_JSON.txsFeatures);
        expect(block?.stateRoot).toBe(BASIC_BLOCK_JSON.stateRoot);
        expect(block?.receiptsRoot).toBe(BASIC_BLOCK_JSON.receiptsRoot);
        expect(block?.com).toBe(BASIC_BLOCK_JSON.com);
        expect(block?.signer).toBe(BASIC_BLOCK_JSON.signer);
        expect(block?.transactions).toEqual([]);
        expect(block?.isTrunk).toBe(true);
        expect(block?.isFinalized).toBe(false);
    });
});

