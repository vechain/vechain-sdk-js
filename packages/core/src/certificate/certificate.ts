import { CertificateSignature } from '@vechain/sdk-errors';
import fastJsonStableStringify from 'fast-json-stable-stringify';
import { Address, Hex, Txt } from '../vcdm';
import { Blake2b256 } from '../vcdm/hash/Blake2b256';
import { Secp256k1 } from '../secp256k1';
import { type Certificate } from './types';

/**
 * Encodes a certificate object to an array of bytes of its JSON representation after the following
 * normalization operations are applied:
 * * only the properties defined in the {@link Certificate} interface are evaluated;
 * * the properties are sorted in ascending alphabetic order;
 * * the key/value properties are delimited with `"`;
 * * any not meaningful blank characters are ignored;
 * * the `signer` property is a hexadecimal address represented lowercase to back compatible with the certificates
 *   not implementing the [EIP/ERC-55: Mixed-case checksum address encoding](https://eips.ethereum.org/EIPS/eip-55);
 * * the UTF-8 code is normalized according the
 *   [normalization form for canonical composition](https://en.wikipedia.org/wiki/Unicode_equivalence#Normal_forms)
 *
 * @param {Certificate} cert - The certificate object to encode.
 * @return {Uint8Array} - The byte encoded certificate.
 *
 *
 * @see {https://www.npmjs.com/package/fast-json-stable-stringify fastJsonStableStringify}
 * @see {sign}
 * @see {verify}
 */
function encode(cert: Certificate): Uint8Array {
    return Txt.of(
        // The following `fastJsonStableStringify` strips blank chars and serialize alphabetical sorted properties.
        fastJsonStableStringify({
            purpose: cert.purpose,
            payload: {
                type: cert.payload.type,
                content: cert.payload.content
            },
            domain: cert.domain,
            timestamp: cert.timestamp,
            signer: cert.signer.toLowerCase()
        })
    ).bytes;
}

/**
 * Signs a certificate using a private key.
 *
 * The signature is computed encoding the certificate according the following normalization rules:
 * * only the properties defined in the {@link Certificate} interface are evaluated;
 * * the properties are sorted in ascending alphabetic order;
 * * the key/value properties are delimited with `"`;
 * * any not meaningful blank characters are ignored;
 * * the `signer` property is a hexadecimal address represented lowercase to back compatible with the certificates
 *   not implementing the [EIP/ERC-55: Mixed-case checksum address encoding](https://eips.ethereum.org/EIPS/eip-55);
 * * the UTF-8 code is normalized according the
 *   [normalization form for canonical composition](https://en.wikipedia.org/wiki/Unicode_equivalence#Normal_forms).
 *
 * The [BLAKE2](https://en.wikipedia.org/wiki/BLAKE_(hash_function)#BLAKE2) hash is computed from the encoded
 * certificate, then the hash is signed using the [SECP256K1](https://en.bitcoin.it/wiki/Secp256k1) parameters.
 *
 * [EIP/ERC-55: Mixed-case checksum address encoding](https://eips.ethereum.org/EIPS/eip-55).
 * is supported.
 *
 * Secure audit function.
 * - {@link Blake2b256.of};
 * - {@link Secp256k1.sign}.
 *
 * @param {Certificate} cert - The certificate to be signed.
 *                             Any instance extending the {@link Certificate} interface is supported.
 * @param {Uint8Array} privateKey - The private key used for signing.
 *
 * @returns {Certificate} - A new instance of the certificate with the signature added.
 *
 * @throws {InvalidSecp256k1PrivateKey} - If the private key is invalid.
 *
 */
function sign(cert: Certificate, privateKey: Uint8Array): Certificate {
    return {
        ...cert,
        signature: Hex.of(
            Secp256k1.sign(Blake2b256.of(encode(cert)).bytes, privateKey)
        ).toString()
    };
}

/**
 * Verifies the validity of a certificate, throwing an error if the certificate is not valid.
 *
 * The certificate is valid when the signer's address computed from the signature
 * matches with the property {@link Certificate.signer}.
 *
 * This method is insensitive to the case representation of the signer's address.
 *
 * [EIP/ERC-55: Mixed-case checksum address encoding](https://eips.ethereum.org/EIPS/eip-55).
 * is supported.
 *
 * Secure audit function.
 * - {@link Blake2b256.of};
 * - {@link Secp256k1.recover}.
 *
 * @param {Certificate} cert - The certificate to verify.
 *                             Any instance extending the {@link Certificate} interface is supported.
 * @throws {CertificateSignature}
 *
 * @see {encode}
 */
function verify(cert: Certificate): void {
    // The certificate must be signed.
    if (cert.signature === undefined || cert.signature === null) {
        throw new CertificateSignature(
            'certificate.verify()',
            "Verification failed: certificate's signature is missing.",
            { cert }
        );
    }

    // Invalid hexadecimal as signature.
    // PROVISIONAL: until 1119 Certificate OOP
    if (!Hex.isValid0x(cert.signature) || cert.signature.length % 2 !== 0) {
        throw new CertificateSignature(
            'certificate.verify()',
            'Verification failed: signature format is invalid.',
            { cert }
        );
    }

    // If the signature is not a string, an exception is thrown above.
    const sign = Hex.of(cert.signature).bytes;
    const hash = Blake2b256.of(encode(cert)).bytes;
    // The signer address is compared in lowercase to avoid
    const signer = Address.ofPublicKey(Secp256k1.recover(hash, sign))
        .toString()
        .toLowerCase();

    // The signer's must match the signer property of certificate.
    if (signer !== cert.signer?.toLowerCase()) {
        throw new CertificateSignature(
            'certificate.verify()',
            "Verification failed: signature does not correspond to the signer's public key.",
            { cert }
        );
    }
}

/**
 * Exposes the certificate sign and verification functions.
 */
export const certificate = { encode, sign, verify };
