import { ThorClient } from '@vechain/sdk-network';
import { THOR_SOLO_DEFAULT_GENESIS_ACCOUNTS } from '../config/accounts';
import {
    Address,
    Clause,
    HexUInt,
    Transaction,
    type TransactionBody,
    type TransactionClause,
    VET,
    VTHO
} from '@vechain/sdk-core';
import {
    THOR_SOLO_CHAIN_TAG,
    THOR_SOLO_SEEDED_TEST_TOKEN_AMOUNT,
    THOR_SOLO_SEEDED_VET_AMOUNT,
    THOR_SOLO_SEEDED_VTHO_AMOUNT
} from '../config/constants';
import { type TestAccount } from '../funder/accounts';

const genesisDeployerAccount = THOR_SOLO_DEFAULT_GENESIS_ACCOUNTS[0];

/**
 * Seeds VET to the seeded accounts.
 * Seeds from the first account in the default genesis accounts.
 */
export const seedVET = async (accounts: TestAccount[]): Promise<string> => {
    try {
        const thorClient = ThorClient.at('http://localhost:8669');
        const latestBlock = await thorClient.blocks.getBestBlockCompressed();
        const privateKey = HexUInt.of(genesisDeployerAccount.privateKey).bytes;
        const clauses: TransactionClause[] = [];
        for (const account of accounts) {
            const clause = Clause.transferVET(
                Address.of(account.address),
                VET.of(THOR_SOLO_SEEDED_VET_AMOUNT)
            );
            clauses.push(clause);
        }
        const txBody: TransactionBody = {
            chainTag: THOR_SOLO_CHAIN_TAG,
            blockRef:
                latestBlock !== null ? latestBlock.id.slice(0, 18) : '0x0',
            expiration: 32,
            clauses,
            gas: 1000000,
            gasPriceCoef: 0,
            dependsOn: null,
            nonce: 123
        };
        const tx = Transaction.of(txBody);
        const encodedTx = tx.sign(privateKey).encoded;
        const sendResult = await thorClient.transactions.sendRawTransaction(
            HexUInt.of(encodedTx).toString()
        );
        const receipt = await thorClient.transactions.waitForTransaction(
            sendResult.id
        );
        if (receipt === null || receipt.reverted) {
            throw new Error(`Transaction ${sendResult.id} failed`);
        }
        console.log(
            `Accounts seeded with ${THOR_SOLO_SEEDED_VET_AMOUNT} VET, tx id: ${sendResult.id}`
        );
        return sendResult.id;
    } catch (error) {
        console.error(
            'Error seeding VET',
            error instanceof Error ? error.message : String(error)
        );
        throw error;
    }
};

/**
 * Seeds VTHO to the seeded accounts.
 * Seeds from the first account in the default genesis accounts.
 */
export const seedVTHO = async (accounts: TestAccount[]): Promise<string> => {
    try {
        const thorClient = ThorClient.at('http://localhost:8669');
        const latestBlock = await thorClient.blocks.getBestBlockCompressed();
        const privateKey = HexUInt.of(genesisDeployerAccount.privateKey).bytes;
        const clauses: TransactionClause[] = [];
        for (const account of accounts) {
            const clause = Clause.transferVTHOToken(
                Address.of(account.address),
                VTHO.of(THOR_SOLO_SEEDED_VTHO_AMOUNT)
            );
            clauses.push(clause);
        }
        const txBody: TransactionBody = {
            chainTag: THOR_SOLO_CHAIN_TAG,
            blockRef:
                latestBlock !== null ? latestBlock.id.slice(0, 18) : '0x0',
            expiration: 32,
            gas: 1000000,
            gasPriceCoef: 0,
            clauses,
            dependsOn: null,
            nonce: 0
        };
        const tx = Transaction.of(txBody);
        const encodedTx = tx.sign(privateKey).encoded;
        const sendResult = await thorClient.transactions.sendRawTransaction(
            HexUInt.of(encodedTx).toString()
        );
        const receipt = await thorClient.transactions.waitForTransaction(
            sendResult.id
        );
        if (receipt === null || receipt.reverted) {
            throw new Error(`Transaction ${sendResult.id} failed`);
        }
        console.log(
            `Accounts seeded with ${THOR_SOLO_SEEDED_VTHO_AMOUNT} VTHO, tx id: ${sendResult.id}`
        );
        return sendResult.id;
    } catch (error) {
        console.error(
            'Error seeding VTHO',
            error instanceof Error ? error.message : String(error)
        );
        throw error;
    }
};

/**
 * Seeds TestToken to the seeded accounts.
 * Seeds from the first account in the default genesis accounts.
 */
export const seedTestToken = async (
    accounts: TestAccount[]
): Promise<string> => {
    try {
        const thorClient = ThorClient.at('http://localhost:8669');
        const latestBlock = await thorClient.blocks.getBestBlockCompressed();
        const privateKey = HexUInt.of(genesisDeployerAccount.privateKey).bytes;
        const clauses: TransactionClause[] = [];
        for (const account of accounts) {
            const clause = Clause.transferVTHOToken(
                Address.of(account.address),
                VTHO.of(THOR_SOLO_SEEDED_TEST_TOKEN_AMOUNT)
            );
            clauses.push(clause);
        }
        const txBody: TransactionBody = {
            chainTag: THOR_SOLO_CHAIN_TAG,
            blockRef:
                latestBlock !== null ? latestBlock.id.slice(0, 18) : '0x0',
            expiration: 32,
            clauses,
            gas: 1000000,
            gasPriceCoef: 0,
            dependsOn: null,
            nonce: 0
        };
        const tx = Transaction.of(txBody);
        const encodedTx = tx.sign(privateKey).encoded;
        const sendResult = await thorClient.transactions.sendRawTransaction(
            HexUInt.of(encodedTx).toString()
        );
        const receipt = await thorClient.transactions.waitForTransaction(
            sendResult.id
        );
        if (receipt === null || receipt.reverted) {
            throw new Error(`Transaction ${sendResult.id} failed`);
        }
        console.log(
            `Accounts seeded with ${THOR_SOLO_SEEDED_TEST_TOKEN_AMOUNT} TestToken, tx id: ${sendResult.id}`
        );
        return sendResult.id;
    } catch (error) {
        console.error(
            'Error seeding TestToken',
            error instanceof Error ? error.message : String(error)
        );
        throw error;
    }
};
