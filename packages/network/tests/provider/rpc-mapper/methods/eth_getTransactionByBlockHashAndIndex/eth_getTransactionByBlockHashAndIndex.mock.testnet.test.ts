import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient
} from '../../../../../src';
import { Hex, ZERO_BYTES } from '@vechain/sdk-core';

/**
 * RPC Mapper integration mock tests for 'eth_getTransactionByBlockHashAndIndex' method
 *
 * @group integration/rpc-mapper/methods/eth_getTransactionByBlockHashAndIndex-mock
 */
describe('RPC Mapper - eth_getTransactionByBlockHashAndIndex method mock tests', () => {
    /**
     * Thor client instance
     */
    let thorClient: ThorClient;

    /**
     * Init thor client before each test
     */
    beforeEach(() => {
        // Init thor client
        thorClient = ThorClient.fromUrl(TESTNET_URL);
    });

    /**
     * eth_getTransactionByBlockHashAndIndex RPC call tests - Positive cases
     */
    describe('eth_getTransactionByBlockHashAndIndex - Positive cases', () => {
        /**
         * Positive case 1 - Return null
         */
        test('Should return null', async () => {
            console.log('ZERO_BYTES(32)', Hex.of(ZERO_BYTES(32)).toString());
            const rpcTransactionByBlockHashAndIndex = (await RPCMethodsMap(
                thorClient
            )[RPC_METHODS.eth_getTransactionByBlockHashAndIndex]([
                Hex.of(ZERO_BYTES(32)).toString(),
                '0x0'
            ])) as string;

            expect(rpcTransactionByBlockHashAndIndex).toBe(null);
        });
    });
});
