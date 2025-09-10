import { AbstractThorModule } from '../AbstractThorModule';
import { ConnectedPeer } from '../model/nodes';
import { RetrieveConnectedPeers } from '@thor/thorest/node/methods';
import { RetrieveRegularBlock } from '@thor/thorest/blocks/methods';
import { IllegalArgumentError } from '@common/errors';
import { Revision } from '@common/vcdm';

/**
 * The node health check tolerance in seconds.
 * A node is considered healthy if the latest block timestamp is within this tolerance.
 */
const NODE_HEALTHCHECK_TOLERANCE_IN_SECONDS = 30;

/**
 * The `NodesModule` class provides methods to interact with node-related endpoints
 * of the VeChainThor blockchain. It allows retrieving connected peers and checking node health.
 */
class NodesModule extends AbstractThorModule {
    /**
     * Retrieves connected peers of a node.
     *
     * @returns A promise that resolves to the list of connected peers.
     */
    public async getNodes(): Promise<ConnectedPeer[]> {
        const query = RetrieveConnectedPeers.of();
        const response = await query.askTo(this.httpClient);

        if (response.response === null) {
            return [];
        }

        return response.response.map((peerStat) =>
            ConnectedPeer.fromPeerStat(peerStat)
        );
    }

    /**
     * Checks the health of a node using the following algorithm:
     * 1. Make an HTTP request to retrieve the best block.
     * 2. Calculates the difference between the current time and the last block timestamp.
     * 3. If the difference is less than the tolerance, the node is healthy.
     *
     * Note: We check the best block timestamp rather than just peer connectivity
     * because a node could be connected to peers but not syncing properly
     * (e.g., due to disk issues preventing block storage).
     *
     * @returns A boolean indicating whether the node is healthy.
     * @throws {IllegalArgumentError} If the block response is invalid or missing timestamp.
     */
    public async isHealthy(): Promise<boolean> {
        try {
            // Retrieve the best block to check its timestamp
            const query = RetrieveRegularBlock.of(Revision.BEST);
            const response = await query.askTo(this.httpClient);

            if (response.response === null) {
                throw new IllegalArgumentError(
                    'NodesModule.isHealthy()',
                    'Unable to retrieve the best block for health check.',
                    { response: null }
                );
            }

            const lastBlockTimestamp = this.getTimestampFromBlock(
                response.response
            );

            // Calculate seconds elapsed since the last block
            const secondsSinceLastBlock =
                Math.floor(Date.now() / 1000) - lastBlockTimestamp;

            return (
                Math.abs(secondsSinceLastBlock) <
                NODE_HEALTHCHECK_TOLERANCE_IN_SECONDS
            );
        } catch (error) {
            // If we can't check health, assume unhealthy
            return false;
        }
    }

    /**
     * Extracts the timestamp from the block response.
     *
     * @param blockResponse - The response from the block retrieval API
     * @returns The timestamp from the block
     * @throws {IllegalArgumentError} If the timestamp is not available in the response
     * @private
     */
    private getTimestampFromBlock(
        blockResponse: { timestamp: number } | null
    ): number {
        if (
            blockResponse === null ||
            blockResponse === undefined ||
            typeof blockResponse !== 'object' ||
            !('timestamp' in blockResponse) ||
            typeof blockResponse.timestamp !== 'number'
        ) {
            throw new IllegalArgumentError(
                'NodesModule.getTimestampFromBlock()',
                'Block response must contain a valid timestamp.',
                { blockResponse }
            );
        }

        return blockResponse.timestamp;
    }
}

export { NodesModule };
