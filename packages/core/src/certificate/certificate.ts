import { addressUtils } from '../address';
import { blake2b256 } from '../hash';
import { secp256k1 } from '../secp256k1';
import fastJsonStableStringify from 'fast-json-stable-stringify';
import { Buffer } from 'buffer';
import { Hex0x } from '../utils';
import { type Certificate } from './types';
import { assert, CERTIFICATE } from '@vechain/sdk-errors';

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
    assert(
        'verify',
        cert.signature !== undefined && cert.signature !== null,
        CERTIFICATE.CERTIFICATE_NOT_SIGNED,
        "Verification failed: Certificate's signature is missing.",
        { cert }
    );

    // Invalid signature
    assert(
        'verify',
        Hex0x.isValid(cert.signature as string, false, true),
        CERTIFICATE.CERTIFICATE_INVALID_SIGNATURE_FORMAT,
        'Verification failed: Signature format is invalid.',
        { cert }
    );

    // Encode the certificate without the signature and get signing hash
    const encoded = encode({ ...cert, signature: undefined });
    const signingHash = blake2b256(encoded);
    const pubKey = secp256k1.recover(
        Buffer.from(signingHash),
        Buffer.from((cert.signature as string).slice(2), 'hex')
    );

    // Signature does not match with the signer's public key
    assert(
        'verify',
        addressUtils.fromPublicKey(pubKey) === cert.signer,
        CERTIFICATE.CERTIFICATE_INVALID_SIGNER,
        "Verification failed: Signature does not correspond to the signer's public key.",
        { pubKey, cert }
    );
}

/**
 * Exposes the certificate encoding and verification functions.
 */
export const certificate = { encode, verify };
