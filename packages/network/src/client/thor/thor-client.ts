import { type Block } from '../../types/block';
import { type HttpClient } from '../http';
import { ThorReadonlyClient } from './thor-readonly-client';

class ThorClient extends ThorReadonlyClient {
    public static async connect(httpClient: HttpClient): Promise<ThorClient> {
        const genesis: Block = (await httpClient.http(
            'GET',
            '/blocks/0'
        )) as Block;
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
