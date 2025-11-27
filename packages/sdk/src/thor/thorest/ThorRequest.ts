import { type HttpClient } from '@common/http';

// Forward reference to avoid circular dependency with ThorResponse
interface ThorResponse<
    RequestClass extends ThorRequest<RequestClass, ResponseClass>,
    ResponseClass
> {
    request: RequestClass;
    response: ResponseClass;
}

interface ThorRequest<
    RequestClass extends ThorRequest<RequestClass, ResponseClass>,
    ResponseClass
> {
    askTo: (
        httpClient: HttpClient
    ) => Promise<ThorResponse<RequestClass, ResponseClass>>;
}

export { type ThorRequest };
