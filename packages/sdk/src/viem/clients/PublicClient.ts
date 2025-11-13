import { Address, Hex, Revision } from '@common/vcdm';
import { type HttpClient, FetchHttpClient } from '@common/http';
import {
    type BeatsSubscription,
    BlocksSubscription,
    EventsSubscription,
    NewTransactionSubscription,
    type SubscriptionEventResponse,
    type TransfersSubscription
} from '@thor/thorest';
import type { TXID } from '@thor/thorest/transactions';
import { MozillaWebSocketClient, type WebSocketListener } from '@thor/ws';
import type { ThorNetworks } from '@thor/utils/const';
import {
    BlockNotFoundError,
    TransactionNotFoundError,
    TransactionReceiptNotFoundError,
    InvalidAddressError,
    ChainNotFoundError,
    FilterTypeNotSupportedError,
    WebSocketRequestError,
    WaitForTransactionReceiptTimeoutError
} from 'viem';
import { log } from '@common/logging';
import { ThorClient } from '@thor/thor-client/ThorClient';
import { EventLogFilter } from '@thor/thor-client/model/logs/EventLogFilter';
import { type DecodedEventLog } from '@thor/thor-client/model/logs/DecodedEventLog';
import { FilterRange } from '@thor/thor-client/model/logs/FilterRange';
import { FilterRangeUnits } from '@thor/thor-client/model/logs/FilterRangeUnits';
import { FilterOptions } from '@thor/thor-client/model/logs/FilterOptions';
import { EventCriteria } from '@thor/thor-client/model/logs/EventCriteria';
import { type AbiEvent, toEventSelector } from 'viem';
import type { FeeHistory } from '@thor/thor-client/model/gas/FeeHistory';
import {
    type ClauseSimulationResult,
    type Clause,
    type SimulateTransactionOptions,
    type Transaction
} from '@thor/thor-client/model/transactions';
import type {
    TransactionReceipt,
    EstimateGasOptions,
    EstimateGasResult
} from '@thor/thor-client/model';
import {
    type Block,
    type ExpandedBlock,
    type RawBlock
} from '@thor/thor-client/model/blocks';
import { RevisionType } from '@common/vcdm/RevisionType';
import {
    TimeoutError as ThorTimeoutError,
    IllegalArgumentError
} from '@common/errors';

/**
 * Filter types for viem compatibility.
 */
type Filter = EventFilter | BlockFilter | PendingTransactionFilter;

/**
 * Event filter type for viem compatibility.
 */
interface EventFilter {
    /** Unique identifier for the filter */
    id: string;
    /** Type of filter */
    type: 'event';
    /** The filter to be used **/
    filter: EventLogFilter;
    /** The event abis to be used for decoding */
    eventAbis: AbiEvent[];
}

/**
 * Block filter type for viem compatibility.
 */
interface BlockFilter {
    /** Unique identifier for the filter */
    id: string;
    /** Type of filter */
    type: 'block';
    /** The last processed block number */
    lastBlockProcessed?: number;
    /** Subscription instance */
    subscription?: BlocksSubscription;
}

/**
 * Pending transaction filter type for viem compatibility.
 */
interface PendingTransactionFilter {
    /** Unique identifier for the filter */
    id: string;
    /** Type of filter */
    type: 'transaction';
    /** List of processed transaction IDs */
    processedTxIds: Set<string>;
    /** Subscription instance */
    subscription?: NewTransactionSubscription;
    txQueue?: string[];
}

interface PublicClientConfig {
    network: URL | ThorNetworks;
    transport?: HttpClient;
}

enum BlockReponseType {
    raw = 'raw', // vechain specific
    expanded = 'expanded', // vechain specific
    regular = 'regular' // vechain specific
}

/**
 * Creates a viem-compatible PublicClient for VeChain.
 *
 * @param {PublicClientConfig} config - Configuration object.
 * @param {URL | ThorNetworks} config.network - Network URL or ThorNetworks enum.
 * @param {HttpClient} config.transport - Custom HTTP transport (optional, defaults to FetchHttpClient).
 * @returns {PublicClient} A configured PublicClient instance.
 */
