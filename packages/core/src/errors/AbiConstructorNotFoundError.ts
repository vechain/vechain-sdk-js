import { VeChainSDKError } from './VeChainSDKError';

/**
 * Represents an error that occurs when a constructor is not found in the ABI (Application Binary Interface).
 * This error is typically thrown when attempting to interact with or deploy a contract for which the constructor
 * is either missing or improperly defined in the provided ABI.
 *
 * AbiConstructorNotFoundError extends VeChainSDKError, inheriting mechanisms for error reporting
 * and stack trace capture. Use this error to identify cases where ABI misconfiguration is causing issues.
 *
 * It is recommended to ensure that the ABI definition supplied during contract interaction contains
 * valid and complete constructor information to avoid triggering this error.
 */
class AbiConstructorNotFoundError extends VeChainSDKError {}

export { AbiConstructorNotFoundError };
