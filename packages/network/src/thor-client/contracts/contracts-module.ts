import {
    abi,
    clauseBuilder,
    coder,
    dataUtils,
    type FunctionFragment,
    type InterfaceAbi
} from '@vechain/sdk-core';
import type {
    ContractCallOptions,
    ContractCallResult,
    ContractClause,
    ContractTransactionOptions
} from './types';
import {
    type SendTransactionResult,
    type SimulateTransactionOptions
} from '../transactions';
import { type ThorClient } from '../thor-client';
import { Contract, ContractFactory } from './model';
import { decodeRevertReason } from '../gas/helpers/decode-evm-error';
import { type VeChainSigner } from '../../signer';
import { type Abi } from 'abitype';
import { BUILT_IN_CONTRACTS } from '../../utils';

/**
 * Represents a module for interacting with smart contracts on the blockchain.
 */
class ContractsModule {
    /**
     * Initializes a new instance of the `Thor` class.
     * @param thor - The Thor instance used to interact with the VeChain blockchain API.
     */
    constructor(readonly thor: ThorClient) {}

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
        return new ContractFactory<TAbi>(
            abi as InterfaceAbi,
            bytecode,
            signer,
            this.thor
        );
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
        return new Contract<Tabi>(
            address,
            abi as InterfaceAbi,
            this.thor,
            signer
        );
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
    public async executeCall(
        contractAddress: string,
        functionFragment: FunctionFragment,
        functionData: unknown[],
        contractCallOptions?: ContractCallOptions
    ): Promise<ContractCallResult | string> {
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

        if (response[0].reverted) {
            /**
             * The decoded revert reason of the transaction.
             * Solidity may revert with Error(string) or Panic(uint256).
             *
             * @link see [Error handling: Assert, Require, Revert and Exceptions](https://docs.soliditylang.org/en/latest/control-structures.html#error-handling-assert-require-revert-and-exceptions)
             */
            return decodeRevertReason(response[0].data) ?? '';
        } else {
            return new abi.Function(functionFragment).decodeOutput(
                response[0].data
            );
        }
    }

    /**
     * Executes a read-only call to multiple smart contract functions, simulating the transaction to obtain the results.
     * @param clauses - An array of contract clauses to interact with the contract functions.
     * @param options - (Optional) Additional options for the contract call, such as the sender's address, gas limit, and gas price, which can affect the simulation's context.
     */
    public async executeMultipleClausesCall(
        clauses: ContractClause[],
        options?: SimulateTransactionOptions
    ): Promise<Array<ContractCallResult | string>> {
        // Simulate the transaction to get the result of the contract call
        const response = await this.thor.transactions.simulateTransaction(
            clauses.map((clause) => clause.clause),
            options
        );
        return response.map((res, index) => {
            return new abi.Function(
                clauses[index].functionFragment
            ).decodeOutput(res.data);
        });
    }

    /**
     * Executes a transaction to interact with a smart contract function.
     *
     * @param signer - The signer used for signing the transaction.
     * @param contractAddress - The address of the smart contract.
     * @param functionFragment - The function fragment, including the name and types of the function to be called, derived from the contract's ABI.
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
        functionFragment: FunctionFragment,
        functionData: unknown[],
        options?: ContractTransactionOptions
    ): Promise<SendTransactionResult> {
        // Sign the transaction
        const id = await signer.sendTransaction({
            clauses: [
                // Build a clause to interact with the contract function
                clauseBuilder.functionInteraction(
                    contractAddress,
                    functionFragment,
                    functionData,
                    options?.value ?? 0
                )
            ]
        });

        return {
            id,
            wait: async () =>
                await this.thor.transactions.waitForTransaction(id)
        };
    }

    /**
     * Executes a transaction to interact with multiple smart contract functions.
     * @param clauses - An array of transaction clauses to interact with the contract functions.
     * @param signer - The signer used to signing the transaction.
     */
    public async executeMultipleClausesTransaction(
        clauses: ContractClause[],
        signer: VeChainSigner
    ): Promise<SendTransactionResult> {
        const id = await signer.sendTransaction({
            clauses: clauses.map((clause) => clause.clause)
        });

        return {
            id,
            wait: async () =>
                await this.thor.transactions.waitForTransaction(id)
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
        return await this.executeCall(
            BUILT_IN_CONTRACTS.PARAMS_ADDRESS,
            coder
                .createInterface(BUILT_IN_CONTRACTS.PARAMS_ABI)
                .getFunction('get') as FunctionFragment,
            [dataUtils.encodeBytes32String('base-gas-price', 'left')]
        );
    }
}

export { ContractsModule };
