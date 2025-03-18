import { VeChainSDKError } from './VeChainSDKError';

/**
 * Represents an error that is thrown when a specific ABI function cannot be found.
 * This error is used to signal issues related to missing or undefined ABI function definitions
 * within the VeChain SDK.
 *
 * AbiFunctionNotFoundError extends the base class VeChainSDKError to provide
 * more specific context about the nature of the error.
 */
class AbiFunctionNotFoundError extends VeChainSDKError {}

export { AbiFunctionNotFoundError };
