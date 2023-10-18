import type { ErrorCode } from '../types/errorTypes';

export class ErrorBase<T extends ErrorCode, K> extends Error {
    code: T;
    message: string;
    data: K;
    constructor({
        code,
        message,
        data
    }: {
        code: T;
        message: string;
        data: K;
    }) {
        super();
        this.code = code;
        this.message = message;
        this.data = data;
    }
}
