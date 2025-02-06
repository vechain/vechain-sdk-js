import { Hex, Secp256k1, ZERO_ADDRESS } from '@vechain/sdk-core';
import { InvalidDataType } from '@vechain/sdk-errors';
import { accountsFixture } from './fixture';
import { describe, expect, test } from '@jest/globals';
import {
    ProviderInternalBaseWallet,
    type SignTransactionOptions
} from '../../../../../src';

/**
 * Unit test for ProviderInternalBaseWallet class.
 *
 * @group unit/provider/helpers/provider-internal-base-wallet
 */
describe('Base wallet tests', () => {
    /**
     * Test 'getAddresses' function.
     */
    describe('getAddresses sync and async version', () => {
        /**
         * Test without blocking execution on steps
         */
        test('Should be able to create a wallet and get addresses from them', async () => {
            // Initialize a wallet with the accounts
            const baseWallet = new ProviderInternalBaseWallet(accountsFixture);

            // Get the addresses from the wallet
            expect(baseWallet.accounts).toEqual(accountsFixture);

            // Get the addresses from the wallet
            const addresses = await baseWallet.getAddresses();
            expect(addresses).toEqual(
                accountsFixture.map((account) => account.address)
            );

            // Get addresses synchronously
            const addressesSync = baseWallet.getAddressesSync();
            expect(addressesSync).toEqual(
                accountsFixture.map((account) => account.address)
            );

            // Expect the addresses to be the same
            expect(addresses).toEqual(addressesSync);
        });
    });

    /**
     * Test 'getAccount' function.
     */
    describe('getAccount sync and async version', () => {
        /**
         * Should be able to get an account by address
         */
        test('Should be able to get an account by address', async () => {
            // Initialize a wallet with the accounts
            const baseWallet = new ProviderInternalBaseWallet(accountsFixture);

            // Get the addresses from the wallet
            const randomAccount =
                accountsFixture[
                    // eslint-disable-next-line sonarjs/pseudo-random
                    Math.floor(Math.random() * accountsFixture.length)
                ];

            // Get the account by address
            const randomAccountFromWallet = await baseWallet.getAccount(
                randomAccount.address
            );
            expect(randomAccountFromWallet).toEqual(randomAccount);

            // Get the account by address synchronously
            const randomAccountFromWalletSync = baseWallet.getAccountSync(
                randomAccount.address
            );
            expect(randomAccountFromWalletSync).toEqual(randomAccount);

            // Expect the addresses to be the same
            expect(randomAccountFromWallet).toEqual(
                randomAccountFromWalletSync
            );
        });

        /**
         * Should be able to get an account by index
         */
        test('Should be able to get an account by index', async () => {
            // Initialize a wallet with the accounts
            const baseWallet = new ProviderInternalBaseWallet(accountsFixture);

            // Random index
            const randomIndex = Math.floor(
                // eslint-disable-next-line sonarjs/pseudo-random
                Math.random() * accountsFixture.length
            );

            // Get the addresses from the wallet
            const randomAccount = accountsFixture[randomIndex];

            // Get the account by address
            const randomAccountFromWallet =
                await baseWallet.getAccount(randomIndex);

            expect(randomAccountFromWallet).toEqual(randomAccount);
        });

        /**
         * Should be able to get the first account if account index is not provided
         */
        test('Should be able to get the first account', async () => {
            // Initialize a wallet with the accounts
            const baseWallet = new ProviderInternalBaseWallet(accountsFixture);

            // Get the account by address
            const randomAccountFromWallet = await baseWallet.getAccount();

            expect(randomAccountFromWallet).toEqual(accountsFixture[0]);
        });

        /**
         * Should get null when trying to get an account by a not existing address
         */
        test('Should get null when trying to get an account by a not existing address', async () => {
            // Initialize a wallet with the accounts
            const baseWallet = new ProviderInternalBaseWallet(accountsFixture);

            // Get the account by not existing address
            const notExistingAccount =
                await baseWallet.getAccount(ZERO_ADDRESS);

            expect(notExistingAccount).toEqual(null);
        });

        /**
         * Should throw error when trying to get an account by invalid address
         */
        test('Should throw error when trying to get an account by invalid address', async () => {
            // Initialize a wallet with the accounts
            const baseWallet = new ProviderInternalBaseWallet(accountsFixture);

            // Get the account by address
            const invalidAddress = 'INVALID_ADDRESS';
            await expect(
                baseWallet.getAccount(invalidAddress)
            ).rejects.toThrowError(InvalidDataType);
        });

        /**
         * Should get null when trying to get an account by a not existing index
         */
        test('Should get null when trying to get an account by a wallet without accounts', async () => {
            // Initialize a wallet with the accounts
            const baseWallet = new ProviderInternalBaseWallet([]);

            // Get the account by not existing index
            const notExistingAccount = await baseWallet.getAccount();

            expect(notExistingAccount).toEqual(null);
        });
    });

    /**
     * Test 'getGasPayer' function.
     */
    describe('getGasPayer sync and async version', () => {
        /**
         * Should be able to get the gasPayer options
         */
        test('Should be able to get the gasPayer', async () => {
            // Initialize gasPayer
            const delegators: SignTransactionOptions[] = [
                {
                    gasPayerPrivateKey: Hex.of(Secp256k1.generatePrivateKey())
                        .digits
                },
                {
                    gasPayerServiceUrl:
                        'https://sponsor-testnet.vechain.energy/by/269'
                }
            ];

            for (const delegator of delegators) {
                // Initialize a wallet with the accounts and gasPayer
                const baseWalletWithDelegator = new ProviderInternalBaseWallet(
                    accountsFixture,
                    {
                        delegator
                    }
                );

                // Get the gasPayer from the wallet
                const currentDelegator =
                    await baseWalletWithDelegator.getDelegator();
                expect(currentDelegator).toEqual(delegator);

                // Get the gasPayer from the wallet synchronously
                const currentDelegatorSync =
                    baseWalletWithDelegator.getDelegatorSync();
                expect(currentDelegatorSync).toEqual(delegator);

                // Expect the gasPayer to be the same
                expect(currentDelegator).toEqual(currentDelegatorSync);
            }
        });

        /**
         * Should get null if gasPayer is not set
         */
        test('Should get null if gasPayer is not set', async () => {
            // Initialize a wallet with the accounts
            const baseWalletWithoutDelegator = new ProviderInternalBaseWallet(
                accountsFixture
            );

            // Get the gasPayer from the wallet that has no gasPayer
            const delegator = await baseWalletWithoutDelegator.getDelegator();

            expect(delegator).toBeNull();
        });
    });
});