function createPublicClient({
    network,
    transport
}: PublicClientConfig): PublicClient {
    const transportLayer = transport ?? new FetchHttpClient(new URL(network));
    return new PublicClient(network, transportLayer);
}

class PublicClient {
    readonly network: URL | ThorNetworks;
    protected readonly httpClient: HttpClient;
    protected readonly thorClient: ThorClient;

    constructor(network: URL | ThorNetworks, transport: HttpClient) {
        this.network = network;
        this.httpClient = transport;
        this.thorClient = ThorClient.at(this.httpClient);
    }

    /**
     * Gets the balance of an address in wei.
     *
     * @param {Address} address - The address to query.
     * @returns {Promise<bigint>} The balance in wei.
     * @throws {InvalidAddressError} If the address is invalid.
     */
    public async getBalance(address: Address): Promise<bigint> {
        try {
            const accountDetails =
                await this.thorClient.accounts.getAccount(address);
            if (accountDetails === null) {
                throw new InvalidAddressError({ address: address.toString() });
            }
            const { balance } = accountDetails;
            return balance;
        } catch (error) {
            // Log the error
            log.error({
                message: `Failed to get balance for address ${address.toString()}`,
                source: 'PublicClient.getBalance',
                context: {
                    error:
                        error instanceof Error ? error.message : String(error),
                    address: address.toString()
                }
            });
            throw error;
        }
    }

    /**
     * Gets a block by revision.
     *
     * @param {Revision} revision - The block revision to query (default: latest).
     * @param {BlockReponseType} type - Block response format: regular, expanded, or raw.
     * @returns {Promise<ExpandedBlock | RawBlock | Block | null>} The block or null if not found.
     * @throws {BlockNotFoundError} If the block doesn't exist.
     */
    public async getBlock(
        revision: Revision = Revision.BEST, // vechain specific
        type: BlockReponseType = BlockReponseType.regular // vechain specific
    ): Promise<ExpandedBlock | RawBlock | Block | null> {
        const blockNumber =
            revision.revisionType === RevisionType.BlockNumber
                ? BigInt(revision.toString())
                : undefined;

        try {
            if (type === BlockReponseType.expanded) {
                const data =
                    await this.thorClient.blocks.getBlockExpanded(revision);
                if (data === null) {
                    throw new BlockNotFoundError({ blockNumber });
                }
                return data;
            } else if (type === BlockReponseType.raw) {
                const data = await this.thorClient.blocks.getBlockRaw(revision);
                if (data === null) {
                    throw new BlockNotFoundError({ blockNumber });
                }
                return data;
            } else {
                const data = await this.thorClient.blocks.getBlock(revision);
                if (data === null) {
                    throw new BlockNotFoundError({ blockNumber });
                }
                return data;
            }
        } catch (error) {
            // Log the error
            log.error({
                message: `Failed to get block at revision ${revision.toString()}`,
                source: 'PublicClient.getBlock',
                context: {
                    error:
                        error instanceof Error ? error.message : String(error),
                    revision: revision.toString()
                }
            });
            throw error;
        }
    }

    /**
     * Gets the block number.
     *
     * @param {Revision} revision - The revision to query (default: latest).
     * @returns {Promise<number>} The block number.
     * @throws {BlockNotFoundError} If the block doesn't exist.
     */
    public async getBlockNumber(
        revision: Revision = Revision.BEST
    ): Promise<number> {
        const selectedBlock = await this.thorClient.blocks.getBlock(revision);

        if (selectedBlock?.number === undefined) {
            const notFoundRevision =
                revision.revisionType === RevisionType.BlockNumber
                    ? BigInt(revision.toString())
                    : undefined;
            throw new BlockNotFoundError({ blockNumber: notFoundRevision });
        }

        return selectedBlock.number;
    }

    /**
     * Gets the number of transactions in a block.
     *
     * @param {Revision} revision - The block revision to query (default: latest).
     * @returns {Promise<number>} The transaction count.
     * @throws {BlockNotFoundError} If the block doesn't exist.
     */
    public async getBlockTransactionCount(
        revision: Revision = Revision.BEST
    ): Promise<number> {
        const selectedBlock = await this.thorClient.blocks.getBlock(revision);

        if (selectedBlock === null) {
            const notFoundRevision =
                revision.revisionType === RevisionType.BlockNumber
                    ? BigInt(revision.toString())
                    : undefined;
            throw new BlockNotFoundError({ blockNumber: notFoundRevision });
        }

        return selectedBlock.transactions.length;
    }

