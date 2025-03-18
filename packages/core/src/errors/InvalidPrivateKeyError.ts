import { VeChainSDKError } from './VeChainSDKError';

/**
 * Represents an error that is thrown when a provided private key is invalid.
 *
 * This error class extends the generic `VeChainSDKError` and is used specifically
 * to signal issues related to an incorrect or malformed private key during operations
 * that require a valid private key.
 *
 * Example scenarios where this error might be thrown include:
 * - When attempting to sign a transaction with an improperly formatted private key.
 * - When the private key fails validation checks during initialization.
 *
 * Extends:
 * - VeChainSDKError
 */
class InvalidPrivateKeyError extends VeChainSDKError {}

export { InvalidPrivateKeyError };
