import { VeChainSDKError } from './VeChainSDKError';

/**
 * Represents an error that is thrown when an invalid password is encountered.
 *
 * This error is typically used to indicate that the provided password does not
 * meet the required criteria or is otherwise incorrect.
 *
 * Extends the VeChainSDKError to provide more context-specific error handling
 * related to password validation failures.
 *
 * The class can be used in scenarios where user authentication or password
 * verification is required.
 */
class InvalidPasswordError extends VeChainSDKError {}

export { InvalidPasswordError };
