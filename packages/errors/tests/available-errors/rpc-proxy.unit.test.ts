import { describe, expect, test } from '@jest/globals';
import {
    InvalidCommandLineArguments,
    InvalidConfigurationFile,
    InvalidConfigurationFilePath,
    VechainSDKError
} from '../../src';

/**
 * Available errors test - RPC Proxy
 * @group unit/errors/available-errors/rpc-proxy
 */
describe('Error package Available errors test - RPC Proxy', () => {
    /**
     * InvalidCommandLineArguments
     */
    test('InvalidCommandLineArguments', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            expect(() => {
                throw new InvalidCommandLineArguments(
                    'method',
                    'message',
                    { flags: ['flag1', 'flag2'], message: 'Some message' },
                    innerError
                );
            }).toThrowError(VechainSDKError);
        });
    });

    /**
     * InvalidConfigurationFilePath
     */
    test('InvalidConfigurationFilePath', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            expect(() => {
                throw new InvalidConfigurationFilePath(
                    'method',
                    'message',
                    { filePath: 'path' },
                    innerError
                );
            }).toThrowError(VechainSDKError);
        });
    });

    /**
     * InvalidConfigurationFile
     */
    test('InvalidConfigurationFile', () => {
        // Inner error
        [undefined, new Error('error')].forEach((innerError) => {
            expect(() => {
                throw new InvalidConfigurationFile(
                    'method',
                    'message',
                    {
                        filePath: 'path',
                        wrongField: 'field',
                        message: 'Some message'
                    },
                    innerError
                );
            }).toThrowError(VechainSDKError);
        });
    });
});
