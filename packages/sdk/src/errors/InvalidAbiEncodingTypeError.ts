import { VeChainSDKError } from './VeChainSDKError';

/**
 * Represents an error that occurs when there is an invalid ABI encoding type encountered.
 * This error is a specific type of VeChainSDKError and is used to indicate issues
 * with ABI encoding within the VeChain SDK.
 *
 * Extends the base VeChainSDKError class to provide detailed context and handling
 * for encoding-related errors.
 *
 * This class is typically used internally within the SDK to signal
 * that a provided ABI encoding type is not recognized or supported.
 */
class InvalidAbiEncodingTypeError extends VeChainSDKError {}

export { InvalidAbiEncodingTypeError };
