/* eslint-disable sonarjs/pseudo-random */
import { Address, HDKey } from '@vechain/sdk-core';
import { THOR_SOLO_DEFAULT_MNEMONIC } from '../config';
import { seedTestToken, seedVET, seedVTHO } from '../utils/transfer';

const STARTING_INDEX = 11; // starting index of the accounts to generate
const ACCOUNTS_COUNT = 100; // number of accounts to generate

/**
 * Test account interface
 */
export interface TestAccount {
    privateKey: string;
    address: string;
}

/**
 * Test accounts interface
 */
interface TestAccounts {
    accounts: TestAccount[];
}

/**
 * Generate test accounts from the default mnemonic
 * @returns Test accounts
 */
const generateTestAccounts = (): TestAccounts => {
    const hdNode = HDKey.fromMnemonic(THOR_SOLO_DEFAULT_MNEMONIC);
    const accounts: TestAccount[] = [];
    for (let i = STARTING_INDEX; i < STARTING_INDEX + ACCOUNTS_COUNT; i++) {
        const child = hdNode.deriveChild(i);
        const privateKey = child.privateKey;
        const publicKey = child.publicKey;
        if (privateKey === null || publicKey === null) {
            throw new Error('Failed to derive child key');
        }
        const address = Address.ofPublicKey(publicKey).toString();
        accounts.push({
            privateKey: privateKey.toString(),
            address
        });
    }
    return { accounts };
};

// generate random account
export const randomAccount = (): TestAccount => {
    const allAccounts = generateTestAccounts();
    const randomIndex = Math.floor(Math.random() * allAccounts.accounts.length);
    const account = allAccounts.accounts.at(randomIndex);
    if (account == null) {
        throw new Error('Failed to get random account');
    }
    return account;
};

/**
 * Fund a random account with VET, VTHO and TestToken
 */
export const fundRandomAccount = async (): Promise<void> => {
    const account = randomAccount();
    await seedVET([account]);
    await seedVTHO([account]);
    await seedTestToken([account]);
};