    /**
     * Watches for new blocks starting from a specific position.
     *
     * @param {Hex} pos - The starting block position.
     * @returns {BlocksSubscription} The blocks subscription.
     */
    public watchBlocks(pos: Hex): BlocksSubscription {
        return BlocksSubscription.at(
            new MozillaWebSocketClient(`ws://${this.httpClient.baseURL.host}`)
        ).atPos(pos);
    }

    /**
     * Watches for new blocks from the latest block.
     *
     * @returns {BlocksSubscription} The blocks subscription.
     */
    public watchBlockNumber(): BlocksSubscription {
        return BlocksSubscription.at(
            new MozillaWebSocketClient(`ws://${this.httpClient.baseURL.host}`)
        );
    }

    /**
     * Simulates multiple transaction clauses without sending them.
     *
     * @param {Clause[]} clauses - The clauses to simulate.
     * @param {SimulateTransactionOptions} options - Simulation options.
     * @returns {Promise<ClauseSimulationResult[]>} The simulation results.
     */
    public async simulateCalls(
        clauses: Clause[],
        options?: SimulateTransactionOptions
    ): Promise<ClauseSimulationResult[]> {
        // this and call are the same because ETH doesn't support multi-call and they have explicit functions for this.
        // viem specific
        const results = await this.thorClient.transactions.simulateTransaction(
            clauses,
            options
        );
        return results;
    }

    /**
     * Simulates a single transaction clause without sending it.
     *
     * @param {Clause} clause - The clause to simulate.
     * @param {SimulateTransactionOptions} options - Simulation options.
     * @returns {Promise<ClauseSimulationResult>} The simulation result.
     */

    public async call(
        clause: Clause,
        options?: SimulateTransactionOptions
    ): Promise<ClauseSimulationResult> {
        try {
            const result =
                await this.thorClient.transactions.simulateTransaction(
                    [clause],
                    options
                );
            return result[0];
        } catch (error) {
            // Log the error
            log.error({
                message: 'Failed to simulate transaction call',
                source: 'PublicClient.call',
                context: {
                    error:
                        error instanceof Error ? error.message : String(error)
                }
            });
            throw error;
        }
    }

    /**
     * Gets the fee history for recent blocks.
     *
     * @param {number} blockCount - Number of recent blocks to query.
     * @returns {Promise<FeeHistory>} The fee history data.
     */
    public async getFeeHistory(blockCount: number): Promise<FeeHistory> {
        const gasModule = this.thorClient.gas;
        const gas = await gasModule.getFeeHistory(blockCount);
        return gas;
    }

    /**
     * Gets the current gas prices (base fee per gas).
     *
     * @returns {Promise<bigint[]>} Array of base fees per gas for recent blocks.
     */
    public async getGasPrice(): Promise<bigint[]> {
        // viem specific
        const lastBlock = await this.thorClient.gas.getFeeHistory(1);
        const lastBaseFeePerGas = lastBlock.baseFeePerGas;
        return lastBaseFeePerGas;
    }

    /**
     * Estimates the fee per gas for the next block.
     *
     * @returns {Promise<bigint>} The estimated base fee per gas.
     * @throws {BlockNotFoundError} If the latest block is not found.
     */
    public async estimateFeePerGas(): Promise<bigint> {
        const lastRevision = await this.thorClient.blocks.getBlock(
            Revision.BEST
        );

        if (lastRevision?.baseFeePerGas === undefined) {
            throw new BlockNotFoundError({ blockNumber: undefined });
        }

        const lastBaseFeePerGas: bigint = lastRevision.baseFeePerGas;
        return lastBaseFeePerGas;
    }

