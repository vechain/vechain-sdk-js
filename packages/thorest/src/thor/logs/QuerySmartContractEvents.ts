import { type HttpClient, type HttpPath } from '@http';
import {
    EventLogFilterRequest,
    type EventLogFilterRequestJSON,
    EventLogsResponse,
    type EventLogsResponseJSON
} from '@thor/logs';
import { type ThorRequest, type ThorResponse } from '../utils';

class QuerySmartContractEvents
    implements ThorRequest<QuerySmartContractEvents, EventLogsResponse>
{
    static readonly PATH: HttpPath = { path: '/logs/event' };

    readonly request: EventLogFilterRequest;

    constructor(request: EventLogFilterRequest) {
        this.request = request;
    }

    async askTo(
        httpClient: HttpClient
    ): Promise<ThorResponse<QuerySmartContractEvents, EventLogsResponse>> {
        const response = await httpClient.post(
            QuerySmartContractEvents.PATH,
            { query: '' },
            this.request.toJSON()
        );
        const responseBody = (await response.json()) as EventLogsResponseJSON;
        return {
            request: this,
            response: new EventLogsResponse(responseBody)
        };
    }

    static of(request: EventLogFilterRequestJSON): QuerySmartContractEvents {
        return new QuerySmartContractEvents(new EventLogFilterRequest(request));
    }
}

export { QuerySmartContractEvents };
