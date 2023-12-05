import { type InterfaceAbi, randomBytes } from 'ethers';
import { coder } from '../abi';
import { Transaction, type TransactionClause } from '../transaction';
import { networkInfo } from '../utils/const/network';
import { TransactionUtils, dataUtils } from '../utils';
import type { TransactionBodyOverride } from './types';

/**
 * Builds a transaction for deploying a smart contract on the blockchain.
 *
 * @param contractBytecode - The bytecode of the smart contract.
 * @param transactionBodyOverride - (Optional) Custom transaction body to override default settings.
 * @returns A Transaction object representing the deploy contract transaction.
 */
function buildDeployTransaction(
    contractBytecode: string,
    transactionBodyOverride?: TransactionBodyOverride
): Transaction {
    const clauses: TransactionClause[] = [
        {
            to: null,
            value: 0,
            data: contractBytecode
        }
    ];
    return buildTransactionBody(clauses, transactionBodyOverride);
}

/**
 * Builds a transaction for calling a function of a deployed smart contract.
 *
 * @param contractAddress - The address of the smart contract to interact with.
 * @param contractAbi - The ABI (Application Binary Interface) of the smart contract.
 * @param functionName - The name of the function to call.
 * @param args - An array of arguments to pass to the function.
 * @param transactionBodyOverride - (Optional) Custom transaction body to override default settings.
 * @returns A Transaction object representing the function call transaction.
 */
function buildCallTransaction(
    contractAddress: string,
    contractAbi: InterfaceAbi,
    functionName: string,
    args: unknown[],
    transactionBodyOverride?: TransactionBodyOverride
): Transaction {
    const clauses: TransactionClause[] = [
        {
            to: contractAddress,
            value: 0,
            data: coder.encodeFunctionInput(contractAbi, functionName, args)
        }
    ];

    return buildTransactionBody(clauses, transactionBodyOverride);
}

/**
 * Builds a transaction body using provided clauses and optional overrides.
 *
 * @param clauses - An array of transaction clauses.
 * @param transactionBodyOverride - (Optional) Custom transaction body to override default settings.
 * @returns A Transaction object representing the transaction.
 */
function buildTransactionBody(
    clauses: TransactionClause[],
    transactionBodyOverride?: TransactionBodyOverride
): Transaction {
    const body = {
        nonce: '0x' + dataUtils.toHexString(randomBytes(8)),
        chainTag: networkInfo.mainnet.chainTag,
        blockRef: '0x0000000000000000', // in the online part, replace with the result of a method that interacts with the blockchain
        expiration: 32, // tx will expire after block #N + 32
        clauses,
        gasPriceCoef: 128,
        gas: 5000 + TransactionUtils.intrinsicGas(clauses) * 5,
        dependsOn: null,
        ...transactionBodyOverride
    };
    return new Transaction(body);
}

export const txBuilder = {
    buildDeployTransaction,
    buildCallTransaction
};
