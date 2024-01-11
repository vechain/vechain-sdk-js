import {
    contract,
    networkInfo,
    type Sources,
    Transaction,
    TransactionHandler,
    unitsUtils
} from '@vechain/vechain-sdk-core';
import { ALL_ACCOUNTS, soloNetwork } from '../tests/fixture';
import { BUILT_IN_CONTRACTS } from '../tests/built-in-fixture';
import { ThorClient, ThorestClient } from '../src';
import { expect } from '@jest/globals';
import { TESTING_CONTRACT_BYTECODE } from './const';
import path from 'path';
import fs from 'fs';

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
    data: contract.coder.encodeFunctionInput(
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
    chainTag: networkInfo.solo.chainTag,
    blockRef: '0x0000000000000000',
    expiration: 100000,
    gasPriceCoef: 0,
    gas: 100000000,
    dependsOn: null,
    nonce: '0x851fd66f' // Random nonce
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
 * Prepares a transaction for deploying the `TestingContract.sol` contract.
 *
 * @returns A signed transaction for deploying the `TestingContract.sol` contract.
 */
const deployTestContractTransaction = (): Transaction => {
    try {
        const contractPath = path.resolve('TestingContract.sol');

        // Read the Solidity source code from the file

        const sources: Sources = {
            'TestingContract.sol': {
                content: fs.readFileSync(contractPath, 'utf8')
            }
        };

        return TransactionHandler.sign(
            new Transaction({
                ...txBody,
                clauses: [
                    {
                        to: null,
                        value: '0x0',
                        data:
                            TESTING_CONTRACT_BYTECODE ??
                            compileContract('solo-seeding', sources).bytecode
                    }
                ]
            }),
            Buffer.from(ALL_ACCOUNTS[4].privateKey, 'hex')
        );
    } catch (err) {
        console.log('Error creating deploy testing contract tx:', err);
        throw err;
    }
};

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
const seedThorSolo = async (): Promise<void> => {
    const thorestSoloClient = new ThorestClient(soloNetwork);

    console.log(
        "Distributing balances to the first 10 accounts in the 'ALL_ACCOUNTS' array:"
    );

    let lastTxId = '';
    for (const tx of txs) {
        const resp = await thorestSoloClient.transactions.sendTransaction(
            `0x${tx.encoded.toString('hex')}`
        );

        console.log(resp.id); // Print the transaction id

        lastTxId = resp.id;
    }

    const thorSoloClient = new ThorClient(thorestSoloClient);

    // Wait for the last transaction to be confirmed
    await thorSoloClient.transactions.waitForTransaction(lastTxId);

    // Check that the balances have been distributed
    for (const account of ALL_ACCOUNTS) {
        const accountInfo = await thorestSoloClient.accounts.getAccount(
            account.address
        );

        expect(BigInt(accountInfo.balance)).toBeGreaterThanOrEqual(
            unitsUtils.parseVET('500000000')
        );

        expect(BigInt(accountInfo.energy)).toBeGreaterThanOrEqual(
            unitsUtils.parseVET('500000000')
        );
    }

    // Deploy the test contract
    const deployTx = deployTestContractTransaction();

    const simulations = await thorSoloClient.gas.estimateGas(
        deployTx.body.clauses,
        ALL_ACCOUNTS[4].address
    );

    console.log('Deploy contract simulation: ', JSON.stringify(simulations));

    const resp = await thorestSoloClient.transactions.sendTransaction(
        `0x${deployTx.encoded.toString('hex')}`
    );

    console.log('Deploy contract tx ID: ', resp.id);

    // Wait 5 seconds
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Wait for the contract to be deployed
    const txReceipt = await thorSoloClient.transactions.waitForTransaction(
        resp.id
    );

    console.log(
        'Deployed contract address:',
        txReceipt?.outputs[0].contractAddress
    );

    console.log('Seeding complete. You can now dump the thor-solo database.');
};

export { seedThorSolo };
