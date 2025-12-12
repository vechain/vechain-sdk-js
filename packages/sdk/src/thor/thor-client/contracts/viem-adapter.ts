/* eslint-disable */
// TODO: Contracts module is pending rework - lint errors will be fixed during refactor
import type { Abi, AbiParameter } from 'abitype';
import { Address, AddressLike, Hex } from '@common/vcdm';
import { type Signer } from '@thor/signer';
import { toEventSelector } from 'viem';
import { type Contract } from './model/contract';
import { type ContractsModule } from './contracts-module';
import type {
    WriteContractParameters,
    EventFilter,
    SimulationResult,
    ContractCallOptions
} from './types';
import { type TransactionBodyOptions } from '../../thor-client/model/transactions/TransactionBody';

// Proper function arguments type using VeChain SDK types (runtime values, not ABI definitions)
type FunctionArgs = readonly unknown[];

/**
 * Viem-compatible contract interface
 */
export interface ViemContract<TAbi extends Abi> {
    /**
     * Contract address
     */
    address: AddressLike;

    /**
     * Contract ABI
     */
    abi: TAbi;

    /**
     * Read methods for all ABI functions (state-changing ones are simulated)
     */
    read: Record<
        string,
        (
            ...args: FunctionArgs
        ) => Promise<(string | number | bigint | boolean | AddressLike | Hex)[]>
    >;

    /**
     * Write methods for state-changing functions
     */
    write: Record<
        string,
        (params?: WriteContractParameters) => Promise<string>
    >;

    /**
     * Simulation methods for testing
     */
    simulate: Record<
        string,
        (params?: {
            args?: FunctionArgs;
            value?: bigint;
        }) => Promise<SimulationResult>
    >;

    /**
     * Gas estimation methods
     */
    estimateGas: Record<
        string,
        (params?: { args?: FunctionArgs; value?: bigint }) => Promise<bigint>
    >;

    /**
     * Event filtering methods
     */
    events: Record<string, EventFilter>;

    /**
     * VeChain-specific features
     */
    _vechain?: {
        setReadOptions: (options: ContractCallOptions) => void;
        setTransactOptions: (options: TransactionBodyOptions) => void;
        clause: Record<
            string,
            (...args: FunctionArgs) => {
                to: Address;
                data: string;
                value: string;
            }
        >;
        criteria: Record<
            string,
            (...args: FunctionArgs) => {
                eventName: string;
                args: FunctionArgs;
                address: string;
                topics: string[];
            }
        >;
    };
}

/**
 * Creates a viem-compatible contract adapter
 * @param contract - The VeChain contract instance
 * @returns A viem-compatible contract interface
 */
