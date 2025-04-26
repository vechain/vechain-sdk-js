import { RawTx } from './RawTx';
import { RetrieveBlockError } from './RetrieveBlockError';
import { type HttpClient, type HttpPath } from '../../http';
import { type RawTxJSON } from './RawTxJSON';
import { type Revision } from '@vechain/sdk-core';
import { type ThorRequest } from '../ThorRequest';
import { type ThorResponse } from '../ThorResponse';

/**
 * Full-Qualified Path
 */
const FQP = 'packages/thorest/src/thor/blocks/RetrieveRawBlock.ts!';

/**
 * [Retrieve a raw block](http://localhost:8669/doc/stoplight-ui/#/paths/blocks-revision/get)
 */
class RetrieveRawBlock implements ThorRequest<RetrieveRawBlock, RawTx | null> {
    public readonly path: HttpPath;

    constructor(path: HttpPath) {
        this.path = path;
    }

    async askTo(
        httpClient: HttpClient
    ): Promise<ThorResponse<RetrieveRawBlock, RawTx | null>> {
        const fqp = `${FQP}askTo(httpClient: HttpClient: Promise<ThorResponse<RetrieveRawBlock, TxRaw | null>>`;
        const response = await httpClient.get(this.path, {
            query: '?raw=true'
        });
        if (response.ok) {
            const json = (await response.json()) as RawTxJSON | null;
            try {
                return {
                    request: this,
                    response: json === null ? null : new RawTx(json)
                };
            } catch (error) {
                throw new RetrieveBlockError(
                    fqp,
                    'Bad response.',
                    {
                        url: response.url,
                        body: json
                    },
                    error instanceof Error ? error : undefined,
                    response.status
                );
            }
        } else {
            throw new RetrieveBlockError(
                fqp,
                await response.text(),
                {
                    url: response.url
                },
                undefined,
                response.status
            );
        }
    }

    static of(revision: Revision): RetrieveRawBlock {
        return new RetrieveRawBlock({ path: `/blocks/${revision}` });
    }
}

export { RetrieveRawBlock };
