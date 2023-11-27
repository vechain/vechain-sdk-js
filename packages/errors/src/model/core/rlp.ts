import { ErrorBase } from '../base';

/**
 * Invalid RLP error data interface.
 */
interface InvalidRLPErrorData {
    context: string;
}

/**
 * Invalid RLP error to be thrown when an invalid RLP is detected.
 */
class InvalidRLPError extends ErrorBase<RLP.INVALID_RLP, InvalidRLPErrorData> {}

/**
 * Errors enum.
 */
enum RLP {
    INVALID_RLP = 'INVALID_RLP'
}
export { InvalidRLPError, type InvalidRLPErrorData, RLP };
