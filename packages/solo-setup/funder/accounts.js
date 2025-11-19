"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fundRandomAccount = exports.randomAccount = void 0;
/* eslint-disable sonarjs/pseudo-random */
const sdk_core_1 = require("@vechain/sdk-core");
const config_1 = require("../config");
const transfer_1 = require("../utils/transfer");
const STARTING_INDEX = 11; // starting index of the accounts to generate
const ACCOUNTS_COUNT = 100; // number of accounts to generate
/**
 * Generate test accounts from the default mnemonic
 * @returns Test accounts
 */
const generateTestAccounts = () => {
    const hdNode = sdk_core_1.HDKey.fromMnemonic(config_1.THOR_SOLO_DEFAULT_MNEMONIC);
    const accounts = [];
    for (let i = STARTING_INDEX; i < STARTING_INDEX + ACCOUNTS_COUNT; i++) {
        const child = hdNode.deriveChild(i);
        const privateKey = child.privateKey;
        const publicKey = child.publicKey;
        if (privateKey === null || publicKey === null) {
            throw new Error('Failed to derive child key');
        }
        const address = sdk_core_1.Address.ofPublicKey(publicKey).toString();
        accounts.push({
            privateKey: privateKey.toString(),
            address
        });
    }
    return { accounts };
};
// generate random account
const randomAccount = () => {
    const allAccounts = generateTestAccounts();
    const randomIndex = Math.floor(Math.random() * allAccounts.accounts.length);
    const account = allAccounts.accounts.at(randomIndex);
    if (account == null) {
        throw new Error('Failed to get random account');
    }
    return account;
};
exports.randomAccount = randomAccount;
/**
 * Fund a random account with VET, VTHO and TestToken
 */
const fundRandomAccount = async () => {
    const account = (0, exports.randomAccount)();
    await (0, transfer_1.seedVET)([account]);
    await (0, transfer_1.seedVTHO)([account]);
    await (0, transfer_1.seedTestToken)([account]);
};
exports.fundRandomAccount = fundRandomAccount;
