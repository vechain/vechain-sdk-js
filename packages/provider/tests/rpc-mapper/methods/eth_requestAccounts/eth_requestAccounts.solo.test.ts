import { beforeEach, describe, expect, test } from '@jest/globals';
import { RPC_METHODS, RPCMethodsMap, VechainProvider } from '../../../../src';
import { ThorClient } from '@vechain/sdk-network';
import { soloNetwork, THOR_SOLO_ACCOUNTS_BASE_WALLET } from '../../../fixture';
import { type Wallet, type WalletAccount } from '@vechain/sdk-wallet';
import { ProviderRpcError } from '@vechain/sdk-errors';

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
    let provider: VechainProvider;

    /**
     * Init thor client before each test
     */
    beforeEach(() => {
        // Init thor client
        thorClient = new ThorClient(soloNetwork);

        // Init provider
        provider = new VechainProvider(
            thorClient,
            THOR_SOLO_ACCOUNTS_BASE_WALLET as Wallet
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
            const accounts = (await provider.request({
                method: RPC_METHODS.eth_requestAccounts,
                params: []
            })) as string[];

            // Check if the accounts are the same
            expect(accounts.length).toBeGreaterThan(0);
            expect(accounts).toEqual(
                THOR_SOLO_ACCOUNTS_BASE_WALLET.accounts.map(
                    (account: WalletAccount) => account.address
                )
            );
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
                RPCMethodsMap(thorClient)[RPC_METHODS.eth_requestAccounts]([])
            ).rejects.toThrow(ProviderRpcError);
        });

        /**
         * Negative case 2 - Should throw error if wallet is given, but empty
         */
        test('eth_requestAccounts - Should throw error if wallet is given, but empty', async () => {
            // Error with empty wallet
            await expect(
                RPCMethodsMap(thorClient, undefined)[
                    RPC_METHODS.eth_requestAccounts
                ]([])
            ).rejects.toThrow(ProviderRpcError);
        });
    });
});
