import type { DefaultErrorData } from '../types';
import { ErrorBase } from './base';

/**
 * Certificate not signed.
 *
 * @param code - The error code from the error types enum.
 * @param message - The error message.
 * @param data - The error data.
 * @returns The error object.
 */
class CertificateNotSignedError extends ErrorBase<
    CERTIFICATE.CERTIFICATE_NOT_SIGNED,
    DefaultErrorData
> {}

/**
 * Certificate signature format is invalid.
 *
 * @param code - The error code from the error types enum.
 * @param message - The error message.
 * @param data - The error data.
 * @returns The error object.
 */
class CertificateInvalidSignatureFormatError extends ErrorBase<
    CERTIFICATE.CERTIFICATE_INVALID_SIGNATURE_FORMAT,
    DefaultErrorData
> {}

/**
 * Certificate signer is invalid.
 *
 * @param code - The error code from the error types enum.
 * @param message - The error message.
 * @param data - The error data.
 * @returns The error object.
 */
class CertificateInvalidSignerError extends ErrorBase<
    CERTIFICATE.CERTIFICATE_INVALID_SIGNER,
    DefaultErrorData
> {}

/**
 * Errors enum.
 *
 * @public
 */
enum CERTIFICATE {
    CERTIFICATE_NOT_SIGNED = 'CERTIFICATE_NOT_SIGNED',
    CERTIFICATE_INVALID_SIGNATURE_FORMAT = 'CERTIFICATE_INVALID_SIGNATURE_FORMAT',
    CERTIFICATE_INVALID_SIGNER = 'CERTIFICATE_INVALID_SIGNER'
}

export {
    CertificateNotSignedError,
    CertificateInvalidSignatureFormatError,
    CertificateInvalidSignerError,
    CERTIFICATE
};
