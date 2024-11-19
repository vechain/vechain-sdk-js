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
    constructor(readonly transactionsModule: TransactionsModule) {}

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
     * This method is going to be deprecated in the next release.
     * Use {@link TransactionsModule.executeMultipleClausesCall} next.
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
     * This method is going to be deprecated in the next release.
     * Use {@link TransactionsModule.executeTransaction} instead.
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
     * This method is going to be deprected in the next release.
     * Use {@link TransactionsModule.executeMultipleClausesTransaction} instead.
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
     * This method is going to be deprecated in the next release.
     * Use {@link TransactionsModule.getBaseGasPrice} instead.
     */
    public async getBaseGasPrice(): Promise<ContractCallResult> {
        return await this.transactionsModule.getBaseGasPrice();
    }
}

export { ContractsModule };