    /**
     * Estimates the gas required for transaction clauses.
     *
     * @param {Clause[]} clauses - The clauses to estimate gas for.
     * @param {Address} caller - The address calling the transaction.
     * @param {EstimateGasOptions} options - Estimation options.
     * @returns {Promise<EstimateGasResult>} The gas estimation result.
     */
    public async estimateGas(
        clauses: Clause[],
        caller: Address,
        options?: EstimateGasOptions
    ): Promise<EstimateGasResult> {
        const gasModule = this.thorClient.gas;
        const gas = await gasModule.estimateGas(clauses, caller, options);
        return gas;
    }

    /**
     * Suggests a priority fee for transaction inclusion.
     *
     * @returns {Promise<bigint>} The suggested priority fee.
     */
    public async suggestPriorityFeeRequest(): Promise<bigint> {
        // viem specific
        const thorClient = ThorClient.at(this.httpClient);
        const gasModule = thorClient.gas;
        const gas = await gasModule.getSuggestedMaxPriorityFeePerGas();
        return gas;
    }

    /**
     * Gets the chain ID from the genesis block.
     *
     * @returns {Promise<bigint>} The chain ID.
     * @throws {ChainNotFoundError} If the genesis block is not found.
     */
    public async getChainId(): Promise<bigint> {
        const data = await this.thorClient.blocks.getBlock(Revision.of(0));
        const res = data?.id;
        if (res == null) {
            throw new ChainNotFoundError();
        }
        return res.bi;
    }

    /**
     * Gets a transaction by its hash.
     *
     * @param {Hex} hash - The transaction hash.
     * @returns {Promise<Transaction>} The transaction.
     * @throws {TransactionNotFoundError} If the transaction doesn't exist.
     */
    public async getTransaction(hash: Hex): Promise<Transaction> {
        try {
            const data =
                await this.thorClient.transactions.getTransaction(hash);

            if (data === null) {
                throw new TransactionNotFoundError({
                    hash: hash.toString() as `0x${string}`
                });
            }

            return data;
        } catch (error) {
            log.error({
                message: `Failed to get transaction for hash ${hash.toString()}`,
                source: 'PublicClient.getTransaction',
                context: {
                    error:
                        error instanceof Error ? error.message : String(error),
                    hash: hash.toString()
                }
            });
            throw error;
        }
    }

    /**
     * Gets the bytecode of a contract.
     *
     * @param {Address} address - The contract address.
     * @returns {Promise<Hex>} The contract bytecode.
     */
    public async getBytecode(address: Address): Promise<Hex> {
        try {
            const data = await this.thorClient.accounts.getBytecode(address);
            return data;
        } catch (error) {
            log.error({
                message: `Failed to get bytecode for address ${address.toString()}`,
                source: 'PublicClient.getBytecode',
                context: {
                    error:
                        error instanceof Error ? error.message : String(error),
                    address: address.toString()
                }
            });
            throw error;
        }
    }

    /**
     * Gets the code of a contract (alias for getBytecode).
     *
     * @param {Address} address - The contract address.
     * @returns {Promise<Hex>} The contract code.
     */
    public async getCode(address: Address): Promise<Hex> {
        return await this.getBytecode(address);
    }

    /**
     * Gets the storage value at a specific slot for a contract.
     *
     * @param {Address} address - The contract address.
     * @param {Hex} slot - The storage slot.
     * @returns {Promise<Hex>} The storage value (32 bytes).
     */
    public async getStorageAt(address: Address, slot: Hex): Promise<Hex> {
        try {
            const data = await this.thorClient.accounts.getStorageAt(
                address,
                slot
            );
            // If no value exists, return 32 bytes of zeros (EVM default)
            return data ?? Hex.of(`0x${'00'.repeat(32)}`);
        } catch (error) {
            log.error({
                message: `Failed to get storage at ${slot.toString()} for address ${address.toString()}`,
                source: 'PublicClient.getStorageAt',
                context: {
                    error:
                        error instanceof Error ? error.message : String(error),
                    address: address.toString(),
                    slot: slot.toString()
                }
            });
            throw error;
        }
    }

