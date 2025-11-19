"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedTestToken = exports.seedVTHO = exports.seedVET = void 0;
const sdk_network_1 = require("@vechain/sdk-network");
const accounts_1 = require("../config/accounts");
const sdk_core_1 = require("@vechain/sdk-core");
const constants_1 = require("../config/constants");
const genesisDeployerAccount = accounts_1.THOR_SOLO_DEFAULT_GENESIS_ACCOUNTS[0];
/**
 * Seeds VET to the seeded accounts.
 * Seeds from the first account in the default genesis accounts.
 */
const seedVET = async (accounts) => {
    try {
        const thorClient = sdk_network_1.ThorClient.at('http://localhost:8669');
        const chainTagId = await thorClient.nodes.getChaintag();
        const latestBlock = await thorClient.blocks.getBestBlockCompressed();
        const privateKey = sdk_core_1.HexUInt.of(genesisDeployerAccount.privateKey).bytes;
        const clauses = [];
        for (const account of accounts) {
            const clause = sdk_core_1.Clause.transferVET(sdk_core_1.Address.of(account.address), sdk_core_1.VET.of(constants_1.THOR_SOLO_SEEDED_VET_AMOUNT));
            clauses.push(clause);
        }
        const txBody = {
            chainTag: chainTagId,
            blockRef: latestBlock !== null ? latestBlock.id.slice(0, 18) : '0x0',
            expiration: 32,
            clauses,
            gas: 1000000,
            gasPriceCoef: 0,
            dependsOn: null,
            nonce: 123
        };
        const tx = sdk_core_1.Transaction.of(txBody);
        const encodedTx = tx.sign(privateKey).encoded;
        const sendResult = await thorClient.transactions.sendRawTransaction(sdk_core_1.HexUInt.of(encodedTx).toString());
        const receipt = await thorClient.transactions.waitForTransaction(sendResult.id);
        if (receipt === null || receipt.reverted) {
            throw new Error(`Transaction ${sendResult.id} failed`);
        }
        console.log(`Accounts seeded with ${constants_1.THOR_SOLO_SEEDED_VET_AMOUNT} VET, tx id: ${sendResult.id}`);
        return sendResult.id;
    }
    catch (error) {
        console.error('Error seeding VET', error instanceof Error ? error.message : String(error));
        throw error;
    }
};
exports.seedVET = seedVET;
/**
 * Seeds VTHO to the seeded accounts.
 * Seeds from the first account in the default genesis accounts.
 */
const seedVTHO = async (accounts) => {
    try {
        const thorClient = sdk_network_1.ThorClient.at('http://localhost:8669');
        const latestBlock = await thorClient.blocks.getBestBlockCompressed();
        const chainTagId = await thorClient.nodes.getChaintag();
        const privateKey = sdk_core_1.HexUInt.of(genesisDeployerAccount.privateKey).bytes;
        const clauses = [];
        for (const account of accounts) {
            const contractClause = sdk_core_1.Clause.transferVTHOToken(sdk_core_1.Address.of(account.address), sdk_core_1.VTHO.of(constants_1.THOR_SOLO_SEEDED_VTHO_AMOUNT));
            clauses.push(contractClause.clause);
        }
        const txBody = {
            chainTag: chainTagId,
            blockRef: latestBlock !== null ? latestBlock.id.slice(0, 18) : '0x0',
            expiration: 32,
            gas: 1000000,
            gasPriceCoef: 0,
            clauses,
            dependsOn: null,
            nonce: 0
        };
        const tx = sdk_core_1.Transaction.of(txBody);
        const encodedTx = tx.sign(privateKey).encoded;
        const sendResult = await thorClient.transactions.sendRawTransaction(sdk_core_1.HexUInt.of(encodedTx).toString());
        const receipt = await thorClient.transactions.waitForTransaction(sendResult.id);
        if (receipt === null || receipt.reverted) {
            throw new Error(`Transaction ${sendResult.id} failed`);
        }
        console.log(`Accounts seeded with ${constants_1.THOR_SOLO_SEEDED_VTHO_AMOUNT} VTHO, tx id: ${sendResult.id}`);
        return sendResult.id;
    }
    catch (error) {
        console.error('Error seeding VTHO', error instanceof Error ? error.message : String(error));
        throw error;
    }
};
exports.seedVTHO = seedVTHO;
/**
 * Seeds TestToken to the seeded accounts.
 * Seeds from the first account in the default genesis accounts.
 */
const seedTestToken = async (accounts) => {
    try {
        const thorClient = sdk_network_1.ThorClient.at('http://localhost:8669');
        const latestBlock = await thorClient.blocks.getBestBlockCompressed();
        const chainTagId = await thorClient.nodes.getChaintag();
        const privateKey = sdk_core_1.HexUInt.of(genesisDeployerAccount.privateKey).bytes;
        const clauses = [];
        for (const account of accounts) {
            const contractClause = sdk_core_1.Clause.transferVTHOToken(sdk_core_1.Address.of(account.address), sdk_core_1.VTHO.of(constants_1.THOR_SOLO_SEEDED_TEST_TOKEN_AMOUNT));
            clauses.push(contractClause.clause);
        }
        const txBody = {
            chainTag: chainTagId,
            blockRef: latestBlock !== null ? latestBlock.id.slice(0, 18) : '0x0',
            expiration: 32,
            clauses,
            gas: 1000000,
            gasPriceCoef: 0,
            dependsOn: null,
            nonce: 0
        };
        const tx = sdk_core_1.Transaction.of(txBody);
        const encodedTx = tx.sign(privateKey).encoded;
        const sendResult = await thorClient.transactions.sendRawTransaction(sdk_core_1.HexUInt.of(encodedTx).toString());
        const receipt = await thorClient.transactions.waitForTransaction(sendResult.id);
        if (receipt === null || receipt.reverted) {
            throw new Error(`Transaction ${sendResult.id} failed`);
        }
        console.log(`Accounts seeded with ${constants_1.THOR_SOLO_SEEDED_TEST_TOKEN_AMOUNT} TestToken, tx id: ${sendResult.id}`);
        return sendResult.id;
    }
    catch (error) {
        console.error('Error seeding TestToken', error instanceof Error ? error.message : String(error));
        throw error;
    }
};
exports.seedTestToken = seedTestToken;
