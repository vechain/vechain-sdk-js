import { type HttpPath } from './HttpPath';
import { type HttpQuery } from './HttpQuery';

export interface HttpClient {
    get: (httpPath: HttpPath, httpQuery: HttpQuery) => Promise<Response>;
}
