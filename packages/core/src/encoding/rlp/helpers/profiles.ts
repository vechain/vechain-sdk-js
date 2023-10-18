import { ERRORS } from '../../../utils';

/**
 * Create a context-aware RLP error.
 * @param context - Contextual information for enhanced error detail.
 * @param message - Descriptive error message.
 * @returns An Error object tailored for RLP issues.
 */
const createRlpError = (context: string, message: string): Error => {
    return new Error(ERRORS.RLP.INVALID_RLP(context, message));
};

export { createRlpError };
