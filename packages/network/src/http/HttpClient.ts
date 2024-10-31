import { type HttpMethod } from './HttpMethod';
import { type HttpParams } from './HttpParams';

export interface HttpClient {
    baseURL: string;
    get: (path: string, params?: HttpParams) => Promise<unknown>;
    http: (
        method: HttpMethod,
        path: string,
        params?: HttpParams
    ) => Promise<unknown>;
    post: (path: string, params?: HttpParams) => Promise<unknown>;
}
