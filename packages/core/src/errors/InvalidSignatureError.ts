import { VeChainSDKError } from './VeChainSDKError';

/**
 * Represents an error that is thrown when the signature validation fails.
 * This class extends the VeChainSDKError to provide more context specific
 * to invalid signatures encountered in the Vechain SDK operations.
 *
 * Typically, this error is used to signal issues with cryptographic
 * signatures, such as mismatches, invalid formatting, or general
 * verification failures.
 *
 * Developers can catch this error to handle signature-related problems
 * programmatically within the context of applications using the SDK.
 */
class InvalidSignatureError extends VeChainSDKError {}

export { InvalidSignatureError };
