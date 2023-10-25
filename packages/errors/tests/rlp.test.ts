import { describe, expect, test } from '@jest/globals';
import { buildError } from '../src/utils';
import { ERROR_CODES } from '../src/types/errorTypes';
import { InvalidRLPError } from '../src/model/rlp';

/**
 * RLP errors
 */
describe('RLP errors', () => {
    /**
     * Verify that the error is an instance of the expected error InvalidRLPError
     */
    test('Check that the constructed error is an instance of InvalidRLPError', () => {
        expect(
            buildError(ERROR_CODES.RLP.INVALID_RLP, 'Invalid RLP Error', {
                context: 'test'
            })
        ).toBeInstanceOf(InvalidRLPError);
    });
});
