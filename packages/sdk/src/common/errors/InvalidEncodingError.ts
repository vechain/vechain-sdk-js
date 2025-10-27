import { VeChainSDKError } from './VeChainSDKError';

/**
 * Represents an error thrown when an invalid encoding is detected.
 *
 * This error is used to indicate that the encoding provided or encountered is not recognized
 * or supported in the given context. It extends the VeChainSDKError, which is a base class
 * for errors specific to the VeChain SDK.
 *
 * Typically, this error should help pinpoint issues related to data encoding during operations
 * such as parsing or data transformation within the SDK.
 */
class InvalidEncodingError extends VeChainSDKError {}

export { InvalidEncodingError };
