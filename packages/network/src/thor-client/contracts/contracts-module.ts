import {
    coder,
    type InterfaceAbi,
    PARAMS_ABI,
    PARAMS_ADDRESS,
    dataUtils,
    type FunctionFragment,
    abi,
    clauseBuilder
} from '@vechain/sdk-core';
import type {
    ContractCallOptions,
    ContractCallResult,
    ContractTransactionOptions
} from './types';
import { type SendTransactionResult } from '../transactions';
import { type ThorClient } from '../thor-client';
import { Contract, ContractFactory } from './model';
import { type TransactionSender } from '@vechain/sdk-wallet/src/signers/types.d';

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
        txSender: TransactionSender
    ): ContractFactory {
        return new ContractFactory(abi, bytecode, txSender, this.thor);
    }

    /**
     * Initializes and returns a new Contract instance with the provided parameters.
     *
     * @param address - The blockchain address of the contract to load.
     * @param abi - The Application Binary Interface (ABI) of the contract, which defines the contract's methods and structures.
     * @param callerPrivateKey - Optional. The private key of the caller, used for signing transactions when interacting with the contract.
     * @returns A new instance of the Contract, initialized with the provided address, ABI, and optionally, a caller private key.
     */
    public load(
        address: string,
        abi: InterfaceAbi,
        txSender?: TransactionSender
    ): Contract {
        return new Contract(address, abi, this.thor, txSender);
    }

    /**
     * Executes a read-only call to a smart contract function, simulating the transaction to obtain the result.
     *
     * @param contractAddress - The address of the smart contract to interact with.
     * @param functionFragment - The function fragment, including the name and types of the function to be called, derived from the contract's ABI.
     * @param functionData - An array of arguments to be passed to the smart contract function, corresponding to the function's parameters.
     * @param contractCallOptions - (Optional) Additional options for the contract call, such as the sender's address, gas limit, and gas price, which can affect the simulation's context.
     * @returns A promise that resolves to the decoded output of the smart contract function call, the format of which depends on the function's return types.
     *
     * The function simulates a transaction using the provided parameters without submitting it to the blockchain, allowing read-only operations to be tested without incurring gas costs or modifying the blockchain state.
     */
    public async executeContractCall(
        contractAddress: string,
        functionFragment: FunctionFragment,
        functionData: unknown[],
        contractCallOptions?: ContractCallOptions
    ): Promise<ContractCallResult> {
        // Simulate the transaction to get the result of the contract call
        const response = await this.thor.transactions.simulateTransaction(
            [
                {
                    to: contractAddress,
                    value: '0',
                    data: new abi.Function(functionFragment).encodeInput(
                        functionData
                    )
                }
            ],
            contractCallOptions
        );

        return new abi.Function(functionFragment).decodeOutput(
            response[0].data
        );
    }

    /**
     * Executes a transaction to interact with a smart contract function.
     *
     * @param privateKey - The private key for signing the transaction.
     * @param contractAddress - The address of the smart contract.
     * @param functionFragment - The function fragment, including the name and types of the function to be called, derived from the contract's ABI.
     * @param functionData - The input data for the function.
     * @param options - (Optional) An object containing options for the transaction body. Includes all options of the `buildTransactionBody` method
     *                  besides `isDelegated`.
     *                  @see {@link TransactionsModule.buildTransactionBody}
     *
     * @returns A promise resolving to a SendTransactionResult object.
     */
    public async executeContractTransaction(
        txSender: TransactionSender,
        contractAddress: string,
        functionFragment: FunctionFragment,
        functionData: unknown[],
        options?: ContractTransactionOptions
    ): Promise<SendTransactionResult> {
        // Build a clause to interact with the contract function
        const clause = clauseBuilder.functionInteraction(
            contractAddress,
            functionFragment,
            functionData,
            options?.value ?? 0
        );

        const tx = await txSender.sendTransaction([clause], options);

        return {
            id: tx.id,
            wait: async () => {
                return await this.thor.transactions.waitForTransaction(tx.id);
            }
        };
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
            coder
                .createInterface(PARAMS_ABI)
                .getFunction('get') as FunctionFragment,
            [dataUtils.encodeBytes32String('base-gas-price')]
        );
    }
}

export { ContractsModule };
