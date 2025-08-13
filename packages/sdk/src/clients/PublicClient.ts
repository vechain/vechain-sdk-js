import {
    Address,
    type BeatsSubscription,
    BlocksSubscription,
    EventsSubscription,
    type ExecuteCodesResponse,
    type ExpandedBlockResponse,
    FetchHttpClient,
    type GetFeesHistoryResponse,
    type GetFeesPriorityResponse,
    Hex,
    type HttpClient,
    InspectClauses,
    NewTransactionSubscription,
    QuerySmartContractEvents,
    type RawTx,
    type RegularBlockResponse,
    RetrieveExpandedBlock,
    RetrieveHistoricalFeeData,
    RetrieveRawBlock,
    RetrieveRegularBlock,
    Revision,
    type SubscriptionEventResponse,
    SuggestPriorityFee,
    type ThorNetworks,
    type TransfersSubscription,
    type TXID
} from '@index';
import { type ExecuteCodesRequestJSON } from '@json';
import { MozillaWebSocketClient, type WebSocketListener } from '@ws';
import { ThorClient } from '@thor/thor-client/ThorClient';
import { type EventLog } from '@thor/thor-client/model/logs/EventLog';
import { EventLogFilter } from '@thor/thor-client/model/logs/EventLogFilter';
import { type DecodedEventLog } from '@thor/thor-client/model/logs/DecodedEventLog';
import { FilterRange } from '@thor/thor-client/model/logs/FilterRange';
import { FilterRangeUnits } from '@thor/thor-client/model/logs/FilterRangeUnits';
import { FilterOptions } from '@thor/thor-client/model/logs/FilterOptions';
import { EventCriteria } from '@thor/thor-client/model/logs/EventCriteria';
import { type AbiEvent, toEventSelector } from 'viem';

/**
 * Filter types for viem compatibility.
 */
type Filter = EventFilter | BlockFilter | PendingTransactionFilter;

interface PendingTransactionFilter {
    type: 'transaction';
    subscription?: NewTransactionSubscription;
    txQueue?: string[];
}

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

// TO DO: remove string and add harcoded revision values

