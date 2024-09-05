import { NODE_HEALTHCHECK_TOLERANCE_IN_SECONDS, thorest } from '../../utils';
import { InvalidDataType } from '@vechain/sdk-errors';
import { type CompressedBlockDetail } from '../blocks';
import { type ThorClient } from '../thor-client';
import { type ConnectedPeer } from './types';

/**
 * The `NodesModule` class serves as a module for node-related functionality, for example, checking the health of a node.
 */
class NodesModule {
    /**
     * Initializes a new instance of the `Thor` class.
     * @param thor - The Thor instance used to interact with the VeChain blockchain API.
     */
    constructor(readonly thor: ThorClient) {}

    /**
     * Retrieves connected peers of a node.
     *
     * @returns A promise that resolves to the list of connected peers.
     */
    public async getNodes(): Promise<ConnectedPeer[] | null> {
        return (await this.thor.httpClient.http(
            'GET',
            thorest.nodes.get.NODES()
        )) as ConnectedPeer[] | null;
    }

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
    public async isHealthy(): Promise<boolean> {
        /**
         * @internal
         * Perform an HTTP GET request using the SimpleNet instance to get the latest block
         */
        const response = await this.thor.blocks.getBestBlockCompressed();

        /**
         * timestamp from the last block and, eventually handle errors
         * @internal
         */
        const lastBlockTimestamp: number = this.getTimestampFromBlock(response);

        /**
         * seconds elapsed since the timestamp of the last block
         * @internal
         */
        const secondsSinceLastBlock =
            Math.floor(Date.now() / 1000) - lastBlockTimestamp;

        return (
            Math.abs(secondsSinceLastBlock) <
            NODE_HEALTHCHECK_TOLERANCE_IN_SECONDS
        );
    }

    /**
     * Extracts the timestamp from the block
     * @remarks
     * This function throws an error if the timestamp key does not exist in the response from the API call to the node
     * @param response the response from the API call to the node
     * @returns the timestamp from the block
     * @throws{InvalidDataType}
     */
    private readonly getTimestampFromBlock = (
        response: CompressedBlockDetail | null
    ): number => {
        if (
            response === null ||
            response === undefined ||
            typeof response !== 'object' ||
            !('timestamp' in response) ||
            typeof response.timestamp !== 'number'
        ) {
            throw new InvalidDataType(
                'NodesModule.getTimestampFromBlock()',
                'Sending failed: Input must be a valid raw transaction in hex format.',
                { response }
            );
        }

        return response?.timestamp;
    };
}

export { NodesModule };
