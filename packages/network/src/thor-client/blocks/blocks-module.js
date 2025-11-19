"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlocksModule = void 0;
const sdk_errors_1 = require("@vechain/sdk-errors");
const utils_1 = require("../../utils");
const sdk_core_1 = require("@vechain/sdk-core");
const http_1 = require("../../http");
/** The `BlocksModule` class encapsulates functionality for interacting with blocks
 * on the VeChainThor blockchain.
 */
class BlocksModule {
    httpClient;
    /**
     * The head block (best block). This is updated by the event poll instance every time a new block is produced.
     * @private
     */
    headBlock = null;
    /**
     * Error handler for block-related errors.
     */
    onBlockError;
    /**
     * The Poll instance for event polling
     * @private
     */
    pollInstance;
    /**
     * Initializes a new instance of the `Thor` class.
     * @param httpClient - The Thor instance used to interact with the VeChain blockchain API.
     * @param options - (Optional) Other optional parameters for polling and error handling.
     */
    constructor(httpClient, options) {
        this.httpClient = httpClient;
        this.onBlockError = options?.onBlockError;
        if (options?.isPollingEnabled === true)
            this.setupPolling();
    }
    /**
     * Destroys the instance by stopping the event poll.
     */
    destroy() {
        if (this.pollInstance != null) {
            this.pollInstance.stopListen();
        }
    }
    /**
     * Sets up the event polling for the best block.
     * @private
     * */
    setupPolling() {
        this.pollInstance = utils_1.Poll.createEventPoll(async () => await this.getBestBlockCompressed(), 10000 // Poll every 10 seconds,
        )
            .onData((data) => {
            this.headBlock = data;
        })
            .onError(this.onBlockError ?? (() => { }));
        this.pollInstance.startListen();
    }
    /**
     * Retrieves details of a compressed specific block identified by its revision (block number or ID).
     *
     * @param revision - The block number or ID to query details for.
     * @returns A promise that resolves to an object containing the details of the compressed block.
     * @throws {InvalidDataType}
     */
    async getBlockCompressed(revision) {
        // Check if the revision is a valid block number or ID
        if (revision !== null &&
            revision !== undefined &&
            !sdk_core_1.Revision.isValid(revision)) {
            throw new sdk_errors_1.InvalidDataType('BlocksModule.getBlockCompressed()', 'Invalid revision. The revision must be a string representing a block number or block id (also "best" is accepted which represents the best block & "finalized" for the finalized block).', { revision });
        }
        return (await this.httpClient.http(http_1.HttpMethod.GET, utils_1.thorest.blocks.get.BLOCK_DETAIL(revision)));
    }
    /**
     * Retrieves details of an expanded specific block identified by its revision (block number or ID).
     *
     * @param revision - The block number or ID to query details for.
     * @returns A promise that resolves to an object containing the details of the expanded block.
     * @throws {InvalidDataType}
     */
    async getBlockExpanded(revision) {
        // Check if the revision is a valid block number or ID
        if (revision !== null &&
            revision !== undefined &&
            !sdk_core_1.Revision.isValid(revision)) {
            throw new sdk_errors_1.InvalidDataType('BlocksModule.getBlockExpanded()', 'Invalid revision. The revision must be a string representing a block number or block id (also "best" is accepted which represents the best block & "finalized" for the finalized block).', { revision });
        }
        return (await this.httpClient.http(http_1.HttpMethod.GET, utils_1.thorest.blocks.get.BLOCK_DETAIL(revision), {
            query: (0, utils_1.buildQuery)({ expanded: true })
        }));
    }
    /**
     * Retrieves details of the latest block.
     *
     * @returns A promise that resolves to an object containing the compressed block details.
     */
    async getBestBlockCompressed() {
        return await this.getBlockCompressed('best');
    }
    /**
     * Retrieves details of the latest block.
     *
     * @returns A promise that resolves to an object containing the expanded block details.
     */
    async getBestBlockExpanded() {
        return await this.getBlockExpanded('best');
    }
    /**
     * Retrieves the base fee per gas of the best block.
     *
     * @returns A promise that resolves to the base fee per gas of the best block.
     */
    async getBestBlockBaseFeePerGas() {
        const bestBlock = await this.getBestBlockCompressed();
        if (bestBlock === null)
            return null;
        return bestBlock.baseFeePerGas ?? null;
    }
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
    async getBestBlockRef() {
        const bestBlock = await this.getBestBlockCompressed();
        if (bestBlock === null)
            return null;
        return bestBlock.id.slice(0, 18);
    }
    /**
     * Retrieves the finalized block.
     *
     * @returns A promise that resolves to an object containing the finalized block.
     */
    async getFinalBlockCompressed() {
        return await this.getBlockCompressed('finalized');
    }
    /**
     * Retrieves details of the finalized block.
     *
     * @returns A promise that resolves to an object containing the finalized block details.
     */
    async getFinalBlockExpanded() {
        return await this.getBlockExpanded('finalized');
    }
    /**
     * Synchronously waits for a specific block revision using polling.
     *
     * @param blockNumber - The block number to wait for.
     * @param expanded - A boolean indicating whether to wait for an expanded block.
     * @param options - (Optional) Allows to specify timeout and interval in milliseconds
     * @returns A promise that resolves to an object containing the compressed block.
     * @throws {InvalidDataType}
     */
    async _waitForBlock(blockNumber, expanded, options) {
        if (blockNumber !== undefined &&
            blockNumber !== null &&
            blockNumber <= 0) {
            throw new sdk_errors_1.InvalidDataType('BlocksModule.waitForBlock()', 'Invalid blockNumber. The blockNumber must be a number representing a block number.', { blockNumber });
        }
        // Use the Poll.SyncPoll utility to repeatedly call getBestBlock with a specified interval
        return await utils_1.Poll.SyncPoll(async () => expanded
            ? await this.getBlockExpanded(blockNumber)
            : await this.getBlockCompressed(blockNumber), {
            requestIntervalInMilliseconds: options?.intervalMs,
            maximumWaitingTimeInMilliseconds: options?.timeoutMs
        }).waitUntil((result) => {
            // Continue polling until the result's block number matches the specified revision
            return result != null && result.number == blockNumber;
        });
    }
    /**
     * Synchronously waits for a specific block revision using polling.
     *
     * @param blockNumber - The block number to wait for.
     * @param options - (Optional) Allows to specify timeout and interval in milliseconds
     * @returns A promise that resolves to an object containing the compressed block.
     */
    async waitForBlockCompressed(blockNumber, options) {
        return (await this._waitForBlock(blockNumber, false, options));
    }
    /**
     * Synchronously waits for a specific expanded block revision using polling.
     *
     * @param blockNumber - The block number to wait for.
     * @param options - (Optional) Allows to specify timeout and interval in milliseconds
     * @returns A promise that resolves to an object containing the expanded block details.
     */
    async waitForBlockExpanded(blockNumber, options) {
        return (await this._waitForBlock(blockNumber, true, options));
    }
    /**
     * Returns the head block (best block).
     * @returns {BlockDetail | null} The head block (best block).
     */
    getHeadBlock() {
        return this.headBlock;
    }
    /**
     * Retrieves details of the genesis block.
     *
     * @returns A promise that resolves to an object containing the block details of the genesis block.
     */
    async getGenesisBlock() {
        return await this.getBlockCompressed(0);
    }
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
    getAllAddressesIntoABlock(block) {
        const addresses = new Set();
        addresses.add(block.beneficiary);
        addresses.add(block.signer);
        block.transactions.forEach((transaction) => {
            transaction.clauses.forEach((clause) => {
                if (typeof clause.to === 'string') {
                    addresses.add(clause.to);
                }
            });
            addresses.add(transaction.gasPayer);
            addresses.add(transaction.origin);
            transaction.outputs.forEach((output) => {
                if (typeof output.contractAddress === 'string') {
                    addresses.add(output.contractAddress);
                }
                output.events.forEach((event) => {
                    addresses.add(event.address);
                });
                output.transfers.forEach((transfer) => {
                    addresses.add(transfer.recipient);
                    addresses.add(transfer.sender);
                });
            });
        });
        return Array.from(addresses);
    }
}
exports.BlocksModule = BlocksModule;
