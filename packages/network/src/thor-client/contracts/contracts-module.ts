import {
    coder,
    type InterfaceAbi,
    PARAMS_ABI,
    PARAMS_ADDRESS,
    dataUtils,
    addressUtils,
    clauseBuilder
} from '@vechain/vechain-sdk-core';
import type { ContractCallOptions, ContractTransactionOptions } from './types';
import { type SendTransactionResult } from '../transactions';
import { type ThorClient } from '../thor-client';
import { ContractFactory } from './model';

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
     * Creates a new instance of `ContractFactory` configured with the specified ABI, bytecode, and private key.
     * This factory is used to deploy new smart contracts to the blockchain network managed by this instance.
     *
     * @param abi - The Application Binary Interface (ABI) of the contract, which defines the contract's methods and events.
     * @param bytecode - The compiled bytecode of the contract, representing the contract's executable code.
     * @param privateKey - The private key used for signing transactions during contract deployment, ensuring the deployer's identity.
     * @returns An instance of `ContractFactory` configured with the provided ABI, bytecode, and private key, ready for deploying contracts.
     */
    public createContractFactory(
        abi: InterfaceAbi,
        bytecode: string,
        privateKey: string
    ): ContractFactory {
        return new ContractFactory(abi, bytecode, privateKey, this.thor);
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
    ): Promise<unknown> {
        // Simulate the transaction to get the result of the contract call
        const response = await this.thor.transactions.simulateTransaction(
            [
                {
                    to: contractAddress,
                    value: '0',
                    data: coder.encodeFunctionInput(
                        contractABI,
                        functionName,
                        functionData
                    )
                }
            ],
            contractCallOptions
        );

        return coder.decodeFunctionOutput(
            contractABI,
            functionName,
            response[0].data
        );
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
     * @returns A promise resolving to a SendTransactionResult object.
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
        const clause = clauseBuilder.functionInteraction(
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

        const result = await this.thor.transactions.sendTransaction(signedTx);

        result.wait = async () =>
            await this.thor.transactions.waitForTransaction(result.id);

        return result;
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
    public async getBaseGasPrice(): Promise<unknown> {
        return await this.executeContractCall(
            PARAMS_ADDRESS,
            PARAMS_ABI,
            'get',
            [dataUtils.encodeBytes32String('base-gas-price')]
        );
    }
}

export { ContractsModule };
