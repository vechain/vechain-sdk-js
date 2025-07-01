import { VeChainSDKError } from './VeChainSDKError';

/**
 * Represents an error that is thrown when ABI decoding fails due to an invalid type.
 *
 * This error is a specialized subclass of `VeChainSDKError` and is used to
 * indicate that a problem occurred during the ABI decoding process caused by
 * an unsupported or incorrect type.
 *
 * Use this error to handle scenarios where ABI decoding cannot proceed because
 * the provided type does not conform to expected ABI specifications.
 */
class InvalidAbiDecodingTypeError extends VeChainSDKError {}

export { InvalidAbiDecodingTypeError };
