/* eslint-disable */
// TODO: Contracts module is pending rework - lint errors will be fixed during refactor
import {
    type Abi,
    type AbiFunction,
    type AbiEvent,
    type AbiParameter,
    type ExtractAbiFunctionNames,
    type ExtractAbiEventNames,
    type AbiParametersToPrimitiveTypes,
    type ExtractAbiFunction
} from 'abitype';

// Custom type to handle single vs multiple outputs like viem
type ContractReadResult<
    TAbi extends Abi,
    TFunctionName extends ExtractAbiFunctionNames<
        TAbi,
        'view' | 'pure' | 'nonpayable' | 'payable'
    >
> = ExtractAbiFunction<TAbi, TFunctionName>['outputs'] extends readonly [any]
    ? AbiParametersToPrimitiveTypes<
          ExtractAbiFunction<TAbi, TFunctionName>['outputs'],
          'outputs'
      >[0]
    : AbiParametersToPrimitiveTypes<
          ExtractAbiFunction<TAbi, TFunctionName>['outputs'],
          'outputs'
      >;
import { encodeFunctionData, toEventSelector } from 'viem';
import { type Signer } from '@thor/signer';
import { Address, AddressLike, Hex, Revision } from '@common/vcdm';
import { IllegalArgumentError } from '@common/errors';
import { log } from '@common/logging';
import type { ContractCallOptions } from '../types';
import type { ContractsModule } from '../contracts-module';
import type { TransactionRequest } from '../../model/transactions/TransactionRequest';
import { RevisionLike } from '@common/vcdm';
// Proper function arguments type using VeChain SDK types (runtime values, not ABI definitions)
type FunctionArgs = readonly unknown[];

type ContractReadOptionsInput = Omit<ContractCallOptions, 'revision'> & {
    revision?: RevisionLike;
};

/**
 * A class representing a smart contract deployed on the blockchain.
 * This is the middle-layer contract that provides VeChain-specific functionality.
 */
class Contract<TAbi extends Abi> {
    readonly contractsModule: ContractsModule;
    readonly address: AddressLike;
    readonly abi: TAbi;
    private signer?: Signer;

    public read: {
        [K in ExtractAbiFunctionNames<
            TAbi,
            'view' | 'pure' | 'nonpayable' | 'payable'
        >]: (
            ...args: AbiParametersToPrimitiveTypes<
                ExtractAbiFunction<TAbi, K>['inputs'],
                'inputs'
            >
        ) => Promise<ContractReadResult<TAbi, K>>;
    } = {} as any;
    public transact: {
        [K in ExtractAbiFunctionNames<TAbi, 'payable' | 'nonpayable'>]: (
            ...args: AbiParametersToPrimitiveTypes<
                ExtractAbiFunction<TAbi, K>['inputs'],
                'inputs'
            >
        ) => Promise<Hex>;
    } = {} as any;
    public write: {
        [K in ExtractAbiFunctionNames<TAbi, 'payable' | 'nonpayable'>]: (
            ...args: AbiParametersToPrimitiveTypes<
                ExtractAbiFunction<TAbi, K>['inputs'],
                'inputs'
            >
        ) => Promise<Hex>;
    } = {} as any;
    public filters: {
        [K in ExtractAbiEventNames<TAbi>]: (
            ...args: AbiParametersToPrimitiveTypes<
                ExtractAbiFunction<TAbi, K>['inputs'],
                'inputs'
            >
        ) => { address: string; topics: string[] };
    } = {} as any;
    public clause: {
        [K in ExtractAbiFunctionNames<TAbi>]: (
            ...args: AbiParametersToPrimitiveTypes<
                ExtractAbiFunction<TAbi, K>['inputs'],
                'inputs'
            >
        ) => {
            to: string;
            data: string;
            value: bigint;
            comment?: string;
        };
    } = {} as any;
    public criteria: {
        [K in ExtractAbiEventNames<TAbi>]: (
            ...args: AbiParametersToPrimitiveTypes<
                ExtractAbiFunction<TAbi, K>['inputs'],
                'inputs'
            >
        ) => {
            eventName: string;
            args: AbiParameter[];
            address: string;
            topics: string[];
        };
    } = {} as any;

    private contractCallOptions: ContractCallOptions = {};
    private contractTransactionRequest?: TransactionRequest;

