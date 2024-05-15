import * as utils from '@noble/curves/abstract/utils';
import fastJsonStableStringify from 'fast-json-stable-stringify';
import { Hex, Hex0x } from '../utils';
import { addressUtils } from '../address';
import { assert, buildError, CERTIFICATE } from '@vechain/sdk-errors';
import { blake2b256 } from '../hash';
import { secp256k1 } from '../secp256k1';
import { type Certificate } from './types';

/**
 * Encodes a certificate object to a JSON string.
 *
 * The JSON representation of the signer's address is represented according the
 * [EIP/ERC-55: Mixed-case checksum address encoding](https://eips.ethereum.org/EIPS/eip-55).
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
 * @see {verify}
 */
function encode(cert: Certificate): string {
    return fastJsonStableStringify({
        ...cert,
        signer: addressUtils.toERC55Checksum(cert.signer),
        signature: cert.signature
    });
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
 * - {@link blake2b256};
 * - {@link certificate.encode};
 * - {@link secp256k1.recover}.
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
 * to extract its signer 's address and compare it with the address derioved from the public key recovered from the
 * certificate using the
 * [BLAKE2](https://en.wikipedia.org/wiki/BLAKE_(hash_function)#BLAKE2)
 * hash of its JSON encoded representation.
 *
 * @see {encode}
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
    try {
        // The `encode` method could throw `InvalidAddressError`.
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
export const certificate = { encode, verify };
