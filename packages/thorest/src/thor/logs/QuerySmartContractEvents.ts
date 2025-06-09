import {
    type ThorRequest,
    type ThorResponse,
    type EventLogsResponseJSON,
    type EventLogFilterRequestJSON,
    EventLogsResponse,
    EventLogFilterRequest
} from '@thor';
import { type HttpClient, type HttpPath } from '@http';

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
        const json = (await response.json()) as EventLogsResponseJSON;
        return {
            request: this,
            response: new EventLogsResponse(json)
        };
    }

    static of(request: EventLogFilterRequestJSON): QuerySmartContractEvents {
        return new QuerySmartContractEvents(new EventLogFilterRequest(request));
    }
}

export { QuerySmartContractEvents };
