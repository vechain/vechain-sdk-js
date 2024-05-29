import { ErrorBase } from '../base';

/**
 * Invalid RLP_ERRORS error data interface.
 */
interface InvalidRLPErrorData {
    context: string;
}

/**
 * Invalid RLP_ERRORS error to be thrown when an invalid RLP_ERRORS is detected.
 */
class InvalidRLPError extends ErrorBase<
    RLP_ERRORS.INVALID_RLP,
    InvalidRLPErrorData
> {}

/**
 * Errors enum.
 */
enum RLP_ERRORS {
    INVALID_RLP = 'INVALID_RLP'
}

export { InvalidRLPError, type InvalidRLPErrorData, RLP_ERRORS };
