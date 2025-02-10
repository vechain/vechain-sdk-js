import { Hex, Mnemonic, Secp256k1 } from '@vechain/sdk-core';

/**
 * Check if the url field is valid
 * @param url - URL to check
 * @returns True if the url is valid, false otherwise
 */
function isValidUrl(url: string): boolean {
    try {
        // eslint-disable-next-line no-new
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

/**
 * Check if the port field is valid
 * @param port - Port to check
 * @returns True if the port is valid, false otherwise
 */
function isValidPort(port: number): boolean {
    return !isNaN(port) && Number.isInteger(port) && port >= 0;
}

/**
 * Check if the accounts (as array or private keys) field is valid
 * @param accounts - Account to check
 * @returns True if the account is valid, false otherwise
 */
function isValidAccountsAsListOfPrivateKeys(accounts: string[]): boolean {
    return accounts.every((account) => {
        if (Hex.isValid(account)) {
            return Secp256k1.isValidPrivateKey(Hex.of(account).bytes);
        }
        return false;
    });
}

/**
 * Check if the mnemonic is valid
 * @param mnemonicWords - Mnemonic to check
 * @returns True if the mnemonic is valid, false otherwise
 */
function isValidMnemonic(mnemonicWords: string): boolean {
    return Mnemonic.isValid(mnemonicWords.split(' '));
}

/**
 * Check if count field is valid
 * @param count - Count to check
 * @returns True if the count is valid, false otherwise
 */
function isValidCount(count: number): boolean {
    return !isNaN(count) && Number.isInteger(count) && count >= 0;
}

/**
 * Check if initialIndex field is valid
 * @param initialIndex - Initial index to check
 * @returns True if the initial index is valid, false otherwise
 */
function isValidInitialIndex(initialIndex: number): boolean {
    return (
        !isNaN(initialIndex) &&
        Number.isInteger(initialIndex) &&
        initialIndex >= 0
    );
}

/**
 * Check if the accounts (as mnemonic) field is valid
 * @param account - Account to check
 * @returns True if the account is valid, false otherwise
 */
function isValidAccountsAsMnemonic(account: {
    mnemonic: string;
    count: number;
    initialIndex: number;
}): boolean {
    return !(
        !isValidMnemonic(account.mnemonic) ||
        !isValidCount(account.count) ||
        !isValidInitialIndex(account.initialIndex)
    );
}

/**
 * Check if the gasPayer url is valid
 * @param url - URL to check
 * @returns True if the url is valid, false otherwise
 */
function isValidGasPayerServiceUrl(url: string): boolean {
    return isValidUrl(url);
}

/**
 * Check if the gasPayer private key is valid
 * @param privateKey - Private key to check
 * @returns True if the private key is valid, false otherwise
 */
function isValidDelegatorPrivateKey(privateKey: string): boolean {
    return isValidAccountsAsListOfPrivateKeys([privateKey]);
}

export {
    isValidUrl,
    isValidPort,
    isValidAccountsAsListOfPrivateKeys,
    isValidMnemonic,
    isValidCount,
    isValidInitialIndex,
    isValidAccountsAsMnemonic,
    isValidGasPayerServiceUrl,
    isValidDelegatorPrivateKey
};
