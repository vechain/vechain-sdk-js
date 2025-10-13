import {
    type Abi,
    type ExtractAbiEventNames,
    type ExtractAbiFunctionNames,
    type AbiFunction,
    type AbiEvent,
    type AbiParameter
} from 'abitype';
import { encodeFunctionData, toEventSelector } from 'viem';
import { type Signer } from '@thor/signer';
import { type Address, type Hex, Revision } from '@common/vcdm';
import { IllegalArgumentError } from '@common/errors';
import type {
    ContractCallOptions,
    ContractTransactionOptions,
    SendTransactionResult
} from '../types';
import type { ContractsModule } from '../interfaces';

// Proper function arguments type using VeChain SDK types
type FunctionArgs = AbiParameter[];

/**
 * A class representing a smart contract deployed on the blockchain.
 * This is the middle-layer contract that provides VeChain-specific functionality.
 */
class Contract<TAbi extends Abi> {
    readonly contractsModule: ContractsModule;
    readonly address: Address;
    readonly abi: TAbi;
    private signer?: Signer;

    public read: Record<
        string,
        (
            ...args: FunctionArgs
        ) => Promise<(string | number | bigint | boolean | Address | Hex)[]>
    > = {};
    public transact: Record<
        string,
        (...args: FunctionArgs) => Promise<SendTransactionResult>
    > = {};
    public filters: Record<
        string,
        (...args: FunctionArgs) => { address: string; topics: string[] }
    > = {};
    public clause: Record<
        string,
        (...args: FunctionArgs) => {
            to: string;
            data: string;
            value: string | number | bigint;
            comment?: string;
        }
    > = {};
    public criteria: Record<
        string,
        (...args: FunctionArgs) => {
            eventName: string;
            args: FunctionArgs;
            address: string;
            topics: string[];
        }
    > = {};

    private contractCallOptions: ContractCallOptions = {};
    private contractTransactionOptions: ContractTransactionOptions = {};

