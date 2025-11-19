import { type BlocksModuleOptions, type CompressedBlockDetail, type ExpandedBlockDetail, type WaitForBlockOptions } from './types';
import { type HttpClient } from '../../http';
/** The `BlocksModule` class encapsulates functionality for interacting with blocks
 * on the VeChainThor blockchain.
 */
declare class BlocksModule {
    readonly httpClient: HttpClient;
    /**
     * The head block (best block). This is updated by the event poll instance every time a new block is produced.
     * @private
     */
    private headBlock;
    /**
     * Error handler for block-related errors.
     */
    onBlockError?: (error: Error) => undefined;
    /**
     * The Poll instance for event polling
     * @private
     */
    private pollInstance?;
    /**
     * Initializes a new instance of the `Thor` class.
     * @param httpClient - The Thor instance used to interact with the VeChain blockchain API.
     * @param options - (Optional) Other optional parameters for polling and error handling.
     */
    constructor(httpClient: HttpClient, options?: BlocksModuleOptions);
    /**
     * Destroys the instance by stopping the event poll.
     */
    destroy(): void;
    /**
     * Sets up the event polling for the best block.
     * @private
     * */
    private setupPolling;
    /**
     * Retrieves details of a compressed specific block identified by its revision (block number or ID).
     *
     * @param revision - The block number or ID to query details for.
     * @returns A promise that resolves to an object containing the details of the compressed block.
     * @throws {InvalidDataType}
     */
    getBlockCompressed(revision: string | number): Promise<CompressedBlockDetail | null>;
    /**
     * Retrieves details of an expanded specific block identified by its revision (block number or ID).
     *
     * @param revision - The block number or ID to query details for.
     * @returns A promise that resolves to an object containing the details of the expanded block.
     * @throws {InvalidDataType}
     */
    getBlockExpanded(revision: string | number): Promise<ExpandedBlockDetail | null>;
    /**
     * Retrieves details of the latest block.
     *
     * @returns A promise that resolves to an object containing the compressed block details.
     */
    getBestBlockCompressed(): Promise<CompressedBlockDetail | null>;
    /**
     * Retrieves details of the latest block.
     *
     * @returns A promise that resolves to an object containing the expanded block details.
     */
    getBestBlockExpanded(): Promise<ExpandedBlockDetail | null>;
    /**
     * Retrieves the base fee per gas of the best block.
     *
     * @returns A promise that resolves to the base fee per gas of the best block.
     */
    getBestBlockBaseFeePerGas(): Promise<string | null>;
    /**
     * Asynchronously retrieves a reference to the best block in the blockchain.
     *
     * This method first calls `getBestBlockCompressed()` to obtain the current best block. If no block is found (i.e., if `getBestBlockCompressed()` returns `null`),
     * the method returns `null` indicating that there's no block to reference. Otherwise, it extracts and returns the first 18 characters of the
     * block's ID, providing the ref to the best block.
     *
     * @returns {Promise<string | null>} A promise that resolves to either a string representing the first 18 characters of the best block's ID,
     * or `null` if no best block is found.
     *
     * @Example:
     * const blockRef = await getBestBlockRef();
     * if (blockRef) {
     *     console.log(`Reference to the best block: ${blockRef}`);
     * } else {
     *     console.log("No best block found.");
     * }
     */
    getBestBlockRef(): Promise<string | null>;
    /**
     * Retrieves the finalized block.
     *
     * @returns A promise that resolves to an object containing the finalized block.
     */
    getFinalBlockCompressed(): Promise<CompressedBlockDetail | null>;
    /**
     * Retrieves details of the finalized block.
     *
     * @returns A promise that resolves to an object containing the finalized block details.
     */
    getFinalBlockExpanded(): Promise<ExpandedBlockDetail | null>;
    /**
     * Synchronously waits for a specific block revision using polling.
     *
     * @param blockNumber - The block number to wait for.
     * @param expanded - A boolean indicating whether to wait for an expanded block.
     * @param options - (Optional) Allows to specify timeout and interval in milliseconds
     * @returns A promise that resolves to an object containing the compressed block.
     * @throws {InvalidDataType}
     */
    private _waitForBlock;
    /**
     * Synchronously waits for a specific block revision using polling.
     *
     * @param blockNumber - The block number to wait for.
     * @param options - (Optional) Allows to specify timeout and interval in milliseconds
     * @returns A promise that resolves to an object containing the compressed block.
     */
    waitForBlockCompressed(blockNumber: number, options?: WaitForBlockOptions): Promise<CompressedBlockDetail | null>;
    /**
     * Synchronously waits for a specific expanded block revision using polling.
     *
     * @param blockNumber - The block number to wait for.
     * @param options - (Optional) Allows to specify timeout and interval in milliseconds
     * @returns A promise that resolves to an object containing the expanded block details.
     */
    waitForBlockExpanded(blockNumber: number, options?: WaitForBlockOptions): Promise<ExpandedBlockDetail | null>;
    /**
     * Returns the head block (best block).
     * @returns {BlockDetail | null} The head block (best block).
     */
    getHeadBlock(): CompressedBlockDetail | null;
    /**
     * Retrieves details of the genesis block.
     *
     * @returns A promise that resolves to an object containing the block details of the genesis block.
     */
    getGenesisBlock(): Promise<CompressedBlockDetail | null>;
    /**
     * Retrieves all addresses involved in a given block. This includes beneficiary, signer, clauses,
     * gas payer, origin, contract addresses, event addresses, and transfer recipients and senders.
     *
     * @param {ExpandedBlockDetail} block - The block object to extract addresses from.
     *
     * @returns {string[]} - An array of addresses involved in the block, included
     * empty addresses, duplicate elements are removed.
     *
     */
    getAllAddressesIntoABlock(block: ExpandedBlockDetail): string[];
}
export { BlocksModule };
//# sourceMappingURL=blocks-module.d.ts.map