import {
    type Address,
    type BlockId,
    type BeatsSubscription,
    BlocksSubscription,
    type ExecuteCodesResponse,
    type ExpandedBlockResponse,
    EventsSubscription,
    FetchHttpClient,
    type GetFeesHistoryResponse,
    type GetFeesPriorityResponse,
    type Hex,
    InspectClauses,
    NewTransactionSubscription,
    QuerySmartContractEvents,
    type RawTx,
    type RegularBlockResponse,
    RetrieveAccountDetails,
    RetrieveExpandedBlock,
    RetrieveHistoricalFeeData,
    RetrieveRawBlock,
    RetrieveRegularBlock,
    Revision,
    SuggestPriorityFee,
    type SubscriptionEventResponse,
    type ThorId,
    type ThorNetworks,
    type TransfersSubscription,
    type EventLogResponse
} from '@index';
import { type ExecuteCodesRequestJSON } from '@json';
import { type EventLogFilterRequestJSON } from '@thor/logs/json';
import { MozillaWebSocketClient, type WebSocketListener } from '@ws';
import { Blake2b256, Address as VeChainAddress, HexUInt } from '@vcdm';
import { Secp256k1 } from '@secp256k1';
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
}

interface PublicClientConfig {
    chain: ThorNetworks;
}

enum BlockReponseType {
    raw = 'raw', // vechain specific
    expanded = 'expanded', // vechain specific
    regular = 'regular' // vechain specific
}

// Revision type for viem
type BlockRevision = bigint | number | string | Uint8Array | Hex;

function createPublicClient(params: PublicClientConfig): PublicClient {
    return new PublicClient(params.chain);
}

class PublicClient {
    readonly httpClient: ThorNetworks;

    constructor(httpClient: ThorNetworks) {
        this.httpClient = httpClient; // viem specific
    }

    public async getBalance(address: Address): Promise<bigint> {
        const accountDetails = await RetrieveAccountDetails.of(address).askTo(
            FetchHttpClient.at(this.httpClient)
        );
        const balance = accountDetails.response.balance;
        return balance;
    }

    public async getBlock(
        revision: BlockRevision = 'best', // viem specific
        type: BlockReponseType = BlockReponseType.regular // vechain specific
    ): Promise<ExpandedBlockResponse | RawTx | RegularBlockResponse | null> {
        if (type === BlockReponseType.expanded) {
            const data = await RetrieveExpandedBlock.of(
                Revision.of(revision)
            ).askTo(FetchHttpClient.at(this.httpClient));
            return data.response;
        } else if (type === BlockReponseType.raw) {
            const data = await RetrieveRawBlock.of(Revision.of(revision)).askTo(
                FetchHttpClient.at(this.httpClient)
            );
            return data.response;
        } else {
            const data = await RetrieveRegularBlock.of(
                Revision.of(revision)
            ).askTo(FetchHttpClient.at(this.httpClient));
            return data.response;
        }
    }

    public async getBlockNumber(
        revision: BlockRevision = 'best' // viem specific
    ): Promise<number | undefined> {
        const selectedBlock = await RetrieveRegularBlock.of(
            Revision.of(revision)
        ).askTo(FetchHttpClient.at(this.httpClient));
        const blockNumber = selectedBlock?.response?.number;
        return blockNumber;
    }

    public async getBlockTransactionCount(
        revision: BlockRevision = 'best' // viem specific
    ): Promise<number | undefined> {
        const selectedBlock = await RetrieveRegularBlock.of(
            Revision.of(revision)
        ).askTo(FetchHttpClient.at(this.httpClient));
        const trxCount = selectedBlock?.response?.transactions.length;

        return trxCount;
    }

    public watchBlocks(pos: BlockId): BlocksSubscription {
        return BlocksSubscription.at(
            new MozillaWebSocketClient(
                `ws://${FetchHttpClient.at(this.httpClient).baseURL}`
            )
        ).atPos(pos);
    }

    public watchBlockNumber(): BlocksSubscription {
        return BlocksSubscription.at(
            new MozillaWebSocketClient(
                `ws://${FetchHttpClient.at(this.httpClient).baseURL}`
            )
        );
    }

