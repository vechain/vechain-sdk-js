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

    public async getChainId(): Promise<Hex | undefined> {
        const data = await RetrieveRegularBlock.of(Revision.of(0)).askTo(
            FetchHttpClient.at(this.httpClient)
        );
        return data.response?.id;
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

    /**
     * Watches and returns emitted Event Logs based on the provided filter parameters.
     * Similar to viem's watchEvent but using EventsSubscription.
     *
     * @param {object} params - The parameters for watching events.
     * @param {function} params.onLogs - Callback function that receives event logs (maps to onMessage).
     * @param {function} [params.onError] - Optional callback for handling errors.
     * @param {Address} [params.address] - Optional contract address to filter events.
     * @param {ThorId} [params.event] - Optional event signature (t0) to filter events.
     * @param {ThorId[]} [params.args] - Optional indexed event parameters to filter (t1, t2, t3).
     * @param {BlockId} [params.fromBlock] - Optional starting block position.
     * @returns {Function} A function that when called, uninstalls the filter.
     */
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

    /**
     * Gets event logs that match the provided filter parameters.
     * Follows the viem API pattern for getLogs.
     *
     * @see {@link https://viem.sh/docs/actions/public/getLogs}
     *
     * @param {object} params - Filter parameters
     * @param {Address} [params.address] - Contract address or array of addresses
     * @param {ThorId[]} [params.topics] - Array of topic filters (event signature, indexed params)
     * @param {BlockRevision | number | string} [params.fromBlock] - Block to start searching from
     * @param {BlockRevision | number | string} [params.toBlock] - Block to search to
     * @returns {Promise<EventLogResponse[]>} Array of event logs
     */
    /**
     * Helper method to convert BlockRevision to a number value if possible
     * @param blockRevision Block revision to convert
     * @returns Number value or undefined if conversion not possible
     */
    private convertBlockRevisionToNumber(
        blockRevision: BlockRevision
    ): number | undefined {
        if (typeof blockRevision === 'bigint') {
            return Number(blockRevision);
        }

        if (typeof blockRevision === 'number') {
            return blockRevision;
        }

        if (
            typeof blockRevision === 'string' &&
            blockRevision !== 'latest' &&
            blockRevision !== 'pending' &&
            blockRevision !== 'earliest'
        ) {
            return parseInt(blockRevision, 16);
        }

        return undefined;
    }

    /**
     * Helper method to handle address filtering
     * @param address Single address or array of addresses
     * @returns Address string in VeChain format
     */
    private handleAddressFilter(
        address: Address | Address[] | undefined
    ): string | undefined {
        if (address === undefined) {
            return undefined;
        }

        if (Array.isArray(address) && address.length > 0) {
            // For multiple addresses, we currently take the first one
            // VeChain API limitations require us to simplify for now
            return String(address[0]);
        }

        return String(address);
    }

    /**
     * Helper method to handle event arguments (indexed parameters)
     * @param args Array of indexed parameters
     * @returns Record of topic keys and values
     */
    private handleEventArgs(args?: ThorId[]): Record<string, string> {
        const topicValues: Record<string, string> = {};

        if (args == null || args.length === 0) {
            return topicValues;
        }

        // Map args to VeChain topic format (topic1, topic2, topic3)
        args.forEach((arg, index) => {
            if (arg !== null && index < 3) {
                // VeChain supports up to 3 indexed params
                const topicKey = `topic${index + 1}`; // +1 because index starts at 0, but topics at 1
                topicValues[topicKey] = String(arg);
            }
        });

        return topicValues;
    }

    /**
     * Helper method to prepare a block range filter
     * @param fromBlock Starting block revision
     * @param toBlock Ending block revision
     * @returns Range object for the filter request
     */
    private prepareBlockRange(
        fromBlock?: BlockRevision,
        toBlock?: BlockRevision
    ): Record<string, string | number> {
        const range: Record<string, string | number> = {};

        // Handle fromBlock
        const fromValue =
            fromBlock !== undefined
                ? this.convertBlockRevisionToNumber(fromBlock)
                : undefined;
        if (fromValue !== undefined) {
            range.from = fromValue;
            range.unit = 'block';
        }

        // Handle toBlock
        const toValue =
            toBlock !== undefined
                ? this.convertBlockRevisionToNumber(toBlock)
                : undefined;
        if (toValue !== undefined) {
            range.to = toValue;
            range.unit = 'block';
        }

        return range;
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
        const addressFilter = this.handleAddressFilter(address);
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

        // Prepare range filter if fromBlock or toBlock is provided
        const range: Record<string, string | number> = {};

        // Handle fromBlock
        const fromValue =
            fromBlock !== undefined
                ? this.convertBlockRevisionToNumber(fromBlock)
                : undefined;
        if (fromValue !== undefined) {
            range.from = fromValue;
            range.unit = 'block';
        }

        // Handle toBlock
        const toValue =
            toBlock !== undefined
                ? this.convertBlockRevisionToNumber(toBlock)
                : undefined;
        if (toValue !== undefined) {
            range.to = toValue;
            range.unit = 'block';
        }

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
    /**
     * Creates an event filter according to the viem API pattern.
     * The filter can be used later to retrieve logs with getFilterLogs.
     *
     * @see {@link https://viem.sh/docs/actions/public/createEventFilter}
     *
     * @param {object} [params] - Filter parameters (optional)
     * @param {Address} [params.address] - Contract address or array of addresses
     * @param {ThorId} [params.event] - Event signature
     * @param {ThorId[]} [params.args] - Array of indexed event parameters
     * @param {BlockRevision} [params.fromBlock] - Block to start filtering from
     * @param {BlockRevision} [params.toBlock] - Block to filter to
     * @returns {Promise<EventFilter>} A filter object that can be used with getFilterLogs
     */
    // Not actually async but keeping the signature for API consistency
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
        const addressFilter = this.handleAddressFilter(address);
        if (addressFilter != null) {
            criteria.address = addressFilter;
        }

        // Handle event signature (topic0)
        if (event !== undefined) {
            criteria.topic0 = String(event);
        }

        // Handle indexed parameters (topic1, topic2, topic3)
        const topicValues = this.handleEventArgs(args);
        Object.assign(criteria, topicValues);

        // Prepare range filter if fromBlock or toBlock is provided
        const range = this.prepareBlockRange(fromBlock, toBlock);

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

    /**
     * Gets event logs from a previously created filter.
     * Follows the viem API pattern for getFilterLogs.
     *
     * @see {@link https://viem.sh/docs/actions/public/getFilterLogs}
     *
     * @param {object} params - Filter parameters
     * @param {EventFilter} params.filter - Filter created with createEventFilter
     * @returns {Promise<EventLogResponse[]>} Array of event logs
     */
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

    /**
     * Creates a block filter according to the viem API pattern.
     * The filter can be used to retrieve new blocks since the filter was created.
     *
     * @see {@link https://viem.sh/docs/actions/public/createBlockFilter}
     *
     * @returns {Promise<BlockFilter>} A filter object that can be used with getFilterChanges
     */
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

    /**
     * Creates a filter for pending transactions according to the viem API pattern.
     * The filter can be used to retrieve new pending transactions since the filter was created.
     *
     * @see {@link https://viem.sh/docs/actions/public/createPendingTransactionFilter}
     *
     * @returns {Promise<PendingTransactionFilter>} A filter object that can be used with getFilterChanges
     */
    // Not actually async but keeping the signature for API consistency
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

    /**
     * Gets changes (new logs/blocks/transactions) that have occurred since the filter was created or last called.
     * Follows the viem API pattern for getFilterChanges.
     *
     * @see {@link https://viem.sh/docs/actions/public/getFilterChanges}
     *
     * @param {object} params - Filter parameters
     * @param {Filter} params.filter - Filter created with one of the createFilter methods
     * @returns {Promise<any[]>} Array of changes (logs, block hashes, or transaction hashes)
     */
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

    /**
     * Verify a message was signed by the provided address
     * Follows viem API pattern: https://viem.sh/docs/actions/public/verifyMessage
     *
     * @param params - Parameters for the verification
     * @param params.address - The address that supposedly signed the message
     * @param params.message - The message that was signed
     * @param params.signature - The signature to verify
     * @returns Boolean indicating if the signature is valid
     */
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

    /**
     * Verify a typed data structure was signed by the provided address
     * Follows viem API pattern: https://viem.sh/docs/actions/public/verifyTypedData
     *
     * @param params - Parameters for the verification
     * @param params.address - The address that supposedly signed the typed data
     * @param params.domain - The domain data
     * @param params.types - The type definitions
     * @param params.primaryType - The primary type name
     * @param params.message - The message object containing the typed data
     * @param params.signature - The signature to verify
     * @returns Boolean indicating if the signature is valid
     */
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
