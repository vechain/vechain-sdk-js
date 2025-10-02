import { VeChainSDKError } from './VeChainSDKError';

/**
 * Error thrown when a contract call fails.
 */
class ContractCallError extends VeChainSDKError {
    /**
     * Creates a new ContractCallError instance.
     *
     * @param fqn - Fully qualified name of the function throwing the error
     * @param message - The error message describing the failure
     * @param args - Optional additional context
     * @param cause - Optional underlying cause
     */
    constructor(
        fqn: string,
        message: string,
        args?: Record<string, unknown>,
        cause?: Error
    ) {
        super(fqn, message, args, cause);
    }
}

export { ContractCallError };
