import { type HttpClient } from '../../http';
import { thorest } from '../../../utils';
import { type BlockDetail } from '../blocks';
import { buildError, DATA } from '@vechain-sdk/errors';

/**
 * Provides utility method for checking the health of a node.
 */
class NodesClient {
    /**
     * Initializes a new instance of the `NodeClient` class.
     * @param httpClient - The HTTP client instance used for making HTTP requests.
     */
    constructor(protected readonly httpClient: HttpClient) {}

    /**
     * the name of the attribute we are looking for to extract the block timestamp information
     */
    private static readonly BLOCK_TIMESTAMP_KEY = 'timestamp';

    /**
     * tolerance in seconds. When set to 30, it means that we consider a node healthy even when it's off-sync by roughly 3 blocks
     */
    private static readonly NODE_HEALTHCHECK_TOLERANCE_IN_SECONDS = 30;

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
     * @throws {InvalidDataTypeError} - if the timestamp key does not exist in the response from the API call to the node
     * @throws {InvalidDataTypeError} - if the timestamp key exists in the response from the API call to the node but the value is not a number
     * @throws {InvalidDataTypeError} - if the response from the API call to the node is not an object
     * @throws {InvalidDataTypeError} - if the response from the API call to the node is null or undefined
     */
    public async isHealthy(): Promise<boolean> {
        /**
         * @internal
         * Perform an HTTP GET request using the SimpleNet instance to get the latest block
         */
        const response = await this.httpClient.http(
            'GET',
            thorest.blocks.get.LAST_BLOCK_PATH()
        );

        /**
         * timestamp from the last block
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
            NodesClient.NODE_HEALTHCHECK_TOLERANCE_IN_SECONDS
        );
    }

    /**
     * Extracts the timestamp from the block
     * @remarks
     * This function throws an error if the timestamp key does not exist in the response from the API call to the node
     * @param response the response from the API call to the node
     * @returns the timestamp from the block
     * @throws {InvalidDataTypeError} - if the timestamp key does not exist in the response from the API call to the node
     * @throws {InvalidDataTypeError} - if the timestamp key exists in the response from the API call to the node but the value is not a number
     * @throws {InvalidDataTypeError} - if the response from the API call to the node is not an object
     * @throws {InvalidDataTypeError} - if the response from the API call to the node is null or undefined
     */
    private readonly getTimestampFromBlock = (response: unknown): number => {
        /**
         * Type assertion to check that the timestamp key exists in the response from the API call to the node
         */
        type checkTimestampKeyExists = (
            value: unknown
        ) => asserts value is BlockDetail;

        /**
         * Checks that the timestamp key exists in the response from the API call to the node
         * @param value the response from the API call to the node
         * @internal
         */
        const doesTimestampKeyExist: checkTimestampKeyExists = (value) => {
            if (
                value === null ||
                value === undefined ||
                typeof value !== 'object' ||
                !(NodesClient.BLOCK_TIMESTAMP_KEY in value) ||
                typeof value.timestamp !== 'number'
            ) {
                throw buildError(
                    DATA.INVALID_DATA_TYPE,
                    'Invalid block format returned from node. The block must be an object with a timestamp key present of type number'
                );
            }
        };

        doesTimestampKeyExist(response);
        return response.timestamp;
    };
}

export { NodesClient };
