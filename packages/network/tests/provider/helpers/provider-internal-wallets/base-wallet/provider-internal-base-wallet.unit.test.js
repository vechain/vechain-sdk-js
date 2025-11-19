"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_core_1 = require("@vechain/sdk-core");
const sdk_errors_1 = require("@vechain/sdk-errors");
const fixture_1 = require("./fixture");
const globals_1 = require("@jest/globals");
const src_1 = require("../../../../../src");
/**
 * Unit test for ProviderInternalBaseWallet class.
 *
 * @group unit/provider/helpers/provider-internal-base-wallet
 */
(0, globals_1.describe)('Base wallet tests', () => {
    /**
     * Test 'getAddresses' function.
     */
    (0, globals_1.describe)('getAddresses sync and async version', () => {
        /**
         * Test without blocking execution on steps
         */
        (0, globals_1.test)('Should be able to create a wallet and get addresses from them', async () => {
            // Initialize a wallet with the accounts
            const baseWallet = new src_1.ProviderInternalBaseWallet(fixture_1.accountsFixture);
            // Get the addresses from the wallet
            (0, globals_1.expect)(baseWallet.accounts).toEqual(fixture_1.accountsFixture);
            // Get the addresses from the wallet
            const addresses = await baseWallet.getAddresses();
            (0, globals_1.expect)(addresses).toEqual(fixture_1.accountsFixture.map((account) => account.address));
            // Get addresses synchronously
            const addressesSync = baseWallet.getAddressesSync();
            (0, globals_1.expect)(addressesSync).toEqual(fixture_1.accountsFixture.map((account) => account.address));
            // Expect the addresses to be the same
            (0, globals_1.expect)(addresses).toEqual(addressesSync);
        });
    });
    /**
     * Test 'getAccount' function.
     */
    (0, globals_1.describe)('getAccount sync and async version', () => {
        /**
         * Should be able to get an account by address
         */
        (0, globals_1.test)('Should be able to get an account by address', async () => {
            // Initialize a wallet with the accounts
            const baseWallet = new src_1.ProviderInternalBaseWallet(fixture_1.accountsFixture);
            // Get the addresses from the wallet
            const randomAccount = fixture_1.accountsFixture[
            // eslint-disable-next-line sonarjs/pseudo-random
            Math.floor(Math.random() * fixture_1.accountsFixture.length)];
            // Get the account by address
            const randomAccountFromWallet = await baseWallet.getAccount(randomAccount.address);
            (0, globals_1.expect)(randomAccountFromWallet).toEqual(randomAccount);
            // Get the account by address synchronously
            const randomAccountFromWalletSync = baseWallet.getAccountSync(randomAccount.address);
            (0, globals_1.expect)(randomAccountFromWalletSync).toEqual(randomAccount);
            // Expect the addresses to be the same
            (0, globals_1.expect)(randomAccountFromWallet).toEqual(randomAccountFromWalletSync);
        });
        /**
         * Should be able to get an account by index
         */
        (0, globals_1.test)('Should be able to get an account by index', async () => {
            // Initialize a wallet with the accounts
            const baseWallet = new src_1.ProviderInternalBaseWallet(fixture_1.accountsFixture);
            // Random index
            const randomIndex = Math.floor(
            // eslint-disable-next-line sonarjs/pseudo-random
            Math.random() * fixture_1.accountsFixture.length);
            // Get the addresses from the wallet
            const randomAccount = fixture_1.accountsFixture[randomIndex];
            // Get the account by address
            const randomAccountFromWallet = await baseWallet.getAccount(randomIndex);
            (0, globals_1.expect)(randomAccountFromWallet).toEqual(randomAccount);
        });
        /**
         * Should be able to get the first account if account index is not provided
         */
        (0, globals_1.test)('Should be able to get the first account', async () => {
            // Initialize a wallet with the accounts
            const baseWallet = new src_1.ProviderInternalBaseWallet(fixture_1.accountsFixture);
            // Get the account by address
            const randomAccountFromWallet = await baseWallet.getAccount();
            (0, globals_1.expect)(randomAccountFromWallet).toEqual(fixture_1.accountsFixture[0]);
        });
        /**
         * Should get null when trying to get an account by a not existing address
         */
        (0, globals_1.test)('Should get null when trying to get an account by a not existing address', async () => {
            // Initialize a wallet with the accounts
            const baseWallet = new src_1.ProviderInternalBaseWallet(fixture_1.accountsFixture);
            // Get the account by not existing address
            const notExistingAccount = await baseWallet.getAccount(sdk_core_1.ZERO_ADDRESS);
            (0, globals_1.expect)(notExistingAccount).toEqual(null);
        });
        /**
         * Should throw error when trying to get an account by invalid address
         */
        (0, globals_1.test)('Should throw error when trying to get an account by invalid address', async () => {
            // Initialize a wallet with the accounts
            const baseWallet = new src_1.ProviderInternalBaseWallet(fixture_1.accountsFixture);
            // Get the account by address
            const invalidAddress = 'INVALID_ADDRESS';
            await (0, globals_1.expect)(baseWallet.getAccount(invalidAddress)).rejects.toThrowError(sdk_errors_1.InvalidDataType);
        });
        /**
         * Should get null when trying to get an account by a not existing index
         */
        (0, globals_1.test)('Should get null when trying to get an account by a wallet without accounts', async () => {
            // Initialize a wallet with the accounts
            const baseWallet = new src_1.ProviderInternalBaseWallet([]);
            // Get the account by not existing index
            const notExistingAccount = await baseWallet.getAccount();
            (0, globals_1.expect)(notExistingAccount).toEqual(null);
        });
    });
    /**
     * Test 'getGasPayer' function.
     */
    (0, globals_1.describe)('getGasPayer sync and async version', () => {
        /**
         * Should be able to get the gasPayer options
         */
        (0, globals_1.test)('Should be able to get the gasPayer', async () => {
            // Initialize gasPayer
            const privateKey = await sdk_core_1.Secp256k1.generatePrivateKey();
            const gasPayers = [
                {
                    gasPayerPrivateKey: sdk_core_1.Hex.of(privateKey).digits
                },
                {
                    gasPayerServiceUrl: 'https://sponsor-testnet.vechain.energy/by/269'
                }
            ];
            for (const gasPayer of gasPayers) {
                // Initialize a wallet with the accounts and gasPayer
                const baseWalletWithGasPayer = new src_1.ProviderInternalBaseWallet(fixture_1.accountsFixture, {
                    gasPayer
                });
                // Get the gasPayer from the wallet
                const currentGasPayer = await baseWalletWithGasPayer.getGasPayer();
                (0, globals_1.expect)(currentGasPayer).toEqual(gasPayer);
                // Get the gasPayer from the wallet synchronously
                const currentGasPayerSync = baseWalletWithGasPayer.getGasPayerSync();
                (0, globals_1.expect)(currentGasPayerSync).toEqual(gasPayer);
                // Expect the gasPayer to be the same
                (0, globals_1.expect)(currentGasPayer).toEqual(currentGasPayerSync);
            }
        });
        /**
         * Should get null if gasPayer is not set
         */
        (0, globals_1.test)('Should get null if gasPayer is not set', async () => {
            // Initialize a wallet with the accounts
            const baseWalletWithoutGasPayer = new src_1.ProviderInternalBaseWallet(fixture_1.accountsFixture);
            // Get the gasPayer from the wallet that has no gasPayer
            const gasPayer = await baseWalletWithoutGasPayer.getGasPayer();
            (0, globals_1.expect)(gasPayer).toBeNull();
        });
    });
});
