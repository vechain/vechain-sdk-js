import { describe, expect, test } from '@jest/globals';
import { ContractDeploymentFailed, VechainSDKError } from '../../src';

/**
 * Available errors test - Contract
 * @group unit/errors/available-errors/contract
 */
describe('Error package Available errors test - Contract', () => {
    /**
     * InvalidAddress
     */
    test('ContractDeploymentFailed', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            expect(() => {
                throw new ContractDeploymentFailed(
                    'method',
                    'message',
                    { data: 'data' },
                    innerError
                );
            }).toThrowError(VechainSDKError);
        });
    });
});
