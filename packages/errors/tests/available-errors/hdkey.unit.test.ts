import { describe, expect, test } from '@jest/globals';
import { InvalidHDKey, InvalidHDKeyMnemonic, VechainSDKError } from '../../src';

/**
 * Available errors test - HDKey
 * @group unit/errors/available-errors/hdkey
 */
describe('Error package Available errors test - HDKey', () => {
    // Define the type for fragment data
    interface FragmentData {
        wordlistSize: number; // Ensure this is strictly a number
    }

    /**
     * Helper function to test InvalidHDKeyMnemonic
     * @param innerError - The inner error, if any
     * @param data - The fragment data for the test
     */
    const testInvalidHDKeyMnemonic = (
        innerError?: Error,
        data?: FragmentData // Allow the whole object to be undefined
    ): void => {
        expect(() => {
            throw new InvalidHDKeyMnemonic(
                'method',
                'message',
                data,
                innerError
            );
        }).toThrowError(VechainSDKError);
    };

    /**
     * Test InvalidHDKeyMnemonic
     */
    test('InvalidHDKeyMnemonic', () => {
        // Inner error options
        const innerErrors: Array<Error | undefined> = [
            undefined,
            new Error('error')
        ];
        // Fragment type options, ensuring valid types
        const fragmentData: Array<FragmentData | undefined> = [
            { wordlistSize: 0 },
            undefined
        ];

        innerErrors.forEach((innerError) => {
            fragmentData.forEach((data) => {
                testInvalidHDKeyMnemonic(innerError, data);
            });
        });
    });

    /**
     * Helper function to test InvalidHDKey
     * @param innerError - The inner error, if any
     */
    const testInvalidHDKey = (innerError?: Error): void => {
        expect(() => {
            throw new InvalidHDKey(
                'method',
                'message',
                {
                    derivationPath: 'path',
                    chainCode: new Uint8Array(0),
                    publicKey: new Uint8Array(0)
                },
                innerError
            );
        }).toThrowError(VechainSDKError);
    };

    /**
     * Test InvalidHDKey
     */
    test('InvalidHDKey', () => {
        // Inner error options
        const innerErrors: Array<Error | undefined> = [
            undefined,
            new Error('error')
        ];

        innerErrors.forEach((innerError) => {
            testInvalidHDKey(innerError);
        });
    });
});
