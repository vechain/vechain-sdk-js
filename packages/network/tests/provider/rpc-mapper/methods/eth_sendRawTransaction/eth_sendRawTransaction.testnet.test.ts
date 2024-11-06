import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient
} from '../../../../../src';
import {
    JSONRPCInternalError,
    JSONRPCInvalidParams
} from '@vechain/sdk-errors';

/**
 * RPC Mapper integration tests for 'eth_sendRawTransaction' method
 *
 * @group integration/rpc-mapper/methods/eth_sendRawTransaction-testnet
 */
describe('RPC Mapper - eth_sendRawTransaction method tests', () => {
    /**
     * Thor client instance
     */
    let thorClient: ThorClient;

    /**
     * Init thor client before each test
     */
    beforeEach(() => {
        // Init thor client
        thorClient = ThorClient.at(TESTNET_URL);
    });

    /**
     * eth_sendRawTransaction RPC call tests - Negative cases
     */
    describe('eth_sendRawTransaction - Negative cases', () => {
        /**
         *  Invalid params - Invalid params - params number
         */
        test('eth_sendRawTransaction - Invalid params - params number', async () => {
            await expect(async () => {
                (await RPCMethodsMap(thorClient)[
                    RPC_METHODS.eth_sendRawTransaction
                ]([])) as string;
            }).rejects.toThrowError(JSONRPCInvalidParams);
        });

        /**
         *  Invalid params - Invalid transaction decoded hex format
         */
        test('eth_sendRawTransaction - Invalid transaction decoded hex format', async () => {
            await expect(async () => {
                (await RPCMethodsMap(thorClient)[
                    RPC_METHODS.eth_sendRawTransaction
                ](['0xINVALID'])) as string;
            }).rejects.toThrowError(JSONRPCInvalidParams);
        });

        /**
         *  Invalid params - Invalid transaction decoded hex format
         */
        test('eth_sendRawTransaction - Invalid transaction decoded', async () => {
            await expect(async () => {
                (await RPCMethodsMap(thorClient)[
                    RPC_METHODS.eth_sendRawTransaction
                ](['0xcaffe'])) as string;
            }).rejects.toThrowError(JSONRPCInternalError);
        });
    });
});
