import type { Abi, AbiParameter } from 'abitype';
import { type Address, type Hex } from '@common/vcdm';
import { type Signer } from '@thor/signer';
import { type Contract } from './model/contract';
import { type ContractsModule } from './contracts-module';
import type {
    WriteContractParameters,
    EventFilter,
    SimulationResult,
    ContractCallOptions,
    ContractTransactionOptions
} from './types';

// Proper function arguments type using VeChain SDK types
type FunctionArgs = AbiParameter[];

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
        setTransactOptions: (options: ContractTransactionOptions) => void;
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
            setTransactOptions: (options: ContractTransactionOptions) =>
                contract.setTransactOptions(options),
            clause: contract.clause as any,
            criteria: contract.criteria
        }
    };

    // Create read methods
    for (const abiItem of contract.abi) {
        if (
            abiItem.type === 'function' &&
            (abiItem.stateMutability === 'view' ||
                abiItem.stateMutability === 'pure')
        ) {
            viemContract.read[abiItem.name] = async (...args: FunctionArgs) => {
                return await contract.read[abiItem.name](...args);
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
            viemContract.write[abiItem.name] = async (
                params?: WriteContractParameters
            ) => {
                const args = params?.args || [];
                const options: ContractTransactionOptions = {};

                if (params?.value) {
                    options.value = params.value.toString();
                }
                if (params?.gas) {
                    options.gasLimit = Number(params.gas);
                }
                if (params?.gasPrice) {
                    options.gasPrice = params.gasPrice.toString();
                }

                // Set transaction options if provided
                if (Object.keys(options).length > 0) {
                    contract.setTransactOptions(options);
                }

                const result = await contract.transact[abiItem.name](...args);
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
                    const result = await contract.read[abiItem.name](...args);

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
            viemContract.events[abiItem.name] = {
                address: contract.address.toString(),
                topics: [contract.getEventSelector(abiItem.name)]
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
export function getContract<TAbi extends Abi>(
    contractsModule: ContractsModule,
    address: Address,
    abi: TAbi,
    signer?: Signer
): ViemContract<TAbi> {
    const contract = contractsModule.load(address, abi, signer);
    return createViemContract(contract);
}
