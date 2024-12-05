import { type ThorRequest } from './ThorRequest';

export interface ThorResponse<
    RequestClass extends ThorRequest<RequestClass, ResponseClass>,
    ResponseClass
> {
    request: RequestClass;
    response: ResponseClass;
}
