import { describe, expect, test } from '@jest/globals';
import { CertificateSignatureMismatch, VechainSDKError } from '../../src';

/**
 * Available errors test - Certificate
 * @group unit/errors/available-errors/certificate
 */
describe('Error package Available errors test - Certificate', () => {
    /**
     * CertificateSignatureMismatch
     */
    test('CertificateSignatureMismatch', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            expect(() => {
                throw new CertificateSignatureMismatch(
                    'method',
                    'message',
                    { data: 'data' },
                    innerError
                );
            }).toThrowError(VechainSDKError);
        });
    });
});
