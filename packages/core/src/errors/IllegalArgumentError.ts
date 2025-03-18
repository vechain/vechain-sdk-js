import { VeChainSDKError } from './VeChainSDKError';

/**
 * Represents an error that occurs when an illegal or invalid argument is passed to a method or function.
 * This class extends the VeChainSDKError class, providing additional context for argument-related issues in the SDK.
 *
 * Typically thrown during runtime when a method receives an argument that does not meet expected criteria
 * such as type, format, or value constraints.
 *
 * Use this class to clearly indicate argument-related errors in your application or SDK operations.
 */
class IllegalArgumentError extends VeChainSDKError {}

export { IllegalArgumentError };