    /**
     * Initializes a new instance of the `Contract` class.
     * @param address The address of the contract.
     * @param abi The Application Binary Interface (ABI) of the contract.
     * @param contractsModule The contracts module for blockchain interaction.
     * @param signer The signer used for signing transactions.
     * @param deployTransactionReceipt Optional transaction receipt from deployment.
     */
    constructor(
        address: Address,
        abi: TAbi,
        contractsModule: ContractsModule,
        signer?: Signer,
        deployTransactionReceipt?: {
            id: string;
            blockNumber: number;
            blockHash: string;
        }
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
     * Retrieves the function ABI for the specified function name.
     * Uses viem's ABI parsing instead of ABIContract from core
     * @param prop - The name of the function.
     * @return The function ABI for the specified function name.
     */
    public getFunctionAbi(prop: string | symbol): AbiFunction | undefined {
        const functionName = prop.toString();
        const functionAbi = this.abi.find(
            (item) => item.type === 'function' && item.name === functionName
        );

        if (!functionAbi) {
            throw new IllegalArgumentError(
                'Contract.getFunctionAbi',
                `Function ${functionName} not found in ABI`,
                { functionName, abi: this.abi }
            );
        }

        return functionAbi as AbiFunction;
    }

    /**
     * Retrieves the event ABI for the specified event name.
     * Uses viem's ABI parsing instead of ABIContract from core
     * @param eventName - The name of the event.
     * @return The event ABI for the specified event name.
     */
    public getEventAbi(eventName: string | symbol): AbiEvent | undefined {
        const name = eventName.toString();
        const eventAbi = this.abi.find(
            (item) => item.type === 'event' && item.name === name
        );

        if (!eventAbi) {
            throw new IllegalArgumentError(
                'Contract.getEventAbi',
                `Event ${name} not found in ABI`,
                { eventName: name, abi: this.abi }
            );
        }

        return eventAbi as AbiEvent;
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
                    this.read[functionName] = async (...args: FunctionArgs) => {
                        try {
                            // Extract additional options from args if provided
                            const { args: cleanArgs, options } =
                                this.extractAdditionalOptions(args);

                            // Use the contracts module's executeCall method
                            const result =
                                await this.contractsModule.executeCall(
                                    this.address,
                                    abiItem,
                                    cleanArgs,
                                    {
                                        caller: this.signer
                                            ? this.signer.address.toString()
                                            : undefined,
                                        // Read operations don't send value, so omit value field
                                        ...this.contractCallOptions,
                                        ...options
                                    }
                                );

                            if (!result.success) {
                                throw new IllegalArgumentError(
                                    'Contract.initializeProxies',
                                    'Contract call failed',
                                    {
                                        functionName,
                                        errorMessage:
                                            result.result.errorMessage ||
                                            'Unknown error',
                                        contractAddress: this.address.toString()
                                    }
                                );
                            }

                            return result.result.array || [];
                        } catch (error) {
                            console.error(
                                `Error calling ${functionName}:`,
                                error
                            );
                            throw error;
                        }
                    };
                }

                // Transact methods (payable/nonpayable) - use ThorClient for transactions
                if (
                    abiItem.stateMutability === 'payable' ||
                    abiItem.stateMutability === 'nonpayable'
                ) {
                    this.transact[functionName] = async (
                        ...args: FunctionArgs
                    ) => {
                        if (!this.signer) {
                            throw new IllegalArgumentError(
                                'Contract.initializeProxies',
                                'Signer is required for transaction execution',
                                {
                                    functionName,
                                    contractAddress: this.address.toString()
                                }
                            );
                        }

                        try {
                            // Extract additional options from args if provided
                            const { args: cleanArgs, options } =
                                this.extractAdditionalOptions(args);

                            // Use the contracts module's executeTransaction method
                            const result =
                                await this.contractsModule.executeTransaction(
                                    this.signer,
                                    this.address,
                                    abiItem,
                                    cleanArgs,
                                    {
                                        ...this.contractTransactionOptions,
                                        ...options
                                    }
                                );

                            return result;
                        } catch (error) {
                            console.error(
                                `Error executing transaction ${functionName}:`,
                                error
                            );
                            throw error;
                        }
                    };
                }

                // Clause building - create VeChain transaction clauses
                this.clause[functionName] = (...args: FunctionArgs) => {
                    // Extract value from args if provided as last argument object
                    const { args: cleanArgs, options } =
                        this.extractAdditionalOptions(args);

                    const data = this.encodeFunctionData(
                        functionName,
                        cleanArgs
                    );
                    return {
                        to: this.address.toString(),
                        data: data,
                        value: options.value || '0x0',
                        comment: options.comment
                    };
                };
            }

