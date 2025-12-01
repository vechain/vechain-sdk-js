// Forward reference to avoid circular dependency with ThorRequest
import { type HttpClient } from '@common/http';
interface ThorRequest<
    RequestClass extends ThorRequest<RequestClass, ResponseClass>,
    ResponseClass
> {
    askTo: (
        httpClient: HttpClient
    ) => Promise<ThorResponse<RequestClass, ResponseClass>>;
}

interface ThorResponse<
    RequestClass extends ThorRequest<RequestClass, ResponseClass>,
    ResponseClass
> {
    request: RequestClass;
    response: ResponseClass;
}

export { type ThorResponse };
