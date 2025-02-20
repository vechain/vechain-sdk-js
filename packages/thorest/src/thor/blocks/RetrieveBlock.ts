import { type HttpClient, type HttpPath } from '../../http';
import { type ThorRequest } from '../ThorRequest';
import { type ThorResponse } from '../ThorResponse';
import {
    ExpandedBlockResponse,
    type ExpandedBlockResponseJSON
} from './ExpandedBlockResponse';
import { RawBlockResponse, type RawBlockResponseJSON } from './RawBlockReponse';
import {
    RegularBlockResponse,
    type RegularBlockResponseJSON
} from './RegularBlockResponse.';
import { type Revision } from '@vechain/sdk-core';

type ResponseType =
    | RegularBlockResponse
    | RawBlockResponse
    | ExpandedBlockResponse;

class RetrieveBlock implements ThorRequest<RetrieveBlock, ResponseType> {
    public readonly path: RetrieveBlockPath;
    public readonly query: { query: string };

    constructor(path: RetrieveBlockPath, query?: string) {
        let queryValue = '';
        switch (query) {
            case 'raw':
                queryValue = '?raw=true';
                break;
            case 'expanded':
                queryValue = '?expanded=true';
                break;
            default:
        }
        this.path = path;
        this.query = { query: queryValue };
    }

    async askTo(
        httpClient: HttpClient
    ): Promise<ThorResponse<RetrieveBlock, ResponseType>> {
        const response = await httpClient.get(this.path, this.query);
        switch (this.query.query) {
            case '?expanded=true': {
                const expandedBlockResponse =
                    (await response.json()) as ExpandedBlockResponseJSON;
                return {
                    request: this,
                    response: new ExpandedBlockResponse(expandedBlockResponse)
                };
            }
            case '?raw=true': {
                const rawBlockResponse =
                    (await response.json()) as RawBlockResponseJSON;
                return {
                    request: this,
                    response: new RawBlockResponse(rawBlockResponse)
                };
            }
            default: {
                const regularBlockResponse =
                    (await response.json()) as RegularBlockResponseJSON;
                return {
                    request: this,
                    response: new RegularBlockResponse(regularBlockResponse)
                };
            }
        }
    }

    static of(revision: Revision): RetrieveBlock {
        return new RetrieveBlock(new RetrieveBlockPath(revision));
    }
}

class RetrieveBlockPath implements HttpPath {
    readonly revision: Revision;

    constructor(revision: Revision) {
        this.revision = revision;
    }

    get path(): string {
        return `/blocks/${this.revision}`;
    }
}

export { RetrieveBlock, RetrieveBlockPath };
