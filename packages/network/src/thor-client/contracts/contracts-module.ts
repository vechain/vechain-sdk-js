import {
    contract,
    type DeployParams,
    type InterfaceAbi,
    PARAMS_ADDRESS,
    PARAMS_ABI,
    dataUtils,
    addressUtils
} from '@vechainfoundation/vechain-sdk-core';
import type { ContractCallOptions, ContractTransactionOptions } from './types';
import { type SendTransactionResult } from '../transactions';
import { type ThorClient } from '../thor-client';

/**
 * Represents a module for interacting with smart contracts on the blockchain.
 */
class ContractsModule {
    /**
     * Initializes a new instance of the `Thor` class.
     * @param thor - The Thor instance used to interact with the vechain blockchain API.
     */
    constructor(readonly thor: ThorClient) {}

    /**
     * Deploys a smart contract to the blockchain.
     *
     * @param privateKey - The private key of the account deploying the smart contract.
     * @param contractBytecode - The bytecode of the smart contract to be deployed.
     * @param deployParams - The parameters to pass to the smart contract constructor.
     * @param options - (Optional) An object containing options for the transaction body. Includes all options of the `buildTransactionBody` method
     *                  besides `isDelegated`.
     *
     * @returns A promise that resolves to a `TransactionSendResult` object representing the result of the deployment.
     */
    public async deployContract(
        privateKey: string,
        contractBytecode: string,
        deployParams?: DeployParams,
        options?: ContractTransactionOptions
    ): Promise<SendTransactionResult> {
        // Build a transaction for deploying the smart contract
        const deployContractClause = contract.clauseBuilder.deployContract(
            contractBytecode,
            deployParams
        );

        // Estimate the gas cost of the transaction
        const gasResult = await this.thor.gas.estimateGas(
            [deployContractClause],
            addressUtils.fromPrivateKey(Buffer.from(privateKey, 'hex'))
        );

        const txBody = await this.thor.transactions.buildTransactionBody(
            [deployContractClause],
            gasResult.totalGas,
            options
        );

        // Sign the transaction with the provided private key
        const signedTx = await this.thor.transactions.signTransaction(
            txBody,
            privateKey
        );

        // Send the signed transaction to the blockchain
        return await this.thor.transactions.sendTransaction(signedTx);
    }

    /**
     * Executes a read-only call to a smart contract function.
     *
     * @param contractAddress - The address of the smart contract.
     * @param contractABI - The ABI (Application Binary Interface) of the smart contract.
     * @param functionName - The name of the function to be called.
     * @param functionData - The input data for the function.
     * @param contractCallOptions - (Optional) Options for the contract call.
     * @returns A promise resolving to a hex string representing the result of the contract call.
     */
    public async executeContractCall(
        contractAddress: string,
        contractABI: InterfaceAbi,
        functionName: string,
        functionData: unknown[],
        contractCallOptions?: ContractCallOptions
    ): Promise<string> {
        // Simulate the transaction to get the result of the contract call
        const response = await this.thor.transactions.simulateTransaction(
            [
                {
                    to: contractAddress,
                    value: '0',
                    data: contract.coder.encodeFunctionInput(
                        contractABI,
                        functionName,
                        functionData
                    )
                }
            ],
            contractCallOptions
        );

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
     * @param options - (Optional) An object containing options for the transaction body. Includes all options of the `buildTransactionBody` method
     *                  besides `isDelegated`.
     *                  @see {@link TransactionsModule.buildTransactionBody}
     *
     * @returns A promise resolving to a ContractTransactionResult object.
     */
    public async executeContractTransaction(
        privateKey: string,
        contractAddress: string,
        contractABI: InterfaceAbi,
        functionName: string,
        functionData: unknown[],
        options?: ContractTransactionOptions
    ): Promise<SendTransactionResult> {
        // Build a clause to interact with the contract function
        const clause = contract.clauseBuilder.functionInteraction(
            contractAddress,
            contractABI,
            functionName,
            functionData
        );

        // Estimate the gas cost of the transaction
        const gasResult = await this.thor.gas.estimateGas(
            [clause],
            addressUtils.fromPrivateKey(Buffer.from(privateKey, 'hex'))
        );

        // Build a transaction for calling the contract function
        const txBody = await this.thor.transactions.buildTransactionBody(
            [clause],
            gasResult.totalGas,
            options
        );

        // Sign the transaction with the private key
        const signedTx = await this.thor.transactions.signTransaction(
            txBody,
            privateKey
        );

        // Send the signed transaction
        return await this.thor.transactions.sendTransaction(signedTx);
    }

    /**
     * Gets the base gas price in wei.
     * The base gas price is the minimum gas price that can be used for a transaction.
     * It is used to obtain the VTHO (energy) cost of a transaction.
     *
     * @link [Total Gas Price](https://docs.vechain.org/core-concepts/transactions/transaction-calculation#total-gas-price)
     *
     * @returns The base gas price in wei.
     */
    public async getBaseGasPrice(): Promise<string> {
        return await this.executeContractCall(
            PARAMS_ADDRESS,
            PARAMS_ABI,
            'get',
            [dataUtils.encodeBytes32String('base-gas-price')]
        );
    }
}

export { ContractsModule };
