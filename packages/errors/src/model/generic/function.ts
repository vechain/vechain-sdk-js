import { type DefaultErrorData } from '../../types';
import { ErrorBase } from '../base';

/**
 * Not implemented function
 */
class NotImplementedError extends ErrorBase<
    FUNCTION.NOT_IMPLEMENTED,
    DefaultErrorData
> {}

/**
 * Errors enum.
 */
enum FUNCTION {
    NOT_IMPLEMENTED = 'NOT_IMPLEMENTED'
}

export { NotImplementedError, FUNCTION };
