"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractProviderInternalWallet = void 0;
const sdk_core_1 = require("@vechain/sdk-core");
const sdk_errors_1 = require("@vechain/sdk-errors");
const signer_1 = require("../../../../signer");
const thor_client_1 = require("../../../../thor-client");
/**
 * Abstract implementation of Provider internal wallet class.
 */
class AbstractProviderInternalWallet {
    /**
     * List of accounts in the wallet.
     */
    accounts;
    /**
     * Options for signing a transaction with gasPayer.
     */
    gasPayer;
    /**
     * Create a new wallet.
     *
     * @param accounts List of accounts in the wallet.
     * @param options Optional options for signing a transaction with gasPayer.
     */
    constructor(accounts, options) {
        this.accounts = accounts;
        this.gasPayer = options?.gasPayer;
    }
    /**
     * SYNC Version of getSigner()
     *
     * Get a signer into the internal wallet provider
     * for the given address.
     *
     * @param parentProvider - The parent provider of the Internal Wallet.
     * @param addressOrIndex - Address or index of the account.
     * @returns The signer for the given address.
     */
    getSignerSync(parentProvider, addressOrIndex) {
        // Get the account from the wallet
        const signerAccount = this.getAccountSync(addressOrIndex);
        // Return a new signer (if exists)
        if (signerAccount?.privateKey !== undefined) {
            return new signer_1.VeChainPrivateKeySigner(signerAccount.privateKey, parentProvider);
        }
        // Return null if the account is not found
        return null;
    }
    /**
     * SYNC Version of getAddresses()
     *
     * Get the list of addresses in the wallet.
     *
     * @returns The list of addresses in the wallet.
     */
    getAddressesSync() {
        return this.accounts.map((account) => account.address);
    }
    /**
     * SYNC Version of getAccount()
     *
     * Get an account given an address or an index.
     *
     * @param addressOrIndex - Address or index of the account.
     * @returns The account with the given address, or null if not found.
     * @throws {InvalidDataType}
     */
    getAccountSync(addressOrIndex) {
        if (addressOrIndex === undefined ||
            typeof addressOrIndex === 'number') {
            return this.accounts[addressOrIndex ?? 0] ?? null;
        }
        // Check if the address is valid
        if (!sdk_core_1.Address.isValid(addressOrIndex)) {
            throw new sdk_errors_1.InvalidDataType('AbstractProviderInternalWallet.getAccountSync()', 'Invalid params expected an address.', { addressOrIndex });
        }
        // Get the account by address
        const account = this.accounts.find((account) => sdk_core_1.Address.checksum(sdk_core_1.HexUInt.of(account.address)) ===
            sdk_core_1.Address.checksum(sdk_core_1.HexUInt.of(addressOrIndex)));
        return account ?? null;
    }
    /**
     * SYNC Version of getGasPayer()
     *
     * Get the options for signing a transaction with gasPayer (if any).
     *
     * @returns The options for signing a transaction with gasPayer.
     */
    getGasPayerSync() {
        return (0, thor_client_1.DelegationHandler)(this.gasPayer).gasPayerOrNull();
    }
}
exports.AbstractProviderInternalWallet = AbstractProviderInternalWallet;
