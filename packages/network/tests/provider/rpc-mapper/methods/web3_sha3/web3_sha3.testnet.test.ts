import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient
} from '../../../../../src';
import { JSONRPCInvalidParams } from '@vechain/sdk-errors';

/**
 * RPC Mapper integration tests for 'web3_sha3' method
 *
 * @group integration/rpc-mapper/methods/web3_sha3
 */
describe('RPC Mapper - web3_sha3 method tests', () => {
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
     * web3_clientVersion RPC call tests - Positive cases
     */
    describe('web3_sha3 - Positive cases', () => {
        /**
         * Should be able to calculate web3_sha3
         */
        test('Should be able to calculate web3_sha3', async () => {
            const web3Sha3 = await RPCMethodsMap(thorClient)[
                RPC_METHODS.web3_sha3
            ](['0x68656c6c6f20776f726c64']);
            expect(web3Sha3).toBe(
                '0x47173285a8d7341e5e972fc677286384f802f8ef42a5ec5f03bbfa254cb01fad'
            );
        });
    });

    /**
     * web3_clientVersion RPC call tests - Negative cases
     */
    describe('web3_sha3 - Negative cases', () => {
        /**
         * Should NOT be able to calculate web3_sha3 of invalid hex
         */
        test('Should NOT be able to calculate web3_sha3 of invalid hex', async () => {
            await expect(
                RPCMethodsMap(thorClient)[RPC_METHODS.web3_sha3]([
                    'INVALID_HEX'
                ])
            ).rejects.toThrowError(JSONRPCInvalidParams);
        });

        /**
         * Should NOT be able to calculate web3_sha3 of invalid params
         */
        test('Should NOT be able to calculate web3_sha3 of invalid params', async () => {
            await expect(
                RPCMethodsMap(thorClient)[RPC_METHODS.web3_sha3]([])
            ).rejects.toThrowError(JSONRPCInvalidParams);
        });
    });
});
