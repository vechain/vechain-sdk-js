import * as utils from '@noble/curves/abstract/utils';
import fastJsonStableStringify from 'fast-json-stable-stringify';
import { Hex, Hex0x } from '../utils';
import { addressUtils } from '../address';
import { assert, CERTIFICATE } from '@vechain/sdk-errors';
import { blake2b256 } from '../hash';
import { secp256k1 } from '../secp256k1';
import { type Certificate } from './types';

/**
 * Encodes a certificate object to a JSON string.
 *
 * @param {Certificate} cert - The certificate object to encode.
 * @return {string} - The encoded JSON string.
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
 * Secure audit function.
 * - {@link blake2b256}.
 *
 * @param {Certificate} cert - The certificate to verify.
 *
 * @returns {void} - No return value.
 *
 * @throws CertificateInvalidSignatureFormatError - If  the certificate signature's is not a valid hexadecimal expression prefixed with `0x`.
 * @throws CertificateNotSignedError - If the certificate is not signed.
 * @throws CertificateInvalidSignerError - If the certificate's signature's doesn't match with the signer;s public key.
 */
function verify(cert: Certificate): void {
    // No signature.
    assert(
        'certificate.verify',
        cert.signature !== undefined && cert.signature !== null,
        CERTIFICATE.CERTIFICATE_NOT_SIGNED,
        "Verification failed: certificate's signature is missing.",
        { cert }
    );
    // Invalid hexadecimal as signature.
    assert(
        'certificate.verify',
        Hex0x.isValid(cert.signature as string, false, true),
        CERTIFICATE.CERTIFICATE_INVALID_SIGNATURE_FORMAT,
        'Verification failed: signature format is invalid.',
        { cert }
    );
    // Encode the certificate without the signature and get signing hash.
    const encoded = encode({ ...cert, signature: undefined });
    const signingHash = blake2b256(encoded);
    const pubKey = secp256k1.recover(
        signingHash,
        utils.hexToBytes(Hex.canon(cert.signature as string))
    );
    // Signature does not match with the signer's public key.
    assert(
        'certificate.verify',
        addressUtils.fromPublicKey(pubKey).toLowerCase() ===
            cert.signer.toLowerCase(),
        CERTIFICATE.CERTIFICATE_INVALID_SIGNER,
        "Verification failed: signature does not correspond to the signer's public key.",
        { pubKey, cert }
    );
}

/**
 * Exposes the certificate encoding and verification functions.
 */
export const certificate = { encode, verify };
