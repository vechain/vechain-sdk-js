import { VeChainSDKError } from './VeChainSDKError';

/**
 * The `AbiEventNotFoundError` class represents an error that is thrown when an ABI (Application Binary Interface) event
 * is not found within a contract's ABI definition.
 *
 * This error is a subclass of `VeChainSDKError` and is specifically intended for use within the VeChain SDK to handle
 * scenarios where an event specified in a request or function call does not exist in the provided ABI.
 *
 * Use this error to clearly indicate issues related to missing or invalid event definitions in ABI when working with
 * VeChain blockchain interactions.
 */
class AbiEventNotFoundError extends VeChainSDKError {}

export { AbiEventNotFoundError };
