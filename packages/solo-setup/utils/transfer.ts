import { THOR_SOLO_DEFAULT_GENESIS_ACCOUNTS } from '../config/accounts';
import {
    Address,
    ClauseBuilder,
    FetchHttpClient,
    RetrieveExpandedBlock,
    SendTransaction,
    HexUInt,
    Revision,
    Transaction,
    ThorNetworks,
    type TransactionBody,
    type TransactionClause,
    VTHO_ADDRESS
} from '@vechain/sdk';
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
        const thorClient = FetchHttpClient.at(
            new URL(ThorNetworks.SOLONET),
            {}
        );
        const latestBlock = (
            await RetrieveExpandedBlock.of(Revision.of('best')).askTo(
                thorClient
            )
        ).response;
        const privateKey = HexUInt.of(genesisDeployerAccount.privateKey).bytes;
        const clauses: TransactionClause[] = [];
        for (const account of accounts) {
            const clause = ClauseBuilder.transferVET(
                Address.of(account.address),
                BigInt(THOR_SOLO_SEEDED_VET_AMOUNT)
            );
            clauses.push(clause);
        }
        const txBody: TransactionBody = {
            chainTag: THOR_SOLO_CHAIN_TAG,
            blockRef:
                latestBlock !== null
                    ? latestBlock.id.toString().slice(0, 18)
                    : '0x0',
            expiration: 32,
            clauses,
            gas: 1000000,
            gasPriceCoef: 0,
            dependsOn: null,
            nonce: 123
        };

        const encodedSignedTx = Transaction.of(txBody).sign(privateKey).encoded;
        const sendResult = (
            await SendTransaction.of(encodedSignedTx).askTo(thorClient)
        ).response.id;
        console.log(
            `Accounts seeded with ${THOR_SOLO_SEEDED_VET_AMOUNT} VET, tx id: ${sendResult.toString()}`
        );
        return sendResult.toString();
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
        const thorClient = FetchHttpClient.at(
            new URL(ThorNetworks.SOLONET),
            {}
        );
        const latestBlock = (
            await RetrieveExpandedBlock.of(Revision.of('best')).askTo(
                thorClient
            )
        ).response;
        const privateKey = HexUInt.of(genesisDeployerAccount.privateKey).bytes;
        const clauses: TransactionClause[] = [];
        for (const account of accounts) {
            const clause = ClauseBuilder.transferToken(
                Address.of(VTHO_ADDRESS),
                Address.of(account.address),
                BigInt(THOR_SOLO_SEEDED_VTHO_AMOUNT)
            );
            clauses.push(clause);
        }
        const txBody: TransactionBody = {
            chainTag: THOR_SOLO_CHAIN_TAG,
            blockRef:
                latestBlock !== null
                    ? latestBlock.id.toString().slice(0, 18)
                    : '0x0',
            expiration: 32,
            clauses,
            gas: 1000000,
            gasPriceCoef: 0,
            dependsOn: null,
            nonce: 1
        };
        const encodedSignedTx = Transaction.of(txBody).sign(privateKey).encoded;
        const sendResult = (
            await SendTransaction.of(encodedSignedTx).askTo(thorClient)
        ).response.id;
        console.log(
            `Accounts seeded with ${THOR_SOLO_SEEDED_VTHO_AMOUNT} VTHO, tx id: ${sendResult.toString()}`
        );
        return sendResult.toString();
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
    accounts: TestAccount[],
    testTokenAddress: string
): Promise<string> => {
    try {
        const thorClient = FetchHttpClient.at(
            new URL(ThorNetworks.SOLONET),
            {}
        );
        const latestBlock = (
            await RetrieveExpandedBlock.of(Revision.of('best')).askTo(
                thorClient
            )
        ).response;
        const privateKey = HexUInt.of(genesisDeployerAccount.privateKey).bytes;
        const clauses: TransactionClause[] = [];
        for (const account of accounts) {
            const clause = ClauseBuilder.transferToken(
                Address.of(testTokenAddress),
                Address.of(account.address),
                BigInt(THOR_SOLO_SEEDED_TEST_TOKEN_AMOUNT)
            );
            clauses.push(clause);
        }
        const txBody: TransactionBody = {
            chainTag: THOR_SOLO_CHAIN_TAG,
            blockRef:
                latestBlock !== null
                    ? latestBlock.id.toString().slice(0, 18)
                    : '0x0',
            expiration: 32,
            clauses,
            gas: 1000000,
            gasPriceCoef: 0,
            dependsOn: null,
            nonce: 2
        };
        const encodedSignedTx = Transaction.of(txBody).sign(privateKey).encoded;
        const sendResult = (
            await SendTransaction.of(encodedSignedTx).askTo(thorClient)
        ).response.id;
        console.log(
            `Accounts seeded with ${THOR_SOLO_SEEDED_TEST_TOKEN_AMOUNT} TestToken, tx id: ${sendResult.toString()}`
        );
        return sendResult.toString();
    } catch (error) {
        console.error(
            'Error seeding TestToken',
            error instanceof Error ? error.message : String(error)
        );
        throw error;
    }
};