    /**
     * Gets the transaction count for an address.
     *
     * **Important:** VeChain handles transaction nonces differently from Ethereum.
     *
     * In Ethereum, the transaction count represents the number of transactions sent from an address
     * and is used as a sequential nonce. In VeChain:
     * - Transaction nonces are user-defined 64-bit unsigned integers
     * - Nonces are primarily used for replay protection, not sequential ordering
     * - Accounts do not maintain a sequential transaction counter
     * - Users can choose any nonce value for their transactions
     *
     * Therefore, this method always returns 0 for VeChain addresses, as there is no
     * equivalent sequential transaction count concept.
     *
     * For transaction uniqueness and replay protection in VeChain, use the transaction's
     * `nonce` field when building transactions via {@link TransactionBuilder.withNonce}.
     *
     * @param {Address} address - The address to get the transaction count for.
     * @returns {Promise<number>} Always returns 0 for VeChain addresses.
     * @throws {InvalidAddressError} If the address is invalid or account doesn't exist.
     *
     * @see {@link https://docs.vechain.org/core-concepts/transactions/transaction-model | VeChain Transaction Model}
     */
    public async getTransactionCount(address: Address): Promise<number> {
        try {
            // Validate that the address exists by fetching account details
            const accountDetails =
                await this.thorClient.accounts.getAccount(address);
            if (accountDetails === null) {
                throw new InvalidAddressError({ address: address.toString() });
            }
            // VeChain does not track sequential transaction counts per account.
            // Nonces in VeChain are user-defined values used for replay protection,
            // not sequential counters like in Ethereum.
            return 0;
        } catch (error) {
            // Log the error
            log.error({
                message: `Failed to get transaction count for address ${address.toString()}`,
                source: 'PublicClient.getTransactionCount',
                context: {
                    error:
                        error instanceof Error ? error.message : String(error),
                    address: address.toString()
                }
            });
            throw error;
        }
    }

    /**
     * Gets the nonce for an address.
     *
     * This is an alias for {@link getTransactionCount} to maintain viem compatibility.
     *
     * **Note:** In VeChain, nonces are user-defined and not sequential like Ethereum.
     * See {@link getTransactionCount} for more details on VeChain's nonce handling.
     *
     * @param {Address} address - The address to get the nonce for.
     * @returns {Promise<number>} Always returns 0 for VeChain addresses.
     * @throws {InvalidAddressError} If the address is invalid or account doesn't exist.
     */
    public async getNonce(address: Address): Promise<number> {
        return await this.getTransactionCount(address);
    }

    /**
     * Closes a subscription/filter.
     *
     * @param {BeatsSubscription | BlocksSubscription | EventsSubscription | NewTransactionSubscription | TransfersSubscription} subscription - The subscription to close.
     */
    public uninstallFilter(
        subscription:
            | BeatsSubscription
            | BlocksSubscription
            | EventsSubscription
            | NewTransactionSubscription
            | TransfersSubscription
    ): void {
        subscription.close();
    }