    /**
     * Initializes a new instance of the `Contract` class.
     * @param address The address of the contract.
     * @param abi The Application Binary Interface (ABI) of the contract.
     * @param contractsModule The contracts module for blockchain interaction.
     * @param signer The signer used for signing transactions.
     * @param deployTransactionReceipt Optional transaction receipt from deployment.
     */
    constructor(
        address: AddressLike,
        abi: TAbi,
        contractsModule: ContractsModule,
        signer?: Signer
    ) {
        this.abi = abi;
        this.address = Address.of(address);
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
        options: ContractReadOptionsInput
    ): ContractCallOptions {
        this.contractCallOptions = this.normalizeContractCallOptions(options);
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

    private normalizeContractCallOptions(
        options: ContractReadOptionsInput
    ): ContractCallOptions {
        if (options.revision == null) {
            return options as ContractCallOptions;
        }

        return {
            ...options,
            revision: Revision.of(options.revision)
        };
    }

    /**
     * Sets the options for contract transactions.
     * @param options - The contract transaction options to set.
     * @returns The updated contract transaction options.
     */
    public setContractTransactOptions(
        transactionRequest: TransactionRequest
    ): TransactionRequest {
        this.contractTransactionRequest = transactionRequest;
        return this.contractTransactionRequest;
    }

    /**
     * Gets the current contract transaction request.
     * @returns The current contract transaction request.
     */
    public getContractTransactOptions(): TransactionRequest | undefined {
        return this.contractTransactionRequest;
    }

    /**
     * Clears the current contract transaction request, resetting it to undefined.
     */
    public clearContractTransactOptions(): void {
        this.contractTransactionRequest = undefined;
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
     * Gets detailed parameter information (names and types) for a specific function.
     * This is useful for inspecting function signatures and building dynamic UIs.
     *
     * @param functionName - The name of the function to inspect
     * @returns Object containing inputs and outputs parameter information
     *
     * @example
     * ```typescript
     * const contract = thorClient.contracts.load(address, abi);
     * const paramInfo = contract.getParameterInfo('transfer');
     *
     * // paramInfo.inputs = [
     * //   { name: 'to', type: 'address', internalType: 'address' },
     * //   { name: 'amount', type: 'uint256', internalType: 'uint256' }
     * // ]
     * // paramInfo.outputs = [
     * //   { name: '', type: 'bool', internalType: 'bool' }
     * // ]
     * ```
     */
    public getParameterInfo(functionName: string): {
        inputs: readonly AbiParameter[];
        outputs: readonly AbiParameter[];
        stateMutability: string;
    } {
        const functionAbi = this.getFunctionAbi(functionName);

        if (!functionAbi) {
            throw new IllegalArgumentError(
                'Contract.getParameterInfo',
                `Function ${functionName} not found in ABI`,
                { functionName, abi: this.abi }
            );
        }

        return {
            inputs: functionAbi.inputs || [],
            outputs: functionAbi.outputs || [],
            stateMutability: functionAbi.stateMutability || 'nonpayable'
        };
    }

    /**
     * Gets a formatted string representation of a function's signature including parameter names.
     * Useful for displaying in UIs or documentation.
     *
     * @param functionName - The name of the function
     * @returns A formatted string like "transfer(address to, uint256 amount) returns (bool)"
     *
     * @example
     * ```typescript
     * const contract = thorClient.contracts.load(address, abi);
     * const signature = contract.getFunctionSignature('transfer');
     * // Returns: "transfer(address to, uint256 amount) returns (bool)"
     * ```
     */
    public getFunctionSignature(functionName: string): string {
        const paramInfo = this.getParameterInfo(functionName);

        const inputsStr = paramInfo.inputs
            .map(
                (param) => `${param.type}${param.name ? ` ${param.name}` : ''}`
            )
            .join(', ');

        const outputsStr =
            paramInfo.outputs.length > 0
                ? ` returns (${paramInfo.outputs.map((param) => param.type).join(', ')})`
                : '';

        return `${functionName}(${inputsStr})${outputsStr}`;
    }

    /**
     * Lists all available functions in the contract with their signatures.
     * Useful for debugging and documentation.
     *
     * @returns Array of function signatures
     *
     * @example
     * ```typescript
     * const contract = thorClient.contracts.load(address, abi);
     * const functions = contract.listFunctions();
     * // Returns: [
     * //   "transfer(address to, uint256 amount) returns (bool)",
     * //   "balanceOf(address account) returns (uint256)",
     * //   ...
     * // ]
     * ```
     */
    public listFunctions(): string[] {
        return this.abi
            .filter((item): item is AbiFunction => item.type === 'function')
            .map((func) => this.getFunctionSignature(func.name));
    }

    /**
     * Initializes the proxy objects for dynamic method binding
     * This replaces the complex proxy system with simple object initialization
     */
    private initializeProxies(): void {
        // Initialize read methods for all callable functions (view/pure and simulated state-changing)
        for (const abiItem of this.abi) {
            if (abiItem.type === 'function') {
                const functionName = abiItem.name;

                const isReadableFunction =
                    abiItem.stateMutability === 'view' ||
                    abiItem.stateMutability === 'pure' ||
                    abiItem.stateMutability === 'nonpayable' ||
                    abiItem.stateMutability === 'payable';

                // Read methods (simulated calls) - use ThorClient for blockchain calls
                if (isReadableFunction) {
                    (this.read as any)[functionName] = async (
                        ...args: any[]
                    ) => {
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
                                        caller: this.signer?.address,
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

                            // Return single value if array has one element, otherwise return the array
                            const resultArray = result.result.array || [];
                            return resultArray.length === 1
                                ? resultArray[0]
                                : resultArray;
                        } catch (error) {
                            log.error({
                                message: `Error calling ${functionName}`,
                                context: { functionName, error }
                            });
                            throw error;
                        }
                    };
                }

                // Transact methods (payable/nonpayable) - use ThorClient for transactions
                if (
                    abiItem.stateMutability === 'payable' ||
                    abiItem.stateMutability === 'nonpayable'
                ) {
                    (this.transact as any)[functionName] = async (
                        ...args: any[]
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
                                    this.contractTransactionRequest,
                                    options.value
                                );

                            return result;
                        } catch (error) {
                            log.error({
                                message: `Error executing transaction ${functionName}`,
                                context: { functionName, error }
                            });
                            throw error;
                        }
                    };
                }

                // Write methods - alias to transact for consistency
                if (
                    abiItem.stateMutability === 'payable' ||
                    abiItem.stateMutability === 'nonpayable'
                ) {
                    (this.write as any)[functionName] = async (
                        ...args: any[]
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
                                    this.signer!,
                                    this.address,
                                    abiItem,
                                    cleanArgs,
                                    this.contractTransactionRequest,
                                    options.value
                                );

                            return result;
                        } catch (error) {
                            log.error({
                                message: `Error executing transaction ${functionName}`,
                                context: { functionName, error }
                            });
                            throw error;
                        }
                    };
                }

