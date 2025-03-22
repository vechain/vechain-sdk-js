import { VeChainSDKError } from './VeChainSDKError';

/**
 * Represents an error that occurs when there is an issue with a keystore.
 * This class extends the `VeChainSDKError` class, indicating it is a
 * specialized error related to handling or processing keystore files
 * or data structures.
 *
 * Typically, this error is used to signal invalid configurations,
 * corrupted data, or other issues that prevent the successful operation
 * of a keystore within the VeChain SDK.
 */
class InvalidKeystoreError extends VeChainSDKError {}

export { InvalidKeystoreError };
