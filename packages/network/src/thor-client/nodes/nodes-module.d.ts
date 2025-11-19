import { type BlocksModule } from '../blocks';
import { type ConnectedPeer } from './types';
/**
 * The `NodesModule` class serves as a module for node-related functionality, for example, checking the health of a node.
 */
declare class NodesModule {
    readonly blocksModule: BlocksModule;
    constructor(blocksModule: BlocksModule);
    /**
     * Retrieves connected peers of a node.
     *
     * @returns A promise that resolves to the list of connected peers.
     */
    getNodes(): Promise<ConnectedPeer[]>;
    /**
     * Checks the health of a node using the following algorithm:
     * 1. Make an HTTP GET request to retrieve the last block timestamp.
     * 2. Calculates the difference between the current time and the last block timestamp.
     * 3. If the difference is less than the tolerance, the node is healthy.
     * Note, we could also check '/node/network/peers since' but the difficulty with this approach is
     * if you consider a scenario where the node is connected to 20+ peers, which is healthy, and it receives the new blocks as expected.
     * But what if the node's disk is full, and it's not writing the new blocks to its database? In this case the node is off-sync even
     * though it's technically alive and connected
     * @returns A boolean indicating whether the node is healthy.
     * @throws {InvalidDataTypeError}
     */
    isHealthy(): Promise<boolean>;
    /**
     * Extracts the timestamp from the block
     * @remarks
     * This function throws an error if the timestamp key does not exist in the response from the API call to the node
     * @param response the response from the API call to the node
     * @returns the timestamp from the block
     * @throws{InvalidDataType}
     */
    private readonly getTimestampFromBlock;
    /**
     * Retrieves and caches the chainTag from the genesis block of the given ThorClient.
     * Uses the same short-circuit caching logic as eth_chainId().
     */
    getChaintag(): Promise<number>;
}
export { NodesModule };
//# sourceMappingURL=nodes-module.d.ts.map