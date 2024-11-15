import { type ABIFunction } from '@vechain/sdk-core';
import { type Abi } from 'abitype';
import { type VeChainSigner } from '../../signer/signers/types';
import {
    type SendTransactionResult,
    type SimulateTransactionOptions
} from '../transactions/types';
import { Contract, ContractFactory } from './model';
import type {
    ContractCallOptions,
    ContractCallResult,
    ContractClause,
    ContractTransactionOptions
} from './types';
import { type TransactionsModule } from '../transactions';

/**
 * Represents a module for interacting with smart contracts on the blockchain.
 */
class ContractsModule {
    readonly transactionsModule: TransactionsModule;

    constructor(transactionsModule: TransactionsModule) {
        this.transactionsModule = transactionsModule;
    }

    /**
     * Creates a new instance of `ContractFactory` configured with the specified ABI, bytecode, and signer.
     * This factory is used to deploy new smart contracts to the blockchain network managed by this instance.
     *
     * @param abi - The Application Binary Interface (ABI) of the contract, which defines the contract's methods and events.
     * @param bytecode - The compiled bytecode of the contract, representing the contract's executable code.
     * @param signer - The signer used for signing transactions during contract deployment, ensuring the deployer's identity.
     * @returns An instance of `ContractFactory` configured with the provided ABI, bytecode, and signer, ready for deploying contracts.
     */
    public createContractFactory<TAbi extends Abi>(
        abi: TAbi,
        bytecode: string,
        signer: VeChainSigner
    ): ContractFactory<TAbi> {
        return new ContractFactory<TAbi>(abi, bytecode, signer, this);
    }

    /**
     * Initializes and returns a new Contract instance with the provided parameters.
     *
     * @param address - The blockchain address of the contract to load.
     * @param abi - The Application Binary Interface (ABI) of the contract, which defines the contract's methods and structures.
     * @param signer - Optional. The signer caller, used for signing transactions when interacting with the contract.
     * @returns A new instance of the Contract, initialized with the provided address, ABI, and optionally, a signer.
     */
    public load<Tabi extends Abi>(
        address: string,
        abi: Tabi,
        signer?: VeChainSigner
    ): Contract<Tabi> {
        return new Contract<Tabi>(address, abi, this, signer);
    }

    /**
     * This method is going to be deprecated in next release.
     * Use {@link TransactionsModule.executeCall} instead.
     */
    public async executeCall(
        contractAddress: string,
        functionAbi: ABIFunction,
        functionData: unknown[],
        contractCallOptions?: ContractCallOptions
    ): Promise<ContractCallResult> {
        return await this.transactionsModule.executeCall(
            contractAddress,
            functionAbi,
            functionData,
            contractCallOptions
        );
    }

    /**
     * Executes a read-only call to multiple smart contract functions, simulating the transaction to obtain the results.
     * @param clauses - An array of contract clauses to interact with the contract functions.
     * @param options - (Optional) Additional options for the contract call, such as the sender's address, gas limit, and gas price, which can affect the simulation's context.
     * @returns A promise that resolves to an array of decoded outputs of the smart contract function calls, the format of which depends on the functions' return types.
     */
    public async executeMultipleClausesCall(
        clauses: ContractClause[],
        options?: SimulateTransactionOptions
    ): Promise<ContractCallResult[]> {
        return await this.transactionsModule.executeMultipleClausesCall(
            clauses,
            options
        );
    }

    /**
     * Executes a transaction to interact with a smart contract function.
     *
     * @param signer - The signer used for signing the transaction.
     * @param contractAddress - The address of the smart contract.
     * @param functionAbi - The function ABI, including the name and types of the function to be called, derived from the contract's ABI.
     * @param functionData - The input data for the function.
     * @param options - (Optional) An object containing options for the transaction body. Includes all options of the `buildTransactionBody` method
     *                  besides `isDelegated`.
     *                  @see {@link TransactionsModule.buildTransactionBody}
     *
     * @returns A promise resolving to a SendTransactionResult object.
     */
    public async executeTransaction(
        signer: VeChainSigner,
        contractAddress: string,
        functionAbi: ABIFunction,
        functionData: unknown[],
        options?: ContractTransactionOptions
    ): Promise<SendTransactionResult> {
        return await this.transactionsModule.executeTransaction(
            signer,
            contractAddress,
            functionAbi,
            functionData,
            options
        );
    }

    /**
     * Executes multiple contract clauses in a single transaction.
     *
     * @param {ContractClause[]} clauses - The list of contract clauses to be executed in the transaction.
     * @param {VeChainSigner} signer - The signer responsible for signing and sending the transaction.
     * @param {ContractTransactionOptions} [options] - Optional parameters for the transaction such as gas, gas limit, and nonce.
     * @return {Promise<SendTransactionResult>} A promise that resolves to an object containing the transaction ID and a wait function to await the confirmation.
     */
    public async executeMultipleClausesTransaction(
        clauses: ContractClause[],
        signer: VeChainSigner,
        options?: ContractTransactionOptions
    ): Promise<SendTransactionResult> {
        return await this.transactionsModule.executeMultipleClausesTransaction(
            clauses,
            signer,
            options
        );
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
    public async getBaseGasPrice(): Promise<ContractCallResult> {
        return await this.transactionsModule.getBaseGasPrice();
    }
}

export { ContractsModule };
