import { secp256k1 } from '../../src/secp256k1';
import { address } from '../../src/address';

export const privKey = Buffer.from(
    '7582be841ca040aa940fff6c05773129e135623e41acce3e0b8ba520dc1ae26a',
    'hex'
);

export const cert = {
    purpose: 'identification',
    payload: {
        type: 'text',
        content: 'fyi'
    },
    domain: 'localhost',
    timestamp: 1545035330,
    signer: address.fromPublicKey(secp256k1.derivePublicKey(privKey))
};

export const cert2 = {
    domain: 'localhost',
    timestamp: 1545035330,
    purpose: 'identification',
    signer: cert.signer,
    payload: {
        content: 'fyi',
        type: 'text'
    }
};
