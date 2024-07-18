import { VechainSDKError } from '../sdk-error';
import { type ObjectErrorData } from '../types';

/**
 * Error to be thrown when a certificate is not signed or has in general signature errors.
 */
class CertificateSignature extends VechainSDKError<ObjectErrorData> {}

export { CertificateSignature };
