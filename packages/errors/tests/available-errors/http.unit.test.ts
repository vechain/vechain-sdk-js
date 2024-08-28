import { describe, expect, test } from '@jest/globals';
import { InvalidHTTPRequest, VechainSDKError } from '../../src';

/**
 * Available errors test - HTTP
 * @group unit/errors/available-errors/http
 */
describe('Error package Available errors test - HTTP', () => {
    /**
     * InvalidHTTPRequest
     */
    test('InvalidHTTPRequest', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            expect(() => {
                throw new InvalidHTTPRequest(
                    'method',
                    'message',
                    {
                        method: 'method',
                        url: 'url'
                    },
                    innerError
                );
            }).toThrowError(VechainSDKError);
        });
    });
});
