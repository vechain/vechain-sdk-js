import type { DataType, ErrorCode, ErrorType } from '../types/errorTypes';

import { ErrorClassMap } from '../types/errorTypes';

export function buildError<
    ErrorCodeT extends ErrorCode,
    DataTypeT extends DataType<ErrorCodeT>
>(code: ErrorCodeT, message: string, data: DataTypeT): ErrorType<ErrorCodeT> {
    const ErrorClass = ErrorClassMap.get(code);

    if (ErrorClass === undefined || ErrorClass === null) {
        throw new Error('Invalid error code');
    }
    const error = new ErrorClass({ code, message, data });

    return error as ErrorType<ErrorCodeT>;
}
