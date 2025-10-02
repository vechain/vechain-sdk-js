import {
    type Abi,
    type ExtractAbiEventNames,
    type ExtractAbiFunctionNames
} from 'abitype';
import { encodeFunctionData, toEventSelector } from 'viem';
import { type Signer } from '@thor/signer';
import { type Address } from '@common';
import type { ContractCallOptions, ContractTransactionOptions } from '../types';
import type { ContractsModule } from '../interfaces';

/**
 * A class representing a smart contract deployed on the blockchain.
 * This is the middle-layer contract that provides VeChain-specific functionality.
 */
class Contract<TAbi extends Abi> {
    readonly contractsModule: ContractsModule;
    readonly address: Address;
    readonly abi: TAbi;
    private signer?: Signer;

    public read: Record<string, (...args: unknown[]) => Promise<unknown[]>> =
        {};
    public transact: Record<string, (...args: unknown[]) => Promise<unknown>> =
        {};
    public filters: Record<string, (...args: unknown[]) => unknown> = {};
    public clause: Record<string, (...args: unknown[]) => unknown> = {};
    public criteria: Record<string, (...args: unknown[]) => unknown> = {};

    private contractCallOptions: ContractCallOptions = {};
    private contractTransactionOptions: ContractTransactionOptions = {};

    /**
     * Initializes a new instance of the `Contract` class.
     * @param address The address of the contract.
     * @param abi The Application Binary Interface (ABI) of the contract.
     * @param contractsModule The contracts module for blockchain interaction.
     * @param signer The signer used for signing transactions.
     */
    constructor(
        address: Address,
        abi: TAbi,
        contractsModule: ContractsModule,
        signer?: Signer
    ) {
        this.abi = abi;
        this.address = address;
        this.contractsModule = contractsModule;
        this.signer = signer;
        this.initializeProxies();
    }

    /**
     * Sets the options for contract calls.
     * @param options - The contract call options to set.
     * @returns The updated contract call options.
     */
    public setContractReadOptions(
        options: ContractCallOptions
    ): ContractCallOptions {
        this.contractCallOptions = options;
        return this.contractCallOptions;
    }

    /**
     * Gets the current contract call options.
     * @returns The current contract call options.
     */
    public getContractReadOptions(): ContractCallOptions {
        return this.contractCallOptions;
    }

    /**
     * Clears the current contract call options, resetting them to an empty object.
     */
    public clearContractReadOptions(): void {
        this.contractCallOptions = {};
    }

    /**
     * Sets the options for contract transactions.
     * @param options - The contract transaction options to set.
     * @returns The updated contract transaction options.
     */
    public setContractTransactOptions(
        options: ContractTransactionOptions
    ): ContractTransactionOptions {
        this.contractTransactionOptions = options;
        return this.contractTransactionOptions;
    }

    /**
     * Gets the current contract transaction options.
     * @returns The current contract transaction options.
     */
    public getContractTransactOptions(): ContractTransactionOptions {
        return this.contractTransactionOptions;
    }

    /**
     * Clears the current contract transaction options, resetting them to an empty object.
     */
    public clearContractTransactOptions(): void {
        this.contractTransactionOptions = {};
    }

    /**
     * Sets the signer for signing transactions.
     * @param signer - The signer
     */
    public setSigner(signer: Signer): Signer {
        this.signer = signer;
        return this.signer;
    }

    /**
     * Get the signer used for signing transactions.
     * @returns The signer used for signing transactions.
     */
    public getSigner(): Signer | undefined {
        return this.signer;
    }

    /**
     * Retrieves the function ABI for the specified function name.
     * Uses viem's ABI parsing instead of ABIContract from core
     * @param prop - The name of the function.
     * @return The function ABI for the specified function name.
     */
    public getFunctionAbi(prop: string | symbol): unknown {
        const functionName = prop.toString();
        const functionAbi = this.abi.find(
            (item) => item.type === 'function' && item.name === functionName
        );

        if (!functionAbi) {
            throw new Error(`Function ${functionName} not found in ABI`);
        }

        return functionAbi;
    }

