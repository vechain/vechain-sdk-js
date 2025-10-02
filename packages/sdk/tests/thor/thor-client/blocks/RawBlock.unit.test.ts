import { describe, expect, test } from '@jest/globals';
import { RawBlockResponse } from '@thor/thorest/blocks/response';
import { type RawBlockJSON } from '@thor/thorest/json';

import { RawBlock } from '@thor/thor-client/model';

const BASIC_RAW_BLOCK: RawBlockJSON = {
    raw: '0x1234'
};

describe('RawBlock', () => {
    test('fromResponse returns null for null input', () => {
        expect(RawBlock.fromResponse(null)).toBeNull();
    });

    test('fromResponse mirrors raw response into domain model', () => {
        const response = new RawBlockResponse(BASIC_RAW_BLOCK);
        const block = RawBlock.fromResponse(response);

        expect(block).not.toBeNull();
        expect(block?.raw).toBe('0x1234');
    });
});

