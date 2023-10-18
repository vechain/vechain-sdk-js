import type { DataType, ErrorCode, ErrorType } from '../types/errorTypes';

import { ErrorClassMap } from '../types/errorTypes';

export function buildError<K extends ErrorCode, S extends DataType<K>>(
    code: K,
    message: string,
    data: S
): ErrorType<K> {
    const ErrorClass = ErrorClassMap.get(code);

    if (ErrorClass === undefined || ErrorClass === null) {
        throw new Error('Invalid error code');
    }
    const error = new ErrorClass({ code, message, data });

    return error as ErrorType<K>;
}
