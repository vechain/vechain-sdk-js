import { type HttpClient, type HttpPath } from '@http';
import {
    TransferLogFilterRequest,
    type TransferLogFilterRequestJSON,
    TransferLogsResponse,
    type TransferLogsResponseJSON
} from '@thor/logs';
import { type ThorRequest, type ThorResponse } from '@thor';

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
            response: new TransferLogsResponse(responseBody)
        };
    }

    static of(request: TransferLogFilterRequestJSON): QueryVETTransferEvents {
        return new QueryVETTransferEvents(
            new TransferLogFilterRequest(request)
        );
    }
}

export { QueryVETTransferEvents };
