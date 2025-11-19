"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateSignatureMismatch = void 0;
const sdk_error_1 = require("../sdk-error");
/**
 * Certificate Signature error.
 *
 * WHEN TO USE:
 * * This error will be thrown when the certificate signature is invalid
 * OR the certificate is not signed, or has in general signature errors.
 */
class CertificateSignatureMismatch extends sdk_error_1.VechainSDKError {
}
exports.CertificateSignatureMismatch = CertificateSignatureMismatch;
