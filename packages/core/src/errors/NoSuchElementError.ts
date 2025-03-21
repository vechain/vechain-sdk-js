import { VeChainSDKError } from './VeChainSDKError';

/**
 * The NoSuchElementError class represents an error that is thrown when attempting
 * to access an element that does not exist or cannot be found. It extends the
 * VeChainSDKError, providing a specific error type for scenarios where an
 * expected element is missing within the VeChain SDK context.
 *
 * This error is useful for handling cases where operations depend on the
 * presence of an element or resource, and it is not available.
 *
 * Extends:
 * VeChainSDKError
 */
class NoSuchElementError extends VeChainSDKError {}

export { NoSuchElementError };
