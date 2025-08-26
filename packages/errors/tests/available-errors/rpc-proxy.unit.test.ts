import { describe, expect, test } from '@jest/globals';
import {
    InvalidCommandLineArguments,
    InvalidConfigurationFile,
    InvalidConfigurationFilePath,
    JSONRPCTransactionRevertError,
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
                    { flag: 'flag1', value: 'value1' },
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

    test('JSONRPCTransactionRevertError', () => {
        expect(() => {
            throw new JSONRPCTransactionRevertError('message', 'data');
        }).toThrowError(Error);

        expect(() => {
            throw new JSONRPCTransactionRevertError(
                undefined as unknown as string,
                undefined as unknown as string
            );
        }).toThrowError(Error);
    });
});
