/* eslint-disable */
// TODO: Contracts module is pending rework - lint errors will be fixed during refactor
import type { Abi, AbiParameter } from 'abitype';
import { Address, Hex } from '@common/vcdm';
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
import { TransactionRequest } from '../../thor-client/model/transactions/TransactionRequest';

// Proper function arguments type using VeChain SDK types (runtime values, not ABI definitions)
type FunctionArgs = readonly unknown[];

/**
 * Viem-compatible contract interface
 */
export interface ViemContract<TAbi extends Abi> {
    /**
     * Contract address
     */
    address: Address;

    /**
     * Contract ABI
     */
    abi: TAbi;

    /**
     * Read methods for view/pure functions
     */
    read: Record<
        string,
        (
            ...args: FunctionArgs
        ) => Promise<(string | number | bigint | boolean | Address | Hex)[]>
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
        setTransactOptions: (options: TransactionRequest) => void;
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
            ) => Promise<(string | number | bigint | boolean | Address | Hex)[]>
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
            setTransactOptions: (options: TransactionRequest) =>
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
                abiItem.stateMutability === 'pure')
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

                // Create a TransactionRequest if any params are provided
                if (
                    params &&
                    (params.value ||
                        params.gas ||
                        params.gasPriceCoef ||
                        params.maxFeePerGas ||
                        params.maxPriorityFeePerGas)
                ) {
                    const transactionRequest = new TransactionRequest({
                        clauses: [], // Will be set by the contract method
                        gas: params.gas ?? 21000n,
                        gasPriceCoef: params.gasPriceCoef ?? 0n,
                        nonce: 0,
                        blockRef: Hex.of('0x0000000000000000'),
                        chainTag: 0x27,
                        dependsOn: null,
                        expiration: 720,
                        maxFeePerGas: params.maxFeePerGas,
                        maxPriorityFeePerGas: params.maxPriorityFeePerGas
                    });
                    contract.setTransactOptions(transactionRequest);
                }

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
function isCompiledContractFormat(obj: unknown): obj is { abi: Abi; [key: string]: unknown } {
    return (
        obj !== null &&
        typeof obj === 'object' &&
        'abi' in obj &&
        Array.isArray((obj as { abi: unknown }).abi)
    );
}

export function getContract<TAbi extends Abi>(
    contractsModule: ContractsModule,
    address: Address,
    abi: TAbi,
    signer?: Signer
): ViemContract<TAbi> {
    // Extract ABI array from full contract JSON if needed
    const actualAbi = isCompiledContractFormat(abi) ? (abi.abi as TAbi) : abi;
    const contract = contractsModule.load(address, actualAbi, signer);
    return createViemContract(contract);
}
