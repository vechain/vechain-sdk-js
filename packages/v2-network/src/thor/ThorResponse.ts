import { type ThorRequest } from './ThorRequest';

export interface ThorResponse<Response> {
    request: ThorRequest;
    response: Response;
}
