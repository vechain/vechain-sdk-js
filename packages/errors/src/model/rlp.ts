import type { RLP } from '../types';
import { ErrorBase } from './base';

interface InvalidRLPErrorData {
    context: string;
}

/**
 * Invalid RLP error to be thrown when an invalid RLP is detected.
 * @param code - The error code from the error types enum.
 * @param message - The error message.
 * @param data - The error data.
 * @returns The error object.
 */
class InvalidRLPError extends ErrorBase<RLP.INVALID_RLP, InvalidRLPErrorData> {}

export { InvalidRLPError, type InvalidRLPErrorData };
