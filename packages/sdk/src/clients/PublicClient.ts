import { type Address, type Hex, Revision } from '@vcdm';
import { type HttpClient, FetchHttpClient } from '@http';
import {
    type BeatsSubscription,
    BlocksSubscription,
    type EventLogResponse,
    EventsSubscription,
    type ExecuteCodesResponse,
    type ExpandedBlockResponse,
    type GetFeesHistoryResponse,
    type GetFeesPriorityResponse,
    InspectClauses,
    NewTransactionSubscription,
    QuerySmartContractEvents,
    type RawTx,
    type RegularBlockResponse,
    RetrieveAccountDetails,
    RetrieveContractBytecode,
    RetrieveExpandedBlock,
    RetrieveHistoricalFeeData,
    RetrieveRawBlock,
    RetrieveRegularBlock,
    RetrieveStoragePositionValue,
    RetrieveTransactionByID,
    RetrieveTransactionReceipt,
    type SubscriptionEventResponse,
    SuggestPriorityFee,
    type ThorNetworks,
    type GetTxResponse,
    type GetTxReceiptResponse,
    type TransfersSubscription,
    type TXID
} from '@thor';
import {
    BlockNotFoundError,
    TransactionNotFoundError,
    TransactionReceiptNotFoundError,
    InvalidAddressError,
    ChainNotFoundError,
    FilterTypeNotSupportedError,
    WebSocketRequestError,
    BaseError
} from 'viem';
import { type ExecuteCodesRequestJSON } from '@json';
import { type EventLogFilterRequestJSON } from '@thor/logs/json';
import { MozillaWebSocketClient, type WebSocketListener } from '@ws';
import {
    handleAddressFilter,
    handleEventArgs,
    prepareBlockRange
} from '@utils/filter-utils';

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
    /** The filter request to be used with QuerySmartContractEvents */
    request: EventLogFilterRequestJSON;
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

    constructor(network: URL | ThorNetworks, transport: HttpClient) {
        this.network = network;
        this.httpClient = transport;
    }

    public async getBalance(address: Address): Promise<bigint> {
        const accountDetails = await RetrieveAccountDetails.of(address).askTo(
            this.httpClient
        );
        if (accountDetails?.response === null) {
            throw new InvalidAddressError({ address: address.toString() });
        }
        const balance = accountDetails.response.balance;
        return balance;
    }

    public async getBlock(
        revision: BlockRevision = 'best', // viem specific
        type: BlockReponseType = BlockReponseType.regular // vechain specific
    ): Promise<ExpandedBlockResponse | RawTx | RegularBlockResponse | null> {
        const blockNumber =
            typeof revision === 'number'
                ? BigInt(revision)
                : typeof revision === 'string' && /^\d+$/.test(revision)
                  ? BigInt(revision)
                  : undefined;

        if (type === BlockReponseType.expanded) {
            const data = await RetrieveExpandedBlock.of(
                Revision.of(revision)
            ).askTo(this.httpClient);
            if (data.response === null) {
                throw new BlockNotFoundError({ blockNumber });
            }
            return data.response;
        } else if (type === BlockReponseType.raw) {
            const data = await RetrieveRawBlock.of(Revision.of(revision)).askTo(
                this.httpClient
            );
            if (data.response === null) {
                throw new BlockNotFoundError({ blockNumber });
            }
            return data.response;
        } else {
            const data = await RetrieveRegularBlock.of(
                Revision.of(revision)
            ).askTo(this.httpClient);
            if (data.response === null) {
                throw new BlockNotFoundError({ blockNumber });
            }
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
        if (blockNumber === null) {
            const notFoundRevision =
                typeof revision === 'number'
                    ? BigInt(revision)
                    : typeof revision === 'string' && /^\d+$/.test(revision)
                      ? BigInt(revision)
                      : undefined;
            throw new BlockNotFoundError({ blockNumber: notFoundRevision });
        }
        return blockNumber;
    }

    public async getBlockTransactionCount(
        revision: BlockRevision = 'best' // viem specific
    ): Promise<number | undefined> {
        const selectedBlock = await RetrieveRegularBlock.of(
            Revision.of(revision)
        ).askTo(this.httpClient);
        const trxCount = selectedBlock?.response?.transactions.length;
        if (trxCount === null) {
            const notFoundRevision =
                typeof revision === 'number'
                    ? BigInt(revision)
                    : typeof revision === 'string' && /^\d+$/.test(revision)
                      ? BigInt(revision)
                      : undefined;
            throw new BlockNotFoundError({ blockNumber: notFoundRevision });
        }
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
            throw new ChainNotFoundError();
        }
        return res.bi;
    }

    public async getTransaction(hash: Hex): Promise<GetTxResponse | null> {
        const data = await RetrieveTransactionByID.of(hash).askTo(
            this.httpClient
        );
        if (data.response === null) {
            throw new TransactionNotFoundError({
                hash: hash.toString() as `0x${string}`
            });
        }
        return data.response;
    }

    public async getTransactionReceipt(
        hash: Hex
    ): Promise<GetTxReceiptResponse | null> {
        const data = await RetrieveTransactionReceipt.of(hash).askTo(
            this.httpClient
        );
        if (data.response === null) {
            throw new TransactionReceiptNotFoundError({
                hash: hash.toString() as `0x${string}`
            });
        }
        return data.response;
    }

    public async getBytecode(address: Address): Promise<Hex | undefined> {
        const data = await RetrieveContractBytecode.of(address).askTo(
            this.httpClient
        );
        return data.response?.code;
    }

    public async getCode(address: Address): Promise<Hex | undefined> {
        // getCode is essentially the same as getBytecode in VeChain
        const code = await this.getBytecode(address);
        return code;
    }

    public async getStorageAt(address: Address, slot: Hex): Promise<Hex> {
        const data = await RetrieveStoragePositionValue.of(address, slot).askTo(
            this.httpClient
        );
        return data.response?.value ?? '0x0';
    }

    public async getTransactionCount(address: Address): Promise<number> {
        // In VeChain, transaction count is equivalent to account nonce?
        const accountDetails = await RetrieveAccountDetails.of(address).askTo(
            this.httpClient
        );
        if (accountDetails?.response === null) {
            throw new InvalidAddressError({ address: address.toString() });
        }
        // VeChain accounts don't have a txCount field, but we can simulate it
        // For now, return 0 as VeChain handles nonces differently
        return 0;
    }

    public async getNonce(address: Address): Promise<number> {
        // getNonce is the same as getTransactionCount in viem
        const trxCount = await this.getTransactionCount(address);
        return trxCount;
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
                    onError(
                        new WebSocketRequestError({
                            url: `ws://${this.httpClient.baseURL.host}`,
                            cause: new BaseError('Unknown WebSocket error'),
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

    public async getLogs(params: {
        address?: Address | Address[];
        topics?: Array<Hex | null>;
        fromBlock?: BlockRevision;
        toBlock?: BlockRevision;
    }): Promise<EventLogResponse[]> {
        const { address, topics, fromBlock, toBlock } = params;

        // Prepare filter criteria
        const criteria: Record<string, string> = {};

        // Handle address (single or array)
        const addressFilter = handleAddressFilter(address);
        if (addressFilter != null) {
            criteria.address = addressFilter;
        }

        // Handle topics (map to VeChain's topic0, topic1, etc.)
        if (topics !== undefined && topics.length > 0) {
            // Map topics to VeChain topic format (topic0, topic1, etc.)
            topics.forEach((topic, index) => {
                if (topic !== null) {
                    const topicKey = `topic${index}`;
                    criteria[topicKey] = String(topic);
                }
            });
        }

        const range = prepareBlockRange(fromBlock, toBlock);

        // Construct the filter request
        const request: EventLogFilterRequestJSON = {
            criteriaSet: [criteria]
        };

        // Add range if specified
        if (Object.keys(range).length > 0) {
            request.range = range;
        }

        // Query for logs
        const response = await QuerySmartContractEvents.of(request).askTo(
            this.httpClient
        );

        return response.response;
    }

    public createEventFilter(params?: {
        address?: Address | Address[];
        event?: Hex;
        args?: Hex[];
        fromBlock?: BlockRevision;
        toBlock?: BlockRevision;
    }): EventFilter {
        const { address, event, args, fromBlock, toBlock } = params ?? {};

        // Create a unique ID for this filter using timestamp to avoid Math.random security issues
        const filterId = `0x${(Date.now() % 0xffffffff).toString(16).padStart(8, '0')}`;

        // Prepare filter criteria
        const criteria: Record<string, string> = {};

        // Handle address (single or array)
        const addressFilter = handleAddressFilter(address);
        if (addressFilter != null) {
            criteria.address = addressFilter;
        }

        // Handle event signature (topic0)
        if (event !== undefined) {
            criteria.topic0 = String(event);
        }

        // Handle indexed parameters (topic1, topic2, topic3)
        const topicValues = handleEventArgs(args);
        Object.assign(criteria, topicValues);

        // Prepare range filter if fromBlock or toBlock is provided
        const range = prepareBlockRange(fromBlock, toBlock);

        // Construct the filter request
        const filterRequest: EventLogFilterRequestJSON = {
            criteriaSet: [criteria]
        };

        // Add range if specified
        if (Object.keys(range).length > 0) {
            filterRequest.range = range;
        }

        // Store the filter so it can be used later by getFilterLogs
        const filter: EventFilter = {
            id: filterId,
            type: 'event',
            request: filterRequest
        };

        return filter;
    }

    public async getFilterLogs(params: {
        filter: Filter;
    }): Promise<EventLogResponse[]> {
        const { filter } = params;

        if (filter.type !== 'event') {
            throw new FilterTypeNotSupportedError(
                (filter as { type: string }).type
            );
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
    }): Promise<Array<EventLogResponse | string>> {
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
