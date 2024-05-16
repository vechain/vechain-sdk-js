import { describe, expect, test } from '@jest/globals';
import { accountsFixture } from './fixture';
import { InvalidDataTypeError } from '@vechain/sdk-errors';
import { Hex, secp256k1, ZERO_ADDRESS } from '@vechain/sdk-core';
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
    describe('getAddresses', () => {
        /**
         * Test without blocking execution on steps
         */
        test('Should be able to create a wallet and get addresses from them', () => {
            // Initialize a wallet with the accounts
            const baseWallet = new ProviderInternalBaseWallet(accountsFixture);

            // Get the addresses from the wallet
            expect(baseWallet.accounts).toEqual(accountsFixture);

            // Get the addresses from the wallet
            const addresses = baseWallet.getAddresses();
            expect(addresses).toEqual(
                accountsFixture.map((account) => account.address)
            );
        });
    });

    /**
     * Test 'getAccount' function.
     */
    describe('getAccount', () => {
        /**
         * Should be able to get an account by address
         */
        test('Should be able to get an account by address', () => {
            // Initialize a wallet with the accounts
            const baseWallet = new ProviderInternalBaseWallet(accountsFixture);

            // Get the addresses from the wallet
            const randomAccount =
                accountsFixture[
                    Math.floor(Math.random() * accountsFixture.length)
                ];

            // Get the account by address
            const randomAccountFromWallet = baseWallet.getAccount(
                randomAccount.address
            );

            expect(randomAccountFromWallet).toEqual(randomAccount);
        });

        /**
         * Should get null when trying to get an account by a not existing address
         */
        test('Should get null when trying to get an account by a not existing address', () => {
            // Initialize a wallet with the accounts
            const baseWallet = new ProviderInternalBaseWallet(accountsFixture);

            // Get the account by not existing address
            const notExistingAccount = baseWallet.getAccount(ZERO_ADDRESS);

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
            ).rejects.toThrowError(InvalidDataTypeError);
        });
    });

    /**
     * Test 'getDelegator' function.
     */
    describe('getDelegator', () => {
        /**
         * Should be able to get the delegator options
         */
        test('Should be able to get the delegator', () => {
            // Initialize delegator
            const delegators: SignTransactionOptions[] = [
                {
                    delegatorPrivateKey: Hex.of(secp256k1.generatePrivateKey())
                },
                {
                    delegatorUrl:
                        'https://sponsor-testnet.vechain.energy/by/269'
                }
            ];

            for (const delegator of delegators) {
                // Initialize a wallet with the accounts and delegator
                const baseWalletWithDelegator = new ProviderInternalBaseWallet(
                    accountsFixture,
                    {
                        delegator
                    }
                );

                // Get the delegator from the wallet
                const currentDelegator = baseWalletWithDelegator.getDelegator();

                expect(currentDelegator).toEqual(delegator);
            }
        });

        /**
         * Should get null if delegator is not set
         */
        test('Should get null if delegator is not set', () => {
            // Initialize a wallet with the accounts
            const baseWalletWithoutDelegator = new ProviderInternalBaseWallet(
                accountsFixture
            );

            // Get the delegator from the wallet that has no delegator
            const delegator = baseWalletWithoutDelegator.getDelegator();

            expect(delegator).toBeNull();
        });
    });
});