// Revision type for viem
type BlockRevision = bigint | number | string | Uint8Array | Hex;

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

    public async getBalance(address: Address): Promise<bigint> {
        const accountDetails =
            await this.thorClient.accounts.getAccount(address);
        const balance = accountDetails.balance;
        return balance;
    }

    public async getBlock(
        revision: BlockRevision = 'best', // viem specific
        type: BlockReponseType = BlockReponseType.regular // vechain specific
    ): Promise<ExpandedBlockResponse | RawTx | RegularBlockResponse | null> {
        if (type === BlockReponseType.expanded) {
            const data = await RetrieveExpandedBlock.of(
                Revision.of(revision)
            ).askTo(this.httpClient);
            return data.response;
        } else if (type === BlockReponseType.raw) {
            const data = await RetrieveRawBlock.of(Revision.of(revision)).askTo(
                this.httpClient
            );
            return data.response;
        } else {
            const data = await RetrieveRegularBlock.of(
                Revision.of(revision)
            ).askTo(this.httpClient);
            return data.response;
        }
    }

    public async getBlockNumber(
        revision: BlockRevision = 'best' // viem specific
    ): Promise<number | undefined> {
        const selectedBlock = await RetrieveRegularBlock.of(
            Revision.of(revision)
        ).askTo(this.httpClient);
        const blockNumber = selectedBlock?.response?.number;
        return blockNumber;
    }

    public async getBlockTransactionCount(
        revision: BlockRevision = 'best' // viem specific
    ): Promise<number | undefined> {
        const selectedBlock = await RetrieveRegularBlock.of(
            Revision.of(revision)
        ).askTo(this.httpClient);
        const trxCount = selectedBlock?.response?.transactions.length;

        return trxCount;
    }

    public watchBlocks(pos: Hex): BlocksSubscription {
        return BlocksSubscription.at(
            new MozillaWebSocketClient(`ws://${this.httpClient.baseURL.host}`)
        ).atPos(pos);
    }

    public watchBlockNumber(): BlocksSubscription {
        return BlocksSubscription.at(
            new MozillaWebSocketClient(`ws://${this.httpClient.baseURL.host}`)
        );
    }

    public async simulateCalls(
        request: ExecuteCodesRequestJSON
    ): Promise<ExecuteCodesResponse> {
        // this and call are the same because ETH doesn't support multi-call and they have explicit functions for this.
        // viem specific
        const inspectClause = await InspectClauses.of(request).askTo(
            this.httpClient
        );
        const clause = inspectClause.response;
        return clause;
    }

    // eslint-disable-next-line sonarjs/no-identical-functions
    public async call(
        request: ExecuteCodesRequestJSON
    ): Promise<ExecuteCodesResponse> {
        // viem specific
        const inspectClause = await InspectClauses.of(request).askTo(
            this.httpClient
        );
        const clause = inspectClause.response;
        return clause;
    }

    public async getFeeHistory(
        blockCount: number
    ): Promise<GetFeesHistoryResponse> {
        // viem specific
        const data = await RetrieveHistoricalFeeData.of(blockCount).askTo(
            this.httpClient
        );
        return data.response;
    }

    public async getGasPrice(): Promise<bigint[]> {
        // viem specific
        const lastBlock = await RetrieveHistoricalFeeData.of(1).askTo(
            this.httpClient
        );
        const lastBaseFeePerGas = lastBlock.response.baseFeePerGas;
        return lastBaseFeePerGas;
    }

    public async estimateFeePerGas(): Promise<bigint | undefined> {
        // viem specific
        const lastRevision = await RetrieveRegularBlock.of(Revision.BEST).askTo(
            this.httpClient
        );
        const lastBaseFeePerGas = lastRevision?.response?.baseFeePerGas;
        return lastBaseFeePerGas;
    }

    public async estimateGas(
        request: ExecuteCodesRequestJSON
    ): Promise<ExecuteCodesResponse> {
        // viem specific
        const inspectClause = await InspectClauses.of(request).askTo(
            this.httpClient
        );
        const gasUsedArray = inspectClause.response;
        return gasUsedArray;
    }

    public async estimateMaxPriorityFeePerGas(): Promise<GetFeesPriorityResponse> {
        // viem specific
        const data = await SuggestPriorityFee.of().askTo(this.httpClient);
        return data.response;
    }

    public async getChainId(): Promise<bigint> {
        const data = await RetrieveRegularBlock.of(Revision.of(0)).askTo(
            this.httpClient
        );
        const res = data?.response?.id;
        if (res == null) {
            throw new Error('Chain ID could not be retrieved');
        }
        return res.bi;
    }

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
                    onError(new Error('Unknown WebSocket error'));
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

    public async getLogs(eventFilter: EventFilter): Promise<DecodedEventLog[]> {
        return await this.thorClient.logs.filterEventLogs(
            eventFilter.filter,
            eventFilter.eventAbis
        );
    }

    public createEventFilter(params?: {
        address?: Address | Address[];
        event?: AbiEvent;
        args?: Hex[];
        fromBlock?: bigint;
        toBlock?: bigint;
    }): EventFilter {
        const { address, event, args, fromBlock, toBlock } = params ?? {};

        // Create a unique ID for this filter using timestamp to avoid Math.random security issues
        const filterId = `0x${(Date.now() % 0xffffffff).toString(16).padStart(8, '0')}`;

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

    public async getFilterLogs(params: {
        filter: Filter;
    }): Promise<EventLog[]> {
        const { filter } = params;

        if (filter.type !== 'event') {
            throw new Error('Invalid filter type. Expected "event" filter.');
        }

        // Use the stored filter request to query for logs
        const response = await QuerySmartContractEvents.of(
            filter.request
        ).askTo(this.httpClient);

        return response.response;
    }

    public async createBlockFilter(): Promise<BlockFilter> {
        // Create a unique ID for this filter using timestamp to avoid Math.random security issues
        const filterId = `0x${(Date.now() % 0xffffffff).toString(16).padStart(8, '0')}`;

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

    public createPendingTransactionFilter(): PendingTransactionFilter {
        // Create a unique ID for this filter using timestamp to avoid Math.random security issues
        const filterId = `0x${(Date.now() % 0xffffffff).toString(16).padStart(8, '0')}`;

        // Create and return the filter
        const filter: PendingTransactionFilter = {
            id: filterId,
            type: 'transaction',
            processedTxIds: new Set<string>()
        };

        return filter;
    }

    public async getFilterChanges(params: {
        filter: Filter;
    }): Promise<Array<EventLog | string>> {
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
                const block = await this.getBlock(blockNum);
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
                        const data = event.data;
                        let txHash: string | undefined;

                        if (typeof data === 'string') {
                            txHash = data;
                        } else if (Buffer.isBuffer(data)) {
                            txHash = data.toString('hex'); // Convert Buffer to hex string
                        }

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

        throw new Error(
            `Unknown filter type: ${(filter as { type: string }).type}`
        );
    }
}

export {
    PublicClient,
    type PublicClientConfig,
    createPublicClient,
    BlockReponseType
};
