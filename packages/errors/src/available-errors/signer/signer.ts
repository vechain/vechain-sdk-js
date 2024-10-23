import { VechainSDKError } from '../sdk-error';
import { type ObjectErrorData } from '../types';

/**
 * Signer method error.
 *
 * WHEN TO USE:
 * * This error will be thrown when a signer method has failed.
 */
class SignerMethodError extends VechainSDKError<ObjectErrorData> {}

export { SignerMethodError };
