import { type HttpClient } from '../http';
import { type ThorResponse } from './ThorResponse';

interface ThorRequest<
    RequestClass extends ThorRequest<RequestClass, ResponseClass>,
    ResponseClass
> {
    askTo: (
        httpClient: HttpClient
    ) => Promise<ThorResponse<RequestClass, ResponseClass>>;
}

export { type ThorRequest };