    /**
     * Watches for contract events matching the specified criteria.
     *
     * @param {object} params - Event watch parameters.
     * @param {Function} params.onLogs - Callback for new logs.
     * @param {Function} params.onError - Error callback (optional).
     * @param {Address} params.address - Contract address filter (optional).
     * @param {Hex} params.event - Event signature (topic 0) (optional).
     * @param {Hex[]} params.args - Indexed parameters (topics 1-3) (optional).
     * @param {Hex} params.fromBlock - Starting block position (optional).
     * @returns {Function} Unsubscribe function.
     */
    public watchEvent(params: {
        onLogs: (logs: SubscriptionEventResponse[]) => void;
        onError?: (error: Error) => void;
        address?: Address;
        event?: Hex; // t0 - event signature
        args?: Hex[]; // t1, t2, t3 - indexed parameters
        fromBlock?: Hex; // pos - starting block position
    }): () => void {
        const { onLogs, onError, address, event, args, fromBlock } = params;

        // Create WebSocket client
        const webSocketClient = new MozillaWebSocketClient(
            `ws://${this.httpClient.baseURL.host}`
        );

        // Create subscription
        let subscription = EventsSubscription.at(webSocketClient);

        // Apply filters if provided
        if (address !== undefined) {
            subscription = subscription.withContractAddress(address);
        }

        if (fromBlock !== undefined) {
            subscription = subscription.atPos(fromBlock);
        }

        if (event !== undefined || (args !== undefined && args.length > 0)) {
            subscription = subscription.withFilters(
                event, // t0 - event signature
                args?.[0], // t1 - first indexed param
                args?.[1], // t2 - second indexed param
                args?.[2] // t3 - third indexed param
            );
        }

        // Create listener to map onMessage to onLogs
        const listener: WebSocketListener<SubscriptionEventResponse> = {
            onMessage: (event: MessageEvent<SubscriptionEventResponse>) => {
                if (event.data !== undefined) {
                    // Map onMessage to onLogs by wrapping the response in an array
                    // as viem's API expects an array of logs
                    onLogs([event.data]);
                }
            },
            onError: (event: Event) => {
                if (onError !== undefined && event instanceof Error) {
                    onError(event);
                } else if (onError !== undefined) {
                    log.error({
                        message: 'Unknown WebSocket error',
                        source: 'PublicClient.watchEvent',
                        context: {
                            error: event,
                            url: `ws://${this.httpClient.baseURL.host}`
                        }
                    });
                    onError(
                        new WebSocketRequestError({
                            url: `ws://${this.httpClient.baseURL.host}`,
                            cause: new Error('Unknown WebSocket error'),
                            details: 'WebSocket connection error occurred',
                            body: { error: event }
                        })
                    );
                }
            },
            onClose: () => {},
            onOpen: () => {}
        };

        // Add listener and open connection
        subscription.addListener(listener).open();

        // Return unsubscribe function
        return () => {
            this.uninstallFilter(subscription);
        };
    }

    /**
     * Gets historical event logs matching a filter.
     *
     * @param {EventFilter} eventFilter - The event filter.
     * @returns {Promise<DecodedEventLog[]>} The decoded event logs.
     */
    public async getLogs(eventFilter: EventFilter): Promise<DecodedEventLog[]> {
        try {
            return await this.thorClient.logs.filterEventLogs(
                eventFilter.filter,
                eventFilter.eventAbis
            );
        } catch (error) {
            // Log the error
            log.error({
                message: 'Failed to get logs',
                source: 'PublicClient.getLogs',
                context: {
                    error:
                        error instanceof Error ? error.message : String(error),
                    filterId: eventFilter.id
                }
            });
            throw error;
        }
    }

    /**
     * Creates a filter for querying event logs.
     *
     * @param {object} params - Filter parameters (optional).
     * @param {Address | Address[]} params.address - Contract address(es) (optional).
     * @param {AbiEvent} params.event - Event ABI definition (optional).
     * @param {Hex[]} params.args - Indexed event arguments (optional).
     * @param {bigint} params.fromBlock - Starting block (optional).
     * @param {bigint} params.toBlock - Ending block (optional).
     * @returns {EventFilter} The event filter.
     */
    public createEventFilter(params?: {
        address?: Address | Address[];
        event?: AbiEvent;
        args?: Hex[];
        fromBlock?: bigint;
        toBlock?: bigint;
    }): EventFilter {
        const { address, event, args, fromBlock, toBlock } = params ?? {};

        // Create a unique ID for this filter using timestamp to avoid Math.random security issues
        const filterId = `0x${(Date.now() % 0xffffffff)
            .toString(16)
            .padStart(8, '0')}`;

        // create the EventLogFilter
        const filterRange = new FilterRange(
            FilterRangeUnits.block,
            Number(fromBlock),
            Number(toBlock)
        );

        // create topics from args
        const topic0 =
            event != null ? Hex.of(toEventSelector(event)) : undefined;
        const topics: Array<Hex | undefined> = [
            topic0,
            args?.[0],
            args?.[1],
            args?.[2]
        ];

        // filterOptions is needed by Thor but not used by viem
        const filterOptions = new FilterOptions();
        // create an EventCriteria for each address
        const criteriaSet: EventCriteria[] = [];
        if (address instanceof Address) {
            // user specified a single address
            const eventCriteria = new EventCriteria(address, ...topics);
            criteriaSet.push(eventCriteria);
        } else if (Array.isArray(address)) {
            address.forEach((addr) => {
                const eventCriteria = new EventCriteria(addr, ...topics);
                criteriaSet.push(eventCriteria);
            });
        }
        // create the EventLogFilter
        const eventFilter = new EventLogFilter(
            filterRange,
            filterOptions,
            criteriaSet,
            null
        );
        // Create final event filter
        const filter: EventFilter = {
            id: filterId,
            type: 'event',
            filter: eventFilter,
            eventAbis: event != null ? [event] : []
        };

        return filter;
    }

