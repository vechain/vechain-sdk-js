import { type HttpPath } from './HttpPath';

export interface HttpClient {
    get: (httpPath: HttpPath) => Promise<Response>;
}
