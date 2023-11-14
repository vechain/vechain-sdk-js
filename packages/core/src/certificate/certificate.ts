import { addressUtils } from '../address';
import { blake2b256 } from '../hash';
import { secp256k1 } from '../secp256k1';
import fastJsonStableStringify from 'fast-json-stable-stringify';
import { Buffer } from 'buffer';
import { dataUtils } from '../utils';
import { type Certificate } from './types';
import { buildError, CERTIFICATE } from '@vechainfoundation/vechain-sdk-errors';

/**
 * Deterministically encodes a certificate into a JSON string.
 * @param cert - The certificate object to be encoded.
 * @returns A JSON string representation of the certificate.
 */
function encode(cert: Certificate): string {
    return fastJsonStableStringify({
        ...cert,
        signer: cert.signer,
        signature: cert.signature
    });
}

/**
 * Verifies the validity of a certificate.
 *
 * @throws {CertificateNotSignedError, CertificateInvalidSignerError, CertificateInvalidSignatureFormatError}
 * @param cert - The certificate object with a digital signature.
 */
function verify(cert: Certificate): void {
    // No signature
    if (cert.signature === undefined || cert.signature === null) {
        throw buildError(
            CERTIFICATE.CERTIFICATE_NOT_SIGNED,
            'The certificate not signed.'
        );
    }

    // Invalid signature
    if (
        !dataUtils.isHexString(cert.signature) ||
        cert.signature.length % 2 !== 0
    ) {
        throw buildError(
            CERTIFICATE.CERTIFICATE_INVALID_SIGNATURE_FORMAT,
            'Invalid signature format.'
        );
    }

    // Encode the certificate without the signature and get signing hash
    const encoded = encode({ ...cert, signature: undefined });
    const signingHash = blake2b256(encoded);
    const pubKey = secp256k1.recover(
        signingHash,
        Buffer.from(cert.signature.slice(2), 'hex')
    );

    // Signature does not match with the signer's public key
    if (addressUtils.fromPublicKey(pubKey) !== cert.signer) {
        throw buildError(
            CERTIFICATE.CERTIFICATE_INVALID_SIGNER,
            "Signature does not match with the signer's public key."
        );
    }
}

/**
 * Exposes the certificate encoding and verification functions.
 */
export const certificate = { encode, verify };
