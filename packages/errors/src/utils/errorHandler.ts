import type { DataType, ErrorCode, ErrorType } from '../types';
import { buildError } from './errorBuilder';

export function throwError<
    ErrorCodeT extends ErrorCode,
    DataTypeT extends DataType<ErrorCodeT>
>(code: ErrorCodeT, message: string, data?: DataTypeT): ErrorType<ErrorCodeT> {
    throw buildError(code, message, data); // eslint-disable-line @typescript-eslint/no-throw-literal
}
