import {
    Transaction,
    TransactionHandler,
    contract,
    unitsUtils
} from '@vechainfoundation/vechain-sdk-core';
import { ALL_ACCOUNTS, soloNetwork } from './fixture';
import { BUILT_IN_CONTRACTS } from './built-in-fixture';
import { ThorestClient } from '../src';

/**
 * Constructs clauses for transferring VTHO tokens.
 *
 * @remarks
 * This constant creates an array of transaction clauses for transferring VTHO tokens
 * from the built-in energy contract to the first 10 accounts in the `ALL_ACCOUNTS` array.
 */
const CLAUSES_VTHO = ALL_ACCOUNTS.slice(0, 10).map((account) => ({
    to: BUILT_IN_CONTRACTS.ENERGY_ADDRESS,
    value: 0,
    data: contract.encodeFunctionInput(
        BUILT_IN_CONTRACTS.ENERGY_ABI,
        'transfer',
        [account.address, unitsUtils.parseVET('500000000')]
    )
}));

/**
 * Constructs clauses for transferring VET tokens.
 *
 * @remarks
 * This constant creates an array of transaction clauses for transferring VET tokens
 * to the first 10 accounts in the `ALL_ACCOUNTS` array.
 */
const CLAUSES_VET = ALL_ACCOUNTS.slice(0, 10).map((account) => ({
    to: account.address,
    value: `0x${unitsUtils.parseVET('500000000').toString(16)}`,
    data: '0x'
}));

/**
 * Constructs a transaction body.
 *
 * @remarks blockRef is set to the genesis block ref. Expiration is set to 100000 blocks as an example but can be set to any value.
 * gas is set to 100000 as an example but can be set to a estimated gas value when the functionality is implemented.
 */
const txBody = {
    chainTag: 246,
    blockRef: '0x0000000000000000',
    expiration: 100000,
    gasPriceCoef: 0,
    gas: 100000,
    dependsOn: null,
    nonce: '0x851fd66f'
};

/**
 * Array of transaction bodies with clauses for VTHO and VET transfers.
 */
const txBodies = CLAUSES_VTHO.map((clause, index) => ({
    ...txBody,
    clauses: [clause, CLAUSES_VET[index]]
}));

/**
 * Array of unsigned transactions.
 */
const unsignedTxs = txBodies.map((txBody) => new Transaction(txBody));

/**
 * Array of signed transactions where each transaction is being signed and performed by each of the 10 thor-solo pre-seeded accounts.
 */
const txs = unsignedTxs.map((unsignedTx, index) =>
    TransactionHandler.sign(
        unsignedTx,
        Buffer.from(ALL_ACCOUNTS[10 + index].privateKey, 'hex') // 10 is the index of the first thor-solo genesis account
    )
);

/**
 * Distributes balances of VTHO and VET to the first 10 accounts.
 *
 * @remarks
 * This function signs and sends transactions to distribute VTHO and VET tokens
 * to the first 10 accounts in the `ALL_ACCOUNTS` array. It uses the ThorestClient
 * to interact with the VechainThor blockchain.
 *
 * @returns A Promise that resolves when all transactions have been processed.
 */
const distributeBalances = async (): Promise<void> => {
    const thorestSoloClient = new ThorestClient(soloNetwork);

    for (const tx of txs) {
        const resp = await thorestSoloClient.transactions.sendTransaction(
            `0x${tx.encoded.toString('hex')}`
        );

        console.log(resp.id); // Print the transaction id
    }
};

export { distributeBalances };
