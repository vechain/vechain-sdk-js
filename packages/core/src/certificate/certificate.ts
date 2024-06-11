import fastJsonStableStringify from 'fast-json-stable-stringify';
import { Hex, Hex0x } from '../utils';
import { addressUtils } from '../address';
import { assert, buildError, CERTIFICATE } from '@vechain/sdk-errors';
import { blake2b256 } from '../hash';
import { hexToBytes } from '@noble/curves/abstract/utils';
import { secp256k1 } from '../secp256k1';
import { type Certificate } from './types';

const TEXT_ENCODER = new TextEncoder();

function _encode(cert: Certificate): Uint8Array {
    return TEXT_ENCODER.encode(
        // The following `fastJsonStableStringify` strips blank chars and serialize alphabtically sorted properties.
        fastJsonStableStringify({
            purpose: cert.purpose,
            payload: {
                type: cert.payload.type,
                content: cert.payload.content
            },
            domain: cert.domain,
            timestamp: cert.timestamp,
            signer: addressUtils.toERC55Checksum(cert.signer)
        }).normalize('NFC')
    );
}

function _sign(cert: Certificate, privateKey: Uint8Array): Certificate {
    return {
        ...cert,
        signature: Hex0x.of(
            secp256k1.sign(blake2b256(_encode(cert)), privateKey)
        )
    };
}

function _verify(cert: Certificate): void {
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
    const sign = hexToBytes(Hex.canon(cert.signature as string));
    const hash = blake2b256(_encode(cert));
    const signer = addressUtils
        .fromPublicKey(secp256k1.recover(hash, sign))
        .toLowerCase();
    assert(
        'certificate.verify',
        signer === cert.signer?.toLowerCase(),
        CERTIFICATE.CERTIFICATE_INVALID_SIGNER,
        "Verification failed: signature does not correspond to the signer's public key.",
        { cert }
    );
}

/**
 * Encodes a certificate object to a JSON string with the following aspects enforced:
 * * `"` is used to delimit keys and values,
 * * not meaningful blank characters are removed,
 * * properties are sorted according their keys in ascending alphabetic order,
 * * the address of the signer is represented according the
 * [EIP/ERC-55: Mixed-case checksum address encoding](https://eips.ethereum.org/EIPS/eip-55),
 * * only the properties of {@link Certificate} interface are encoded, extended properties are ignored.
 *
 * Secure audit function.
 * - {@link addressUtils.toERC55Checksum}
 *
 * @param {Certificate} cert - The certificate object to encode.
 * @return {string} - The encoded JSON string.
 *
 * @throws {InvalidAddressError} if `address` is not a valid hexadecimal
 * representation 40 digits long, prefixed with `0x`.
 *
 * @see [json-fast-stable-stringify](https://www.npmjs.com/package/json-stable-stringify)
 * @see {verify}
 */
function encode(cert: Certificate): string {
    // The following `fastJsonStableStringify` strips blank chars and serialize alphabtically sorted properties.
    return fastJsonStableStringify({
        purpose: cert.purpose,
        payload: {
            type: cert.payload.type,
            content: cert.payload.content
        },
        domain: cert.domain,
        timestamp: cert.timestamp,
        signer: addressUtils.toERC55Checksum(cert.signer),
        signature: cert.signature
    });
}

/**
 * Matches a certificate against a given address and signature.
 *
 * This method is insensitive to the case representation of the signer's address.
 *
 * [EIP/ERC-55: Mixed-case checksum address encoding](https://eips.ethereum.org/EIPS/eip-55).
 * is supported.
 *
 * Secure audit function.
 * - {@link blake2b256};
 * - {@link secp256k1.recover}.
 *
 * @param {Uint8Array} cert - The certificate to match. computed from the certificate without the `signature` property.
 * @param {string} address - The address to match against, optionally prefixed with `0x`.
 * @param {string} signature - The signature to verify expressed in hexadecimal form, optionally prefixed with `0x`.
 *
 * @returns {void} - No return value.
 *
 * @throws CertificateInvalidSignatureFormatError - If  the certificate signature's is not a valid hexadecimal expression prefixed with `0x`.
 * @throws CertificateNotSignedError - If the certificate is not signed.
 * @throws CertificateInvalidSignerError - If the certificate's signature's doesn't match with the signer;s public key.
 *
 */
function match(cert: Uint8Array, address: string, signature: string): void {
    // Invalid hexadecimal as signature.
    assert(
        'certificate.match',
        Hex0x.isValid(signature, true, true),
        CERTIFICATE.CERTIFICATE_INVALID_SIGNATURE_FORMAT,
        'Verification failed: signature format is invalid.',
        { signature }
    );
    try {
        // The `encode` method could throw `InvalidAddressError`.
        const signingHash = blake2b256(cert, 'buffer');
        const signingPublicKey = secp256k1.recover(
            signingHash,
            hexToBytes(Hex.canon(signature))
        );
        const signingAddress = addressUtils.fromPublicKey(signingPublicKey);
        // Signature does not match with the signer's public key.
        assert(
            'certificate.match',
            signingAddress.toLowerCase() === address.toLowerCase(),
            CERTIFICATE.CERTIFICATE_INVALID_SIGNER,
            "Verification failed: signature does not correspond to the signer's public key.",
            { pubKey: signingPublicKey, cert }
        );
    } catch (e) {
        throw buildError(
            'certificate.match',
            CERTIFICATE.CERTIFICATE_INVALID_SIGNER,
            (e as Error).message,
            { address, certificate: cert, signature },
            e
        );
    }
}

/**
 * Verifies the validity of a certificate.
 *
 * This method is insensitive to the case representation of the signer's address.
 *
 * [EIP/ERC-55: Mixed-case checksum address encoding](https://eips.ethereum.org/EIPS/eip-55).
 * is supported.
 *
 * Secure audit function.
 * - {@link certificate.encode};
 * - {@link match}.
 *
 * @param {Certificate} cert - The certificate to verify.
 *
 * @returns {void} - No return value.
 *
 * @throws CertificateInvalidSignatureFormatError - If  the certificate signature's is not a valid hexadecimal expression prefixed with `0x`.
 * @throws CertificateNotSignedError - If the certificate is not signed.
 * @throws CertificateInvalidSignerError - If the certificate's signature's doesn't match with the signer;s public key.
 *
 * @remark This methods {@link certificate.encode} the `cert` instance
 * to extract its signer 's address and compare it with the address computed from the public key recovered from the
 * certificate using the
 * [BLAKE2](https://en.wikipedia.org/wiki/BLAKE_(hash_function)#BLAKE2)
 * hash of its JSON encoded representation.
 *
 * @see {encode}
 * @see {match}
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
    try {
        // Encode the certificate without the signature.
        // const encoded = new TextEncoder().encode(
        //     certificate
        //         .encode({ ...cert, signature: undefined })
        //         .normalize('NFC')
        // );
        const encoded = _encode({ ...cert, signature: undefined });
        match(encoded, cert.signer, cert.signature as string);
    } catch (e) {
        throw buildError(
            'certificate.verify',
            CERTIFICATE.CERTIFICATE_INVALID_SIGNER,
            (e as Error).message,
            { cert },
            e
        );
    }
}

/**
 * Exposes the certificate encoding and verification functions.
 */
export const certificate = { _sign, _verify, _encode, encode, match, verify };
