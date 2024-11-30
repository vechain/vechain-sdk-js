import { type HttpClient } from '../http';

export interface ThorRequest {
    askTo: (httpClient: HttpClient) => Promise<unknown>;
}
