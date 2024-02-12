import { beforeEach, describe, expect, test } from '@jest/globals';
import { RPC_METHODS, RPCMethodsMap } from '../../../../src';
import { ThorClient } from '@vechain/vechain-sdk-network';
import { testNetwork, THOR_SOLO_ACCOUNTS_BASE_WALLET } from '../../../fixture';
import { BaseWallet, type Wallet } from '@vechain/vechain-sdk-wallet';
import { ProviderRpcError } from '@vechain/vechain-sdk-errors';

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
     * Init thor client before each test
     */
    beforeEach(() => {
        // Init thor client
        thorClient = new ThorClient(testNetwork);
    });

    /**
     * eth_requestAccounts RPC call tests - Positive cases
     */
    describe('eth_requestAccounts - Positive cases', () => {
        /**
         * Positive case 1 - Should be able to get addresses from a NON-empty wallet
         */
        test('eth_requestAccounts - Should be able to get addresses from a NON-empty wallet', async () => {
            // Get accounts
            const accounts = (await RPCMethodsMap(
                thorClient,
                THOR_SOLO_ACCOUNTS_BASE_WALLET as Wallet
            )[RPC_METHODS.eth_requestAccounts]([])) as string[];

            // Check if the accounts are the same
            expect(accounts.length).toBeGreaterThan(0);
            expect(accounts).toEqual(
                THOR_SOLO_ACCOUNTS_BASE_WALLET.accounts.map(
                    (account) => account.address
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
            // Init a wallet BUT empty
            const emptyBaseWallet = new BaseWallet([]);

            // Error with empty wallet
            await expect(
                RPCMethodsMap(thorClient, emptyBaseWallet)[
                    RPC_METHODS.eth_requestAccounts
                ]([])
            ).rejects.toThrow(ProviderRpcError);
        });
    });
});
