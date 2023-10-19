import type { DataType, ErrorCode, ErrorType } from '../types/errorTypes';

import { ErrorClassMap } from '../types/errorTypes';

export function buildError<
    KErrorCode extends ErrorCode,
    SDataType extends DataType<KErrorCode>
>(code: KErrorCode, message: string, data: SDataType): ErrorType<KErrorCode> {
    const ErrorClass = ErrorClassMap.get(code);

    if (ErrorClass === undefined || ErrorClass === null) {
        throw new Error('Invalid error code');
    }
    const error = new ErrorClass({ code, message, data });

    return error as ErrorType<KErrorCode>;
}