    /**
     * Retrieves the event ABI for the specified event name.
     * Uses viem's ABI parsing instead of ABIContract from core
     * @param eventName - The name of the event.
     * @return The event ABI for the specified event name.
     */
    public getEventAbi(eventName: string | symbol): unknown {
        const name = eventName.toString();
        const eventAbi = this.abi.find(
            (item) => item.type === 'event' && item.name === name
        );

        if (!eventAbi) {
            throw new Error(`Event ${name} not found in ABI`);
        }

        return eventAbi;
    }

    /**
     * Initializes the proxy objects for dynamic method binding
     * This replaces the complex proxy system with simple object initialization
     */
    private initializeProxies(): void {
        // Initialize read methods for view/pure functions
        for (const abiItem of this.abi) {
            if (abiItem.type === 'function') {
                const functionName = abiItem.name;

                // Read methods (view/pure) - use ThorClient for blockchain calls
                if (
                    abiItem.stateMutability === 'view' ||
                    abiItem.stateMutability === 'pure'
                ) {
                    this.read[functionName] = async (...args: unknown[]) => {
                        // Use ThorClient for contract calls
                        const data = this.encodeFunctionData(
                            functionName,
                            args
                        );
                        // TODO: Integrate with ThorClient.accounts.getAccount or similar
                        // For now, return empty result as this is a stub
                        return [];
                    };
                }

                // Transact methods (payable/nonpayable) - use ThorClient for transactions
                if (
                    abiItem.stateMutability === 'payable' ||
                    abiItem.stateMutability === 'nonpayable'
                ) {
                    this.transact[functionName] = async (
                        ...args: unknown[]
                    ) => {
                        // TODO: Integrate with ThorClient.transactions.sendTransaction
                        // For now, return empty result as this is a stub
                        return { transactionId: 'stub_tx_id' };
                    };
                }

                // Clause building - create VeChain transaction clauses
                this.clause[functionName] = (...args: unknown[]) => {
                    const data = this.encodeFunctionData(functionName, args);
                    return {
                        to: this.address.toString(),
                        data: data,
                        value: '0x0',
                        comment: undefined
                    };
                };
            }

            // Event filters - use ThorClient for event filtering
            if (abiItem.type === 'event') {
                const eventName = abiItem.name;
                this.filters[eventName] = (...args: unknown[]) => {
                    // TODO: Integrate with ThorClient.logs.getLogs or similar
                    return {
                        address: this.address.toString(),
                        topics: [this.getEventSelector(eventName)]
                    };
                };

                this.criteria[eventName] = (...args: unknown[]) => {
                    // TODO: Integrate with ThorClient.logs.createEventFilter or similar
                    return {
                        address: this.address.toString(),
                        topics: [this.getEventSelector(eventName)]
                    };
                };
            }
        }
    }

    /**
     * Encodes function data for a given function name and arguments
     * @param functionName - The function name
     * @param args - The function arguments
     * @returns The encoded function data
     */
    public encodeFunctionData(
        functionName: string,
        args: unknown[] = []
    ): string {
        try {
            return encodeFunctionData({
                abi: this.abi as any,
                functionName: functionName as any,
                args
            });
        } catch (error) {
            console.warn('Failed to encode function data:', error);
            return '0x' + functionName; // Fallback
        }
    }

    /**
     * Gets the event selector for a given event name
     * @param eventName - The event name
     * @returns The event selector
     */
    public getEventSelector(eventName: string): string {
        try {
            const eventAbi = this.getEventAbi(eventName);
            return toEventSelector(eventAbi as any);
        } catch (error) {
            console.warn('Failed to get event selector:', error);
            return '0x' + eventName; // Fallback
        }
    }
}

export { Contract };