    public async simulateCalls(
        request: ExecuteCodesRequestJSON
    ): Promise<ExecuteCodesResponse> {
        // this and call are the same because ETH doesn't support multi-call and they have explicit functions for this.
        // viem specific
        const inspectClause = await InspectClauses.of(request).askTo(
            FetchHttpClient.at(this.httpClient)
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
            FetchHttpClient.at(this.httpClient)
        );
        const clause = inspectClause.response;
        return clause;
    }

    public async getFeeHistory(
        blockCount: number
    ): Promise<GetFeesHistoryResponse> {
        // viem specific
        const data = await RetrieveHistoricalFeeData.of(blockCount).askTo(
            FetchHttpClient.at(this.httpClient)
        );
        return data.response;
    }

    public async getGasPrice(): Promise<bigint[]> {
        // viem specific
        const lastBlock = await RetrieveHistoricalFeeData.of(1).askTo(
            FetchHttpClient.at(this.httpClient)
        );
        const lastBaseFeePerGas = lastBlock.response.baseFeePerGas;
        return lastBaseFeePerGas;
    }

    public async estimateFeePerGas(): Promise<bigint | undefined> {
        // viem specific
        const lastRevision = await RetrieveRegularBlock.of(Revision.BEST).askTo(
            FetchHttpClient.at(this.httpClient)
        );
        const lastBaseFeePerGas = lastRevision?.response?.baseFeePerGas;
        return lastBaseFeePerGas;
    }

    public async estimateGas(
        request: ExecuteCodesRequestJSON
    ): Promise<ExecuteCodesResponse> {
        // viem specific
        const inspectClause = await InspectClauses.of(request).askTo(
            FetchHttpClient.at(this.httpClient)
        );
        const gasUsedArray = inspectClause.response;
        return gasUsedArray;
    }

    public async estimateMaxPriorityFeePerGas(): Promise<GetFeesPriorityResponse> {
        // viem specific
        const data = await SuggestPriorityFee.of().askTo(
            FetchHttpClient.at(this.httpClient)
        );
        return data.response;
    }

