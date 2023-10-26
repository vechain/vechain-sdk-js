import { address } from '../address';
import { blake2b256 } from '../hash';
import { secp256k1 } from '../secp256k1';
import fastJsonStableStringify from 'fast-json-stable-stringify';
import { Buffer } from 'buffer';

/**
 * Client side self-signed certificate
 */
export interface Certificate {
    purpose: string;
    payload: {
        type: string;
        content: string;
    };
    domain: string;
    timestamp: number;
    signer: string;
    signature?: string;
}

/**
 * Convert string to lowercase safely.
 * If input is not a string, it's returned as is.
 * @param str The string to be converted
 */
function safeToLowerCase(str: string): string {
    return typeof str === 'string' ? str.toLowerCase() : str;
}

/**
 * Deterministically encode certificate into JSON
 * @param cert The certificate object
 */
function encode(cert: Certificate): string {
    return fastJsonStableStringify({
        ...cert,
        signer: safeToLowerCase(cert.signer),
        signature:
            cert.signature != null
                ? safeToLowerCase(cert.signature)
                : cert.signature
    });
}

/**
 * Verify the certificate's validity
 * @param cert Certificate object with a signature
 */
function verify(cert: Certificate): void {
    if (cert.signature == null) {
        throw new Error('signature missing');
    }

    const { signature } = cert;
    if (!/^0x[0-9a-f]+$/i.test(signature) || signature.length % 2 !== 0) {
        throw new Error('invalid signature');
    }

    const encoded = encode({ ...cert, signature: undefined });
    const signingHash = blake2b256(encoded);
    const pubKey = secp256k1.recover(
        Buffer.from(signingHash, 'hex'),
        Buffer.from(signature.slice(2), 'hex')
    );

    if (address.fromPublicKey(pubKey) !== safeToLowerCase(cert.signer)) {
        throw new Error('signature does not match with signer');
    }
}

export { encode, verify };
