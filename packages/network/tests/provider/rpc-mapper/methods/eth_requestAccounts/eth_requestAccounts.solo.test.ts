import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    type ProviderInternalWallet,
    RPC_METHODS,
    RPCMethodsMap,
    THOR_SOLO_URL,
    ThorClient,
    VeChainProvider
} from '../../../../../src';
import { getUnusedBaseWallet } from '../../../../fixture';
import { JSONRPCInvalidParams } from '@vechain/sdk-errors';
import { retryOperation } from '../../../../test-utils';

/**
 * RPC Mapper integration tests for 'eth_requestAccounts' method
 *
 * @group integration/rpc-mapper/methods/eth_requestAccounts
 */
describe('RPC Mapper - eth_requestAccounts method tests', () => {
    /**
     * Thor client instance
     */
    let thorClient: ThorClient;

    /**
     * Provider instance
     */
    let provider: VeChainProvider;

    /**
     * Init thor client before each test
     */
    beforeEach(() => {
        // Init thor client
        thorClient = ThorClient.at(THOR_SOLO_URL);

        // Init provider
        provider = new VeChainProvider(
            thorClient,
            getUnusedBaseWallet() as ProviderInternalWallet
        );
    });

    /**
     * eth_requestAccounts RPC call tests - Positive cases
     */
    describe('eth_requestAccounts - Positive cases', () => {
        /**
         * Positive case 1 - Should be able to get addresses from a NON-empty wallet
         */
        test('eth_requestAccounts - Should be able to get addresses from a NON-empty wallet', async () => {
            // Get accounts - Instead of using RPCMethodsMap, we can use provider directly
            const accounts = (await retryOperation(
                async () =>
                    await provider.request({
                        method: RPC_METHODS.eth_requestAccounts,
                        params: []
                    })
            )) as string[];

            // Check if the accounts are the same
            expect(accounts.length).toBeGreaterThan(0);
        });
    });

    /**
     * eth_requestAccounts RPC call tests - Negative cases
     */
    describe('eth_requestAccounts - Negative cases', () => {
        /**
         * Negative case 1 - Should throw error if wallet is not given
         */
        test('eth_requestAccounts - Should throw error if wallet is not given', async () => {
            await expect(
                retryOperation(
                    async () =>
                        await RPCMethodsMap(thorClient)[
                            RPC_METHODS.eth_requestAccounts
                        ]([])
                )
            ).rejects.toThrowError(JSONRPCInvalidParams);
        });

        /**
         * Negative case 2 - Should throw error if wallet is given, but empty
         */
        test('eth_requestAccounts - Should throw error if wallet is given, but empty', async () => {
            // Error with empty wallet
            await expect(
                retryOperation(
                    async () =>
                        await RPCMethodsMap(thorClient)[
                            RPC_METHODS.eth_requestAccounts
                        ]([])
                )
            ).rejects.toThrowError(JSONRPCInvalidParams);
        });
    });
});
