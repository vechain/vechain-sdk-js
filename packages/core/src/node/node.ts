import { HttpClient } from '@vechain-sdk/network/src';

/**
 * path to Thorest API to retrieve last block
 */
const LAST_BLOCK_PATH = '/blocks/best';
/**
 * tolerance in seconds. When set to 30, it means that we consider a node healthy even when it's off-sync by roughly 3 blocks
 */
const NODE_HEALTHCHECK_TOLERANCE_IN_SECONDS = 30;
/**
 * the name of the atttribute we are looking for to extract the block timestamp information
 */
const BLOCK_TIMESTAMP_KEY = 'timestamp';

interface Block {
    timestamp: number;
}

/**
 * Checks the health of a node using the following algorithm:
 * 1. Make an HTTP GET request to retrieve the last block timestamp.
 * 2. Calculate the difference between the current time and the last block timestamp.
 * 3. If the difference is less than the tolerance, the node is healthy.
 * Note, we could also check '/node/network/peers since' but the difficulty with this approach is
 * if you consider a scenario where the node is connected to 20+ peers, which is healthy, and it receives the new blocks as expected.
 * But what if the node's disk is full, and it's not writing the new blocks to its database? In this case the node is off-sync even
 * though it's technically alive and connected
 * @param URL The URL of the node.
 * @returns A boolean indicating whether the node is healthy.
 * @throws An error if the request fails due to an invalid URL, a network error, an unavailable node, or an invalid block format.
 */
async function isHealthy(URL: string): Promise<boolean> {
    isEmpyOrBlank(URL);

    const network = new HttpClient(URL);
    /**
     * Perform an HTTP GET request using the SimpleNet instance to get the latest block
     */
    const response = await network.http('GET', LAST_BLOCK_PATH);
    const lastBlockTimestamp: number = getTimestampFromBlock(response);

    const secondsSinceLastBlock =
        Math.floor(Date.now() / 1000) - lastBlockTimestamp;

    return (
        Math.abs(secondsSinceLastBlock) < NODE_HEALTHCHECK_TOLERANCE_IN_SECONDS
    );
}

/**
 * Performs basic validation on the provided URL to avoid unnecessary HTTP requests.
 * @remarks
 * This function throws an error if the URL is null, undefined, or empty.
 * @throws An error if the URL is null, undefined, or empty.
 * @param URL
 */
const isEmpyOrBlank = (URL: string): void => {
    if (URL?.trim() === '') {
        throw new Error('URL cannot be null, undefined, or empty.');
    }
};

/**
 * Extracts the timestamp from the block
 * @remarks
 * This function throws an error if the timestamp key does not exist in the response from the API call to the node
 * @param response the response from the API call to the node
 * @returns the timestamp from the block
 * @throws An error if the timestamp key does not exist in the response from the API call to the node
 * @throws An error if the timestamp key exists in the response from the API call to the node but the value is not a number
 * @throws An error if the response from the API call to the node is not an object
 * @throws An error if the response from the API call to the node is null or undefined
 */
const getTimestampFromBlock = (response: unknown): number => {
    /**
     * Type assertion to check that the timestamp key exists in the response from the API call to the node
     */
    type checkTimestampKeyExists = (value: unknown) => asserts value is Block;

    /**
     * Checks that the timestamp key exists in the response from the API call to the node
     * @param value the response from the API call to the node
     */
    const doesTimestampKeyExist: checkTimestampKeyExists = (value) => {
        if (
            value === null ||
            value === undefined ||
            typeof value !== 'object' ||
            !(BLOCK_TIMESTAMP_KEY in value) ||
            typeof value.timestamp !== 'number'
        ) {
            throw new Error('Invalid block format returned from node.');
        }
    };

    doesTimestampKeyExist(response);
    return response.timestamp;
};

export const node = {
    isHealthy
};
