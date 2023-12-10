import { TransactionsClient } from '../../thorest-client';
import type { HttpClient } from '../../../utils';
import {
    contract,
    type DeployParams,
    type InterfaceAbi,
    type TransactionBodyOverride,
    TransactionHandler
} from '@vechainfoundation/vechain-sdk-core';
import type { ContractTransactionResult } from './types';
import {
    type SendTransactionResult,
    TransactionsModule
} from '../transactions';

/**
 * Represents a module for interacting with smart contracts on the blockchain.
 */
class ContractsModule {
    /**
     * An instance of the TransactionsModule
     * @private
     * @readonly
     */
    private readonly transactionsModule: TransactionsModule;

    /**
     * An instance of the TransactionsClient
     * @private
     * @readonly
     */
    private readonly transactionsClient: TransactionsClient;

    /**
     * Creates an instance of the ContractsModule.
     * @param httpClient - An HTTP client for interacting with the blockchain.
     */
    constructor(readonly httpClient: HttpClient) {
        this.transactionsModule = new TransactionsModule(httpClient);
        this.transactionsClient = new TransactionsClient(httpClient);
    }

    /**
     * Deploys a smart contract to the blockchain.
     *
     * @param privateKey - The private key of the account deploying the smart contract.
     * @param contractBytecode - The bytecode of the smart contract to be deployed.
     * @param deployParams - The parameters to pass to the smart contract constructor.
     * @param transactionBodyOverride - (Optional) An object to override the default transaction body.
     * @returns A promise that resolves to a `TransactionSendResult` object representing the result of the deployment.
     */
    public async deployContract(
        privateKey: string,
        contractBytecode: string,
        deployParams?: DeployParams,
        transactionBodyOverride?: TransactionBodyOverride
    ): Promise<SendTransactionResult> {
        // Build a transaction for deploying the smart contract
        const transaction = contract.txBuilder.buildDeployTransaction(
            contractBytecode,
            deployParams,
            transactionBodyOverride
        );

        // Sign the transaction with the provided private key
        const signedTx = TransactionHandler.sign(
            transaction,
            Buffer.from(privateKey, 'hex')
        );

        // Send the signed transaction to the blockchain
        return await this.transactionsModule.sendTransaction(signedTx);
    }

    /**
     * Executes a read-only call to a smart contract function.
     *
     * @param contractAddress - The address of the smart contract.
     * @param contractABI - The ABI (Application Binary Interface) of the smart contract.
     * @param functionName - The name of the function to be called.
     * @param functionData - The input data for the function.
     * @param transactionBodyOverride - (Optional) Override for the transaction body.
     * @returns A promise resolving to a hex string representing the result of the contract call.
     */
    public async executeContractCall(
        contractAddress: string,
        contractABI: InterfaceAbi,
        functionName: string,
        functionData: unknown[]
    ): Promise<string> {
        // Simulate the transaction to get the result of the contract call
        const response = await this.transactionsClient.simulateTransaction([
            {
                to: contractAddress,
                value: '0',
                data: contract.coder.encodeFunctionInput(
                    contractABI,
                    functionName,
                    functionData
                )
            }
        ]);

        // Return the result of the contract call
        return response[0].data;
    }

    /**
     * Executes a transaction to interact with a smart contract function.
     *
     * @param privateKey - The private key for signing the transaction.
     * @param contractAddress - The address of the smart contract.
     * @param contractABI - The ABI (Application Binary Interface) of the smart contract.
     * @param functionName - The name of the function to be called.
     * @param functionData - The input data for the function.
     * @param transactionBodyOverride - (Optional) Override for the transaction body.
     * @returns A promise resolving to a ContractTransactionResult object.
     */
    public async executeContractTransaction(
        privateKey: string,
        contractAddress: string,
        contractABI: InterfaceAbi,
        functionName: string,
        functionData: unknown[],
        transactionBodyOverride?: TransactionBodyOverride
    ): Promise<ContractTransactionResult> {
        // Build a transaction to call the contract function
        const transaction = contract.txBuilder.buildCallTransaction(
            contractAddress,
            contractABI,
            functionName,
            functionData,
            transactionBodyOverride
        );

        // Simulate the transaction to get the result of the contract call
        const simulatedTransaction =
            await this.transactionsClient.simulateTransaction([
                {
                    to: contractAddress,
                    data: transaction.body.clauses[0].data,
                    value: transaction.body.clauses[0].value.toString(16)
                }
            ]);

        // Sign the transaction with the private key
        const signedTx = TransactionHandler.sign(
            transaction,
            Buffer.from(privateKey, 'hex')
        );

        // Send the signed transaction
        const sendResult =
            await this.transactionsModule.sendTransaction(signedTx);

        // Retrieve the transaction ID and return the result
        const transactionId = sendResult.id;

        return {
            id: transactionId,
            clausesResults: simulatedTransaction
        };
    }
}

export { ContractsModule };