    public async getChainId(): Promise<bigint> {
        const data = await RetrieveRegularBlock.of(Revision.of(0)).askTo(
            FetchHttpClient.at(this.httpClient)
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
        event?: ThorId; // t0 - event signature
        args?: ThorId[]; // t1, t2, t3 - indexed parameters
        fromBlock?: BlockId; // pos - starting block position
    }): () => void {
        const { onLogs, onError, address, event, args, fromBlock } = params;

        // Create WebSocket client
        const webSocketClient = new MozillaWebSocketClient(
            `ws://${FetchHttpClient.at(this.httpClient).baseURL}`
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

    public async getLogs(params: {
        address?: Address | Address[];
        topics?: Array<ThorId | null>;
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
            FetchHttpClient.at(this.httpClient ?? '')
        );

        return response.response;
    }

    public createEventFilter(params?: {
        address?: Address | Address[];
        event?: ThorId;
        args?: ThorId[];
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
            throw new Error('Invalid filter type. Expected "event" filter.');
        }

        // Use the stored filter request to query for logs
        const response = await QuerySmartContractEvents.of(
            filter.request
        ).askTo(FetchHttpClient.at(this.httpClient ?? ''));

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

            // Get block hashes for new blocks
            const blockHashes: string[] = [];

            // In a real implementation, we would query for blocks between lastProcessed+1 and currentBlock
            // For now, we'll just get the latest block as an example
            const latestBlock = await this.getBlock(currentBlock);
            if (
                latestBlock !== null &&
                latestBlock !== undefined &&
                'id' in latestBlock &&
                latestBlock.id !== undefined
            ) {
                blockHashes.push(String(latestBlock.id));
            }

            // Update the last processed block
            blockFilter.lastBlockProcessed = currentBlock;

            return blockHashes;
        }
        // For pending transaction filters, we subscribe to new transactions if not already subscribed
        else if (filter.type === 'transaction') {
            const txFilter = filter;

            // If we don't have a subscription yet, create one
            if (txFilter.subscription === undefined) {
                // Get the WebSocket client for the filter
                const webSocketClient = new MozillaWebSocketClient(
                    `ws://${FetchHttpClient.at(this.httpClient ?? '').baseURL}`
                );

                // Create a new transaction subscription
                txFilter.subscription =
                    NewTransactionSubscription.at(webSocketClient);

                // We'll return an empty array for the first call, since the subscription
                // is just being set up. Subsequent calls will return new transaction hashes.
                return [];
            }

            // For subsequent calls, we would collect transaction hashes since the last call
            // In a real implementation, we would have some mechanism to collect txs between calls
            // For now, we'll just return an empty array as we don't have a mechanism to collect new txs
            return [];
        }

        throw new Error(
            `Unknown filter type: ${(filter as { type: string }).type}`
        );
    }

    public verifyMessage(params: {
        address: Address;
        message: string;
        signature: string;
    }): boolean {
        const { address, message, signature } = params;

        try {
            // Convert message to bytes
            const messageBytes = new TextEncoder().encode(message);

            // Hash the message with Blake2b256 (VeChain's preferred hash function)
            const hashedMessage = Blake2b256.of(messageBytes).bytes;

            // Parse the signature - use HexUInt instead of Buffer.from
            const signatureBytes = VeChainAddress.isValid(signature)
                ? VeChainAddress.of(signature).bytes
                : signature.startsWith('0x')
                  ? HexUInt.of(signature).bytes
                  : HexUInt.of(`0x${signature}`).bytes;

            // Recover the signer's address from the signature and message hash
            const recoveredPublicKey = Secp256k1.recover(
                hashedMessage,
                signatureBytes
            );

            // Derive address from the public key
            const recoveredAddress =
                VeChainAddress.ofPublicKey(recoveredPublicKey).toString();

            // Check if the recovered address matches the provided address
            return (
                recoveredAddress.toLowerCase() === String(address).toLowerCase()
            );
        } catch (error) {
            // If any step fails, the signature is invalid
            return false;
        }
    }

    public verifyTypedData(params: {
        address: Address;
        domain: {
            name?: string;
            version?: string;
            chainId?: number | bigint;
            verifyingContract?: Address;
            salt?: string | Uint8Array;
        };
        primaryType: string;
        // The types parameter is required for API compatibility with viem
        // but is not used in our current implementation
        types: Record<string, Array<{ name: string; type: string }>>;
        message: Record<string, unknown>;
        signature: string;
    }): boolean {
        const { address, domain, primaryType, message, signature } = params;

        try {
            // For VeChain compatibility, create a certificate-like structured object
            const typedDataObj = {
                purpose: primaryType, // Map to Certificate's purpose
                payload: {
                    type: 'EIP-712', // Standard type for structured data
                    content: JSON.stringify(message) // Content as JSON string
                },
                domain: domain.name ?? '', // Use domain name or empty string
                timestamp: Date.now() // Current timestamp (not used for verification)
            };

            // Serialize the data
            const serializedData = JSON.stringify(typedDataObj);
            const dataBytes = new TextEncoder().encode(serializedData);

            // Hash the serialized data
            const hashedData = Blake2b256.of(dataBytes).bytes;

            // Parse the signature
            const signatureBytes = VeChainAddress.isValid(signature)
                ? VeChainAddress.of(signature).bytes
                : signature.startsWith('0x')
                  ? HexUInt.of(signature).bytes
                  : HexUInt.of(`0x${signature}`).bytes;

            // Recover the signer's address
            const recoveredPublicKey = Secp256k1.recover(
                hashedData,
                signatureBytes
            );
            const recoveredAddress =
                VeChainAddress.ofPublicKey(recoveredPublicKey).toString();

            // Check if the recovered address matches the provided address
            return (
                recoveredAddress.toLowerCase() === String(address).toLowerCase()
            );
        } catch (error) {
            // If any step fails, the signature is invalid
            return false;
        }
    }
}

export { PublicClient, createPublicClient };
