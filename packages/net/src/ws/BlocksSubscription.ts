import { type HttpPath } from '../http';

class BlocksSubscription {
    static readonly PATH: HttpPath = { path: '/subscriptions/block' };

    readonly baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    close(): this {
        return this;
    }

    open(): this {
        return this;
    }
}

export { BlocksSubscription };
