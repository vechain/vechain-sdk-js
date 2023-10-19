import type { ErrorCode } from '../types/errorTypes';

export class ErrorBase<ErrorCodeT extends ErrorCode, DataTypeT> extends Error {
    code: ErrorCodeT;
    message: string;
    data: DataTypeT;
    constructor({
        code,
        message,
        data
    }: {
        code: ErrorCodeT;
        message: string;
        data: DataTypeT;
    }) {
        super();
        this.code = code;
        this.message = message;
        this.data = data;
    }
}
