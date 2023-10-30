import { secp256k1, address, blake2b256 } from '../../src';
import { certificate } from '../../src/certificate';

/**
 * Private Key used for digital signature during certificate creation
 */
const privKey = Buffer.from(
    '7582be841ca040aa940fff6c05773129e135623e41acce3e0b8ba520dc1ae26a',
    'hex'
);

/**
 * Certificate n.1 to be used for testing, mostly for encoding and verify functions
 */
const cert = {
    purpose: 'identification',
    payload: {
        type: 'text',
        content: 'fyi'
    },
    domain: 'localhost',
    timestamp: 1545035330,
    signer: address.fromPublicKey(secp256k1.derivePublicKey(privKey))
};

/**
 * Certificate n.2 to be used for testing, mostly for encoding and verify functions
 */
const cert2 = {
    domain: 'localhost',
    timestamp: 1545035330,
    purpose: 'identification',
    signer: cert.signer,
    payload: {
        content: 'fyi',
        type: 'text'
    }
};

/**
 * Signature of Certificate n.1
 */
const sig =
    '0x' +
    secp256k1
        .sign(blake2b256(certificate.encode(cert)), privKey)
        .toString('hex');

/**
 * Signature of Certificate n.2
 */
const sig2 =
    '0x' +
    secp256k1
        .sign(blake2b256(certificate.encode(cert2)), privKey)
        .toString('hex');

/**
 * Invalid Signature of Certificate n.1
 */
const invalidSignature =
    '0xBAD' +
    secp256k1
        .sign(blake2b256(certificate.encode(cert)), privKey)
        .toString('hex');

export { privKey, cert, cert2, sig, sig2, invalidSignature };
