import type { ErrorCode } from '../types/errorTypes';

export class ErrorBase<KErrorCode extends ErrorCode, TDataType> extends Error {
    code: KErrorCode;
    message: string;
    data: TDataType;
    constructor({
        code,
        message,
        data
    }: {
        code: KErrorCode;
        message: string;
        data: TDataType;
    }) {
        super();
        this.code = code;
        this.message = message;
        this.data = data;
    }
}
