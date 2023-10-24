import { describe, expect, test } from '@jest/globals';
import { buildError } from '../src/utils';
import { ERROR_CODES } from '../src/types/errorTypes';
import { InvalidRLPError } from '../src/model/rlp';

describe('RLP errors', () => {
    test('buildInvalidRLPError', () => {
        expect(
            buildError(ERROR_CODES.RLP.INVALID_RLP, 'Invalid RLP Error')
        ).toBeInstanceOf(InvalidRLPError);
    });
});
