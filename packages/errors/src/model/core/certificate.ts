import { type DefaultErrorData } from '../../types';
import { ErrorBase } from '../base';

/**
 * Certificate not signed.
 */
class CertificateNotSignedError extends ErrorBase<
    CERTIFICATE.CERTIFICATE_NOT_SIGNED,
    DefaultErrorData
> {}

/**
 * Certificate signature format is invalid.
 */
class CertificateInvalidSignatureFormatError extends ErrorBase<
    CERTIFICATE.CERTIFICATE_INVALID_SIGNATURE_FORMAT,
    DefaultErrorData
> {}

/**
 * Certificate signer is invalid.
 */
class CertificateInvalidSignerError extends ErrorBase<
    CERTIFICATE.CERTIFICATE_INVALID_SIGNER,
    DefaultErrorData
> {}

/**
 * Errors enum.
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
