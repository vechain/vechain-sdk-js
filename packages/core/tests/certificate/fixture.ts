import {
    secp256k1,
    addressUtils,
    blake2b256,
    certificate,
    Hex0x,
    Hex
} from '../../src';

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
    signer: addressUtils.fromPublicKey(secp256k1.derivePublicKey(privKey))
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
const sig = Hex0x.of(
    secp256k1.sign(blake2b256(certificate.encode(cert)), privKey)
);

/**
 * Signature of Certificate n.2
 */
const sig2 = Hex0x.of(
    secp256k1.sign(blake2b256(certificate.encode(cert2)), privKey)
);

/**
 * Invalid Signature of Certificate n.1
 */
const invalidSignature =
    '0xBAD' +
    Hex.of(secp256k1.sign(blake2b256(certificate.encode(cert)), privKey));

export { privKey, cert, cert2, sig, sig2, invalidSignature };
