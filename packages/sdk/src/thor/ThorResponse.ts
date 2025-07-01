import { type ThorRequest } from './ThorRequest';

interface ThorResponse<
    RequestClass extends ThorRequest<RequestClass, ResponseClass>,
    ResponseClass
> {
    request: RequestClass;
    response: ResponseClass;
}

export { type ThorResponse };
