import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    RPC_METHODS,
    RPCMethodsMap,
    TESTNET_URL,
    ThorClient
} from '../../../../../src';

/**
 * RPC Mapper integration tests for 'web3_clientVersion' method
 *
 * @group integration/rpc-mapper/methods/web3_clientVersion
 */
describe('RPC Mapper - web3_clientVersion method tests', () => {
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
    describe('web3_clientVersion - Positive cases', () => {
        /**
         * Get client version
         */
        test('web3_clientVersion - positive case 1', async () => {
            const web3ClientVersion = await RPCMethodsMap(thorClient)[
                RPC_METHODS.web3_clientVersion
            ]([]);
            expect(web3ClientVersion).toBe('thor');
        });
    });
});
