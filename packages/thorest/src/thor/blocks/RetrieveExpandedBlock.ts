import { type HttpClient, type HttpPath } from '@http';
import {
    ExpandedBlockResponse,
    type ExpandedBlockResponseJSON
} from '@thor/blocks';
import { type ThorRequest, type ThorResponse } from '../utils';
import { type Revision } from '@vechain/sdk-core';

class RetrieveExpandedBlock
    implements ThorRequest<RetrieveExpandedBlock, ExpandedBlockResponse>
{
    public readonly path: RetrieveExpandedBlockPath;

    constructor(path: RetrieveExpandedBlockPath) {
        this.path = path;
    }

    async askTo(
        httpClient: HttpClient
    ): Promise<ThorResponse<RetrieveExpandedBlock, ExpandedBlockResponse>> {
        const response = await httpClient.get(this.path, {
            query: '?expanded=true'
        });
        const responseJSON =
            (await response.json()) as ExpandedBlockResponseJSON;
        return {
            request: this,
            response: new ExpandedBlockResponse(responseJSON)
        };
    }

    static of(revision: Revision): RetrieveExpandedBlock {
        return new RetrieveExpandedBlock(
            new RetrieveExpandedBlockPath(revision)
        );
    }
}

class RetrieveExpandedBlockPath implements HttpPath {
    readonly revision: Revision;

    constructor(revision: Revision) {
        this.revision = revision;
    }

    get path(): string {
        return `/blocks/${this.revision}`;
    }
}

export { RetrieveExpandedBlock, RetrieveExpandedBlockPath };
