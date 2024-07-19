import { VechainSDKError } from '../sdk-error';
import { type ObjectErrorData } from '../types';

/**
 * Certificate Signature error.
 *
 * WHEN TO USE:
 * * This error will be thrown when the certificate signature is invalid
 * OR the certificate is not signed, or has in general signature errors.
 */
class CertificateSignature extends VechainSDKError<ObjectErrorData> {}

export { CertificateSignature };