    /**
     * Gets logs for a specific filter.
     *
     * @param {object} params - Parameters object.
     * @param {Filter} params.filter - The filter to query.
     * @returns {Promise<DecodedEventLog[]>} The decoded event logs.
     * @throws {FilterTypeNotSupportedError} If the filter type is not 'event'.
     */
    public async getFilterLogs(params: {
        filter: Filter;
    }): Promise<DecodedEventLog[]> {
        try {
            const { filter } = params;
            if (filter.type !== 'event') {
                throw new FilterTypeNotSupportedError(
                    (filter as { type: string }).type
                );
            }
            return await this.thorClient.logs.filterEventLogs(
                filter.filter,
                filter.eventAbis
            );
        } catch (error) {
            // Log the error
            log.error({
                message: 'Failed to get filter logs',
                source: 'PublicClient.getFilterLogs',
                context: {
                    error:
                        error instanceof Error ? error.message : String(error),
                    filter: params.filter
                }
            });
            throw error;
        }
    }

    /**
     * Creates a filter for watching new blocks.
     *
     * @returns {Promise<BlockFilter>} The block filter.
     */
    public async createBlockFilter(): Promise<BlockFilter> {
        // Create a unique ID for this filter using timestamp to avoid Math.random security issues
        const filterId = `0x${(Date.now() % 0xffffffff)
            .toString(16)
            .padStart(8, '0')}`;

        // Get the current block number to track which blocks have been seen
        const currentBlock = await this.getBlockNumber();

        // Create and return the filter
        const filter: BlockFilter = {
            id: filterId,
            type: 'block',
            lastBlockProcessed: currentBlock ?? 0
        };

        return filter;
    }

    /**
     * Creates a filter for watching pending transactions.
     *
     * @returns {PendingTransactionFilter} The pending transaction filter.
     */
    public createPendingTransactionFilter(): PendingTransactionFilter {
        // Create a unique ID for this filter using timestamp to avoid Math.random security issues
        const filterId = `0x${(Date.now() % 0xffffffff)
            .toString(16)
            .padStart(8, '0')}`;

        // Create and return the filter
        const filter: PendingTransactionFilter = {
            id: filterId,
            type: 'transaction',
            processedTxIds: new Set<string>()
        };

        return filter;
    }

    /**
     * Waits for a transaction to be mined and returns its receipt.
     *
     * @param {Hex} hex - The transaction hash.
     * @param {number} timeout - Timeout in milliseconds (optional).
     * @returns {Promise<TransactionReceipt | null>} The transaction receipt.
     * @throws {WaitForTransactionReceiptTimeoutError} If the wait times out.
     */
    public async waitForTransactionReceipt(
        hex: Hex,
        timeout?: number
    ): Promise<TransactionReceipt | null> {
        try {
            const transactionModule = this.thorClient.transactions;
            const receipt = await transactionModule.waitForTransactionReceipt(
                hex,
                {
                    timeoutMs: timeout
                }
            );
            return receipt;
        } catch (error) {
            // Convert thor-client TimeoutError to viem WaitForTransactionReceiptTimeoutError
            if (error instanceof ThorTimeoutError) {
                throw new WaitForTransactionReceiptTimeoutError({
                    hash: hex.toString() as `0x${string}`
                });
            }
            // Convert IllegalArgumentError
            if (error instanceof IllegalArgumentError) {
                log.error({
                    message: `Invalid arguments: ${error.message}`,
                    source: 'PublicClient.waitForTransactionReceipt',
                    context: {
                        error: error.message,
                        hash: hex.toString()
                    }
                });
                throw error;
            }
            // Log the error
            log.error({
                message: 'Failed to wait for transaction receipt',
                source: 'PublicClient.waitForTransactionReceipt',
                context: {
                    error:
                        error instanceof Error ? error.message : String(error),
                    hash: hex.toString()
                }
            });
            throw error;
        }
    }

