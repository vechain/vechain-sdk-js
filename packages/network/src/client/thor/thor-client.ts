import { type Block } from './types';
import { type HttpClient } from '../http';
import { ThorReadonlyClient } from './thor-readonly-client';

/**
 * ThorClient is an extension of the ThorReadonlyClient with additional write capabilities for interacting with a VeChain Thor blockchain.
 *
 * This class combines read and write functionalities by using Axios for HTTP communication.
 * It is configured with a base URL and a request timeout, enabling interaction with blockchain nodes.
 *
 * @public
 */
class ThorClient extends ThorReadonlyClient {
    /**
     * Connects to a blockchain node using the provided HTTP client and creates a new instance of ThorClient.
     *
     * @param httpClient - The HTTP client responsible for communicating with the blockchain node.
     * @returns A promise that resolves to a new ThorClient instance.
     */
    public static async connect(httpClient: HttpClient): Promise<ThorClient> {
        // Fetch information about the blockchain's genesis block.
        const genesis: Block = (await httpClient.http(
            'GET',
            '/blocks/0'
        )) as Block;

        // Fetch information about the current best (head) block and validate it against the genesis block.
        const best: Block = (await httpClient.http('GET', 'blocks/best', {
            query: {},
            body: {},
            headers: {},
            validateResponseHeader: (headers) => {
                const genesisId = headers['x-genesis-id'];
                if (genesisId.length > 0 && genesisId !== genesis.id) {
                    throw new Error(
                        `genesis id mismatch: expected ${genesis.id}, got ${genesisId}`
                    );
                }
            }
        })) as Block;

        // Create and return a new ThorClient instance with the provided information.
        return new ThorClient(httpClient, genesis, {
            id: best.id,
            number: best.number,
            timestamp: best.timestamp,
            parentID: best.parentID,
            txsFeatures: best.txsFeatures,
            gasLimit: best.gasLimit
        });
    }
}

export { ThorClient };