                // Clause building - create VeChain transaction clauses
                (this.clause as any)[functionName] = (...args: any[]) => {
                    // Extract value from args if provided as last argument object
                    const { args: cleanArgs, options } =
                        this.extractAdditionalOptions(args);

                    const data = encodeFunctionData({
                        abi: this.abi as any,
                        functionName: functionName as any,
                        args: cleanArgs as any
                    });
                    return {
                        to: this.address.toString(),
                        data: data,
                        value: options.value || 0n,
                        comment: options.comment
                    };
                };
            }

            // Event filters - use ThorClient for event filtering
            if (abiItem.type === 'event') {
                const eventName = abiItem.name;
                (this.filters as any)[eventName] = (...args: any[]) => {
                    const eventAbi = this.getEventAbi(eventName);
                    return {
                        address: this.address.toString(),
                        topics: [toEventSelector(eventAbi as any)]
                    };
                };

                (this.criteria as any)[eventName] = (...args: any[]) => {
                    const eventAbi = this.getEventAbi(eventName);
                    return {
                        eventName: eventName,
                        args: args,
                        address: this.address.toString(),
                        topics: [toEventSelector(eventAbi as any)]
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
            value?: bigint;
            comment?: string;
            revision?: Revision;
        };
    } {
        log.debug({
            message: 'extractAdditionalOptions called with args',
            context: { args }
        });
        log.debug({
            message: 'args is array',
            context: { isArray: Array.isArray(args) }
        });

        // Check if the last argument is an options object
        if (
            args.length > 0 &&
            typeof args[args.length - 1] === 'object' &&
            args[args.length - 1] !== null
        ) {
            const lastArg = args[args.length - 1] as Record<
                string,
                string | number | bigint | boolean | Revision
            >;

            // Check if it contains contract-related options
            if (
                'value' in lastArg ||
                'comment' in lastArg ||
                'revision' in lastArg
            ) {
                const options: {
                    value?: bigint;
                    comment?: string;
                    revision?: Revision;
                } = {};

                if ('value' in lastArg) {
                    // Convert value to bigint
                    const value = lastArg.value;
                    if (typeof value === 'number') {
                        options.value = BigInt(value);
                    } else if (typeof value === 'bigint') {
                        options.value = value;
                    } else if (typeof value === 'string') {
                        options.value = BigInt(
                            value.startsWith('0x') ? value : `0x${value}`
                        );
                    } else {
                        options.value = 0n;
                    }
                }

                if (
                    'comment' in lastArg &&
                    typeof lastArg.comment === 'string'
                ) {
                    options.comment = lastArg.comment;
                }

                if ('revision' in lastArg) {
                    const revision = lastArg.revision as Revision;
                    // Convert to Revision object if not already one
                    options.revision = revision;
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
     * Sets read options for contract calls.
     * @param options - The contract call options to set.
     */
    public setReadOptions(options: ContractCallOptions): void {
        this.contractCallOptions = options;
    }

    /**
     * Sets transaction options for contract transactions.
     * @param transactionRequest - The transaction request to set.
     */
    public setTransactOptions(transactionRequest: TransactionRequest): void {
        this.contractTransactionRequest = transactionRequest;
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
