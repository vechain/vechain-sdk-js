import { contract } from '../abi';
import {
    Transaction,
    type TransactionBody,
    type TransactionClause
} from '../transaction';
import { VECHAIN_MAINNET_CHAIN_TAG } from '../transaction/constants';
import { TransactionUtils } from '../utils';

/**
 * Builds a transaction for deploying a smart contract on the blockchain.
 *
 * @param contractBytecode - The bytecode of the smart contract.
 * @param useSponsor - A boolean indicating whether to use a sponsor for the transaction.
 * @param transactionBody - (Optional) Custom transaction body to override default settings.
 * @returns A Transaction object representing the deploy contract transaction.
 */
function buildDeployContractTransaction(
    contractBytecode: string,
    useSponsor: boolean,
    transactionBody?: TransactionBody
): Transaction {
    const clauses: TransactionClause[] = [
        {
            to: '0x0000000000000000000000000000000000000000',
            value: 0,
            data: contractBytecode
        }
    ];

    let body: TransactionBody;

    if (transactionBody !== undefined) {
        body = {
            ...transactionBody,
            clauses
        };
    } else {
        body = getCommonTransactionBody(clauses);
    }

    const transaction = new Transaction(body);

    return transaction;
}

/**
 * Builds a transaction for calling a function of a deployed smart contract.
 *
 * @param contractAddress - The address of the smart contract to interact with.
 * @param contractAbi - The ABI (Application Binary Interface) of the smart contract.
 * @param functionName - The name of the function to call.
 * @param args - An array of arguments to pass to the function.
 * @returns A Transaction object representing the function call transaction.
 */
function buildCallContractTransaction(
    contractAddress: string,
    contractAbi: string,
    functionName: string,
    args: unknown[]
): Transaction {
    const clauses: TransactionClause[] = [
        {
            to: contractAddress,
            value: 0,
            data: contract.encodeFunctionInput(contractAbi, functionName, args)
        }
    ];

    const body: TransactionBody = getCommonTransactionBody(clauses);

    const transaction = new Transaction(body);
    return transaction;
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
        nonce: 1, // TODO generate random nonce
        chainTag: VECHAIN_MAINNET_CHAIN_TAG, // TODO compute chainTag
        blockRef: '0x00ffecb8ac3142c4', // TODO first 8 bytes of block id from block #N
        expiration: 32, // tx will expire after block #N + 32
        clauses,
        gasPriceCoef: 0,
        gas: TransactionUtils.intrinsicGas(clauses),
        dependsOn: null
    };

    return body;
}

export { buildDeployContractTransaction, buildCallContractTransaction };