            // Event filters - use ThorClient for event filtering
            if (abiItem.type === 'event') {
                const eventName = abiItem.name;
                this.filters[eventName] = (...args: FunctionArgs) => {
                    return {
                        address: this.address.toString(),
                        topics: [this.getEventSelector(eventName)]
                    };
                };

                this.criteria[eventName] = (...args: FunctionArgs) => {
                    return {
                        eventName: eventName,
                        args: args,
                        address: this.address.toString(),
                        topics: [this.getEventSelector(eventName)]
                    };
                };
            }
        }
    }

    /**
     * Extracts additional options from function arguments
     * @param args - The function arguments
     * @returns Clean arguments and extracted options
     */
    private extractAdditionalOptions(args: FunctionArgs): {
        args: FunctionArgs;
        options: {
            value?: string | number | bigint;
            comment?: string;
            revision?: Revision;
        };
    } {
        console.log('extractAdditionalOptions called with args:', args);
        console.log('args is array:', Array.isArray(args));

        // Check if the last argument is an options object
        if (
            args.length > 0 &&
            typeof args[args.length - 1] === 'object' &&
            args[args.length - 1] !== null
        ) {
            const lastArg = args[args.length - 1] as Record<
                string,
                string | number | bigint | boolean
            >;

            // Check if it contains contract-related options
            if (
                'value' in lastArg ||
                'comment' in lastArg ||
                'revision' in lastArg
            ) {
                const options: {
                    value?: string | number | bigint;
                    comment?: string;
                    revision?: Revision;
                } = {};

                if ('value' in lastArg) {
                    // Convert value to proper format
                    const value = lastArg.value;
                    if (typeof value === 'number') {
                        options.value = `0x${value.toString(16)}`;
                    } else if (typeof value === 'bigint') {
                        options.value = `0x${value.toString(16)}`;
                    } else if (typeof value === 'string') {
                        options.value = value.startsWith('0x')
                            ? value
                            : `0x${value}`;
                    } else {
                        options.value = '0x0';
                    }
                }

                if (
                    'comment' in lastArg &&
                    typeof lastArg.comment === 'string'
                ) {
                    options.comment = lastArg.comment;
                }

                if ('revision' in lastArg) {
                    const revision = lastArg.revision;
                    if (
                        typeof revision === 'string' ||
                        typeof revision === 'number'
                    ) {
                        options.revision = Revision.of(String(revision));
                    }
                }

                return {
                    args: args.slice(0, -1),
                    options
                };
            }
        }

        return {
            args,
            options: {}
        };
    }

    /**
     * Encodes function data for a given function name and arguments
     * @param functionName - The function name
     * @param args - The function arguments
     * @returns The encoded function data
     */
    public encodeFunctionData(
        functionName: string,
        args: FunctionArgs = []
    ): string {
        try {
            return encodeFunctionData({
                abi: this.abi as any,
                functionName: functionName as any,
                args: args as any
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

    /**
     * Gets the public client (if available)
     * @returns The public client or undefined
     */
    public getPublicClient():
        | {
              call: Function;
              estimateGas: Function;
              createEventFilter: Function;
              getLogs: Function;
              simulateCalls: Function;
              watchEvent: Function;
              thorNetworks: string;
          }
        | undefined {
        return this.contractsModule.getPublicClient();
    }

    /**
     * Gets the wallet client (if available)
     * @returns The wallet client or undefined
     */
    public getWalletClient():
        | {
              account: { digits: string; sign: number };
              sendTransaction: Function;
              thorNetworks: string;
          }
        | undefined {
        return this.contractsModule.getWalletClient();
    }

    /**
     * Sets read options for contract calls.
     * @param options - The contract call options to set.
     */
    public setReadOptions(options: ContractCallOptions): void {
        this.contractCallOptions = options;
    }

    /**
     * Sets transaction options for contract transactions.
     * @param options - The contract transaction options to set.
     */
    public setTransactOptions(options: ContractTransactionOptions): void {
        this.contractTransactionOptions = options;
    }

    /**
     * Gets the contract address as a string.
     * @returns The contract address as a string.
     */
    public getAddress(): string {
        return this.address.toString();
    }

    /**
     * Gets the contract ABI.
     * @returns The contract ABI.
     */
    public getABI(): TAbi {
        return this.abi;
    }

    /**
     * Checks if the contract has a specific function.
     * @param functionName - The name of the function to check.
     * @returns True if the function exists, false otherwise.
     */
    public hasFunction(functionName: string): boolean {
        return this.abi.some(
            (item) => item.type === 'function' && item.name === functionName
        );
    }

    /**
     * Checks if the contract has a specific event.
     * @param eventName - The name of the event to check.
     * @returns True if the event exists, false otherwise.
     */
    public hasEvent(eventName: string): boolean {
        return this.abi.some(
            (item) => item.type === 'event' && item.name === eventName
        );
    }

    /**
     * Gets all function names from the ABI.
     * @returns Array of function names.
     */
    public getFunctionNames(): string[] {
        return this.abi
            .filter((item) => item.type === 'function')
            .map((item) => item.name);
    }

    /**
     * Gets all event names from the ABI.
     * @returns Array of event names.
     */
    public getEventNames(): string[] {
        return this.abi
            .filter((item) => item.type === 'event')
            .map((item) => item.name);
    }

    /**
     * Gets the contract's signer.
     * @returns The signer or undefined.
     */
    public getSigner(): Signer | undefined {
        return this.signer;
    }
}

export { Contract };
