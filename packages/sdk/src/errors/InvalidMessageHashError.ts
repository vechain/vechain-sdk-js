import { VeChainSDKError } from './VeChainSDKError';

/**
 * Represents an error that is thrown when a message hash is invalid or does not meet the required criteria.
 *
 * This class extends the `VeChainSDKError` to provide more context for errors related to message hash validation.
 *
 * Common use cases for this error include:
 * - Verifying a message hash format or integrity.
 * - Handling application-specific validation failures for hash-based operations.
 *
 * Instances of `InvalidMessageHashError` are typically created and thrown internally by the SDK
 * when a provided message hash is detected to be problematic.
 */
class InvalidMessageHashError extends VeChainSDKError {}

export { InvalidMessageHashError };
