import { buildError, type ErrorType, RLP } from '@vechain-sdk/errors';

/**
 * Create a context-aware RLP error.
 * @param context - Contextual information for enhanced error detail.
 * @param message - Descriptive error message.
 * @returns An Error object tailored for RLP issues.
 */
const createRlpError = (
    context: string,
    message: string
): ErrorType<RLP.INVALID_RLP> => {
    return buildError(RLP.INVALID_RLP, message, { context });
};

export { createRlpError };
