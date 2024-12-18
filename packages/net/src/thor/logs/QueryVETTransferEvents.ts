import {
    TransferLogResponse,
    type TransferLogResponseJSON,
    type TransferLogsResponse,
    type TransferLogsResponseJSON
} from './TransferLogsResponse';
import { type ThorRequest } from '../ThorRequest';
import type { HttpClient, HttpPath } from '../../http';
import {
    TransferLogFilterRequest,
    type TransferLogFilterRequestJSON
} from './TransferLogFilterRequest';
import { type ThorResponse } from '../ThorResponse';

class QueryVETTransferEvents
    implements ThorRequest<QueryVETTransferEvents, TransferLogsResponse>
{
    static readonly PATH: HttpPath = { path: '/logs/transfer' };

    readonly request: TransferLogFilterRequest;

    constructor(request: TransferLogFilterRequest) {
        this.request = request;
    }

    async askTo(
        httpClient: HttpClient
    ): Promise<ThorResponse<QueryVETTransferEvents, TransferLogsResponse>> {
        const response = await httpClient.post(
            QueryVETTransferEvents.PATH,
            { query: '' },
            this.request.toJSON()
        );
        const responseBody =
            (await response.json()) as TransferLogsResponseJSON;
        return {
            request: this,
            response: responseBody.map(
                (json: TransferLogResponseJSON): TransferLogResponse =>
                    new TransferLogResponse(json)
            ) as TransferLogsResponse
        };
    }

    static of(request: TransferLogFilterRequestJSON): QueryVETTransferEvents {
        return new QueryVETTransferEvents(
            new TransferLogFilterRequest(request)
        );
    }
}

export { QueryVETTransferEvents };
