import { describe, expect, test } from '@jest/globals';
import { CertificateSignature, VechainSDKError } from '../../src';

/**
 * Available errors test - Certificate
 * @group unit/errors/available-errors/certificate
 */
describe('Error package Available errors test - Certificate', () => {
    /**
     * CertificateSignature
     */
    test('CertificateSignature', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            expect(() => {
                throw new CertificateSignature(
                    'method',
                    'message',
                    { data: 'data' },
                    innerError
                );
            }).toThrowError(VechainSDKError);
        });
    });
});