    /**
     * Gets the receipt for a mined transaction.
     *
     * @param {Hex} hash - The transaction hash.
     * @returns {Promise<TransactionReceipt | null>} The transaction receipt.
     * @throws {TransactionReceiptNotFoundError} If the receipt doesn't exist.
     */
    public async getTransactionReceipt(
        hash: Hex
    ): Promise<TransactionReceipt | null> {
        try {
            const data =
                await this.thorClient.transactions.getTransactionReceipt(hash);
            if (data === null) {
                throw new TransactionReceiptNotFoundError({
                    hash: hash.toString() as `0x${string}`
                });
            }
            return data;
        } catch (error) {
            // Log the error
            log.error({
                message: `Failed to get transaction receipt for hash ${hash.toString()}`,
                source: 'PublicClient.getTransactionReceipt',
                context: {
                    error:
                        error instanceof Error ? error.message : String(error),
                    hash: hash.toString()
                }
            });
            throw error;
        }
    }

    /**
     * Gets new items for a filter since the last query.
     *
     * @param {object} params - Parameters object.
     * @param {Filter} params.filter - The filter to query.
     * @returns {Promise<Array<DecodedEventLog | string>>} New logs or block hashes.
     * @throws {FilterTypeNotSupportedError} If the filter type is unsupported.
     */
    public async getFilterChanges(params: {
        filter: Filter;
    }): Promise<Array<DecodedEventLog | string>> {
        const { filter } = params;

        // For event filters, we just delegate to getLogs
        if (filter.type === 'event') {
            return await this.getFilterLogs({ filter });
        }

        // For block filters, we get new blocks since the last processed block
        else if (filter.type === 'block') {
            const blockFilter = filter;
            const lastProcessed = blockFilter.lastBlockProcessed;

            // Get the current block number
            const currentBlock = await this.getBlockNumber();

            if (
                lastProcessed === undefined ||
                currentBlock === undefined ||
                lastProcessed >= currentBlock
            ) {
                return [];
            }

            // Get block hashes for all new blocks
            const blockHashes: string[] = [];

            // Get all blocks from lastProcessed+1 to currentBlock
            for (
                let blockNum = lastProcessed + 1;
                blockNum <= currentBlock;
                blockNum++
            ) {
                const block = await this.getBlock(Revision.of(blockNum));
                if (
                    block !== null &&
                    block !== undefined &&
                    'id' in block &&
                    block.id !== undefined
                ) {
                    blockHashes.push(String(block.id));
                }
            }

            // Update the last processed block
            blockFilter.lastBlockProcessed = currentBlock;

            return blockHashes;
        }
        // For pending transaction filters, we subscribe to new transactions if not already subscribed
        else if (filter.type === 'transaction') {
            const txFilter = filter as PendingTransactionFilter & {
                subscription?: NewTransactionSubscription;
                txQueue?: string[];
            };

            if (txFilter.subscription == null) {
                const webSocketClient = new MozillaWebSocketClient(
                    `ws://${this.httpClient.baseURL.host}`
                );

                const subscription =
                    NewTransactionSubscription.at(webSocketClient).open();

                txFilter.txQueue = [];

                const listener: WebSocketListener<TXID> = {
                    onMessage: (event: MessageEvent<TXID>) => {
                        const { data } = event;
                        // Extract the transaction hash from TXID
                        const txHash = data.id.toString();

                        if (txHash != null) {
                            if (txFilter.txQueue == null) {
                                txFilter.txQueue = [];
                            }
                            txFilter.txQueue.push(txHash);
                        }
                    },
                    onOpen: () => {},
                    onClose: () => {},
                    onError: () => {}
                };

                subscription.addListener(listener);
                txFilter.subscription = subscription;

                return [];
            }

            const txs = txFilter.txQueue ?? [];
            txFilter.txQueue = [];
            return txs;
        }

        throw new FilterTypeNotSupportedError(
            (filter as { type: string }).type
        );
    }
}

export {
    PublicClient,
    type PublicClientConfig,
    createPublicClient,
    BlockReponseType
};
