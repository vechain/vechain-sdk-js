import { address } from '../address';
import { blake2b256 } from '../hash';
import { secp256k1 } from '../secp256k1';
import fastJsonStableStringify from 'fast-json-stable-stringify';
import { Buffer } from 'buffer';

/**
 * Represents a client-side self-signed certificate.
 */
export interface Certificate {
    purpose: string; // The purpose of the certificate.
    payload: {
        type: string; // The type of payload.
        content: string; // The content of the payload.
    };
    domain: string; // The domain for which the certificate is issued.
    timestamp: number; // The timestamp when the certificate was created.
    signer: string; // The public key of the signer.
    signature?: string; // The digital signature of the certificate (optional).
}

/**
 * Converts a string to lowercase safely. If the input is not a string, it's returned as is.
 * @param str - The string to be converted to lowercase.
 */

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
 * @param cert - The certificate object with a digital signature.
 * @throws {Error} If the signature is missing, invalid, or doesn't match the signer's public key.
 */
function verify(cert: Certificate): void {
    if (cert.signature == null) {
        throw new Error('Signature is missing.');
    }

    const { signature } = cert;
    if (!/^0x[0-9a-f]+$/i.test(signature) || signature.length % 2 !== 0) {
        throw new Error('Invalid signature format.');
    }

    const encoded = encode({ ...cert, signature: undefined });
    const signingHash = blake2b256(encoded);
    const pubKey = secp256k1.recover(
        signingHash,
        Buffer.from(signature.slice(2), 'hex')
    );

    if (address.fromPublicKey(pubKey) !== cert.signer) {
        throw new Error(
            "Signature does not match with the signer's public key."
        );
    }
}

/**
 * Exposes the certificate encoding and verification functions.
 */
export const certificate = { encode, verify };