export function createViemContract<TAbi extends Abi>(
    contract: Contract<TAbi>
): ViemContract<TAbi> {
    const viemContract: ViemContract<TAbi> = {
        address: contract.address,
        abi: contract.abi,
        read: {} as Record<
            string,
            (
                ...args: FunctionArgs
            ) => Promise<
                (string | number | bigint | boolean | AddressLike | Hex)[]
            >
        >,
        write: {} as Record<
            string,
            (params?: WriteContractParameters) => Promise<string>
        >,
        simulate: {} as Record<
            string,
            (params?: {
                args?: FunctionArgs;
                value?: bigint;
            }) => Promise<SimulationResult>
        >,
        estimateGas: {} as Record<
            string,
            (params?: {
                args?: FunctionArgs;
                value?: bigint;
            }) => Promise<bigint>
        >,
        events: {} as Record<string, EventFilter>,
        _vechain: {
            setReadOptions: (options: ContractCallOptions) =>
                contract.setReadOptions(options),
            setTransactOptions: (options: TransactionBodyOptions) =>
                contract.setTransactOptions(options),
            clause: contract.clause as any,
            criteria: contract.criteria as any
        }
    };

    // Create read methods
    for (const abiItem of contract.abi) {
        if (
            abiItem.type === 'function' &&
            (abiItem.stateMutability === 'view' ||
                abiItem.stateMutability === 'pure' ||
                abiItem.stateMutability === 'nonpayable' ||
                abiItem.stateMutability === 'payable')
        ) {
            (viemContract.read as any)[abiItem.name] = async (
                ...args: FunctionArgs
            ) => {
                return await (contract.read as any)[abiItem.name](...args);
            };
        }
    }

    // Create write methods
    for (const abiItem of contract.abi) {
        if (
            abiItem.type === 'function' &&
            (abiItem.stateMutability === 'nonpayable' ||
                abiItem.stateMutability === 'payable')
        ) {
            (viemContract.write as any)[abiItem.name] = async (
                params?: WriteContractParameters
            ) => {
                const args = params?.args || [];

                // Apply transaction options only when explicitly provided
                const transactionOptions: TransactionBodyOptions = {
                    useLegacyDefaults: true
                };
                let hasOverrides = false;

                if (params?.gas !== undefined) {
                    transactionOptions.gas = params.gas;
                    hasOverrides = true;
                }

                if (params?.gasPriceCoef !== undefined) {
                    transactionOptions.gasPriceCoef = params.gasPriceCoef;
                    hasOverrides = true;
                }

                if (params?.maxFeePerGas !== undefined) {
                    transactionOptions.maxFeePerGas = params.maxFeePerGas;
                    hasOverrides = true;
                }

                if (params?.maxPriorityFeePerGas !== undefined) {
                    transactionOptions.maxPriorityFeePerGas =
                        params.maxPriorityFeePerGas;
                    hasOverrides = true;
                }

                if (hasOverrides) {
                    delete transactionOptions.useLegacyDefaults;
                }

                contract.setTransactOptions(transactionOptions);

                const result = await (contract.transact as any)[abiItem.name](
                    ...args
                );
                return result.id;
            };
        }
    }

    // Create simulation methods
    for (const abiItem of contract.abi) {
        if (
            abiItem.type === 'function' &&
            (abiItem.stateMutability === 'nonpayable' ||
                abiItem.stateMutability === 'payable')
        ) {
            viemContract.simulate[abiItem.name] = async (params?: {
                args?: FunctionArgs;
                value?: bigint;
            }) => {
                try {
                    const args = params?.args || [];
                    const result = await (contract.read as any)[abiItem.name](
                        ...args
                    );

                    return {
                        success: true,
                        result: result,
                        gasUsed: BigInt(21000) // Default gas estimation
                    };
                } catch (error) {
                    return {
                        success: false,
                        result: [],
                        error:
                            error instanceof Error
                                ? error.message
                                : 'Unknown error'
                    } as SimulationResult;
                }
            };
        }
    }

    // Create gas estimation methods
    for (const abiItem of contract.abi) {
        if (
            abiItem.type === 'function' &&
            (abiItem.stateMutability === 'nonpayable' ||
                abiItem.stateMutability === 'payable')
        ) {
            viemContract.estimateGas[abiItem.name] = async (params?: {
                args?: FunctionArgs;
                value?: bigint;
            }) => {
                // Default gas estimation - in a real implementation, this would use ThorClient
                return BigInt(21000);
            };
        }
    }

    // Create event methods
    for (const abiItem of contract.abi) {
        if (abiItem.type === 'event') {
            const eventAbi = contract.getEventAbi(abiItem.name);
            viemContract.events[abiItem.name] = {
                address: contract.address.toString(),
                topics: [toEventSelector(eventAbi as any)]
            };
        }
    }

    return viemContract;
}

/**
 * Creates a viem-compatible contract from ContractsModule
 * @param contractsModule - The contracts module
 * @param address - The contract address
 * @param abi - The contract ABI
 * @param signer - Optional signer
 * @returns A viem-compatible contract
 */
/**
 * Type guard to check if an object is a CompiledContract
 */
function isCompiledContractFormat(
    obj: unknown
): obj is { abi: Abi; [key: string]: unknown } {
    return (
        obj !== null &&
        typeof obj === 'object' &&
        'abi' in obj &&
        Array.isArray((obj as { abi: unknown }).abi)
    );
}

export function getContract<TAbi extends Abi>(
    contractsModule: ContractsModule,
    address: AddressLike,
    abi: TAbi,
    signer?: Signer
): ViemContract<TAbi> {
    const normalizedAddress = Address.of(address);
    // Extract ABI array from full contract JSON if needed
    const actualAbi = isCompiledContractFormat(abi) ? (abi.abi as TAbi) : abi;
    const contract = contractsModule.load(normalizedAddress, actualAbi, signer);
    return createViemContract(contract);
}
