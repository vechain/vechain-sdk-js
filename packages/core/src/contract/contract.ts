import { randomBytes } from 'ethers';
import { contract } from '../abi';
import {
    Transaction,
    type TransactionBody,
    type TransactionClause
} from '../transaction';
import { networkInfo } from '../utils/const/network';
import { TransactionUtils, dataUtils } from '../utils';

interface TransactionBodyOverride {
    nonce: number;
    chainTag: number;
    blockRef: string;
    expiration: number;
    gasPriceCoef: number;
    dependsOn: string | null;
}

/**
 * Builds a transaction for deploying a smart contract on the blockchain.
 *
 * @param contractBytecode - The bytecode of the smart contract.
 * @param useSponsor - A boolean indicating whether to use a sponsor for the transaction.
 * @param transactionBodyOverride - (Optional) Custom transaction body to override default settings.
 * @returns A Transaction object representing the deploy contract transaction.
 */
function buildDeployContractTransaction(
    contractBytecode: string,
    transactionBodyOverride?: TransactionBodyOverride
): Transaction {
    const clauses: TransactionClause[] = [
        {
            to: networkInfo.mainnet.zeroAddress,
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
function buildCallContractTransaction(
    contractAddress: string,
    contractAbi: string,
    functionName: string,
    args: unknown[],
    transactionBodyOverride?: TransactionBodyOverride
): Transaction {
    const clauses: TransactionClause[] = [
        {
            to: contractAddress,
            value: 0,
            data: contract.encodeFunctionInput(contractAbi, functionName, args)
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
    let body: TransactionBody;

    if (transactionBodyOverride !== undefined) {
        body = {
            ...transactionBodyOverride,
            gas: TransactionUtils.intrinsicGas(clauses),
            clauses
        };
    } else {
        body = getCommonTransactionBody(clauses);
    }

    return new Transaction(body);
}

/**
 * Generates a common transaction body with default values.
 *
 * @param clauses - An array of transaction clauses to include in the transaction.
 * @returns A TransactionBody object with common transaction parameters.
 */
function getCommonTransactionBody(
    clauses: TransactionClause[]
): TransactionBody {
    const body = {
        nonce: '0x' + dataUtils.toHexString(randomBytes(8)),
        chainTag: networkInfo.mainnet.chainTag,
        blockRef: '0x00ffecb8ac3142c4', // must implement a method to get the block ref
        expiration: 32, // tx will expire after block #N + 32
        clauses,
        gasPriceCoef: 0,
        gas: TransactionUtils.intrinsicGas(clauses),
        dependsOn: null
    };

    return body;
}

export {
    buildDeployContractTransaction,
    buildCallContractTransaction,
    type TransactionBodyOverride
};
