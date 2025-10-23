import { VeChainSDKError } from './VeChainSDKError';

/**
 * Error thrown when a transaction field is invalid or missing.
 */
class InvalidTransactionField extends VeChainSDKError {
    /**
     * Creates a new InvalidTransactionField instance.
     *
     * @param fqn - Fully qualified name of the function throwing the error
     * @param message - The error message describing what's wrong
     * @param args - Optional additional context
     * @param cause - Optional underlying cause
     */
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(
        fqn: string,
        message: string,
        args?: Record<string, unknown>,
        cause?: Error
    ) {
        super(fqn, message, args, cause);
    }
}

export { InvalidTransactionField };
