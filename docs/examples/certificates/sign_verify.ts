import {
    type Certificate,
    certificate,
    secp256k1,
    blake2b256,
    addressUtils
} from '@vechain/sdk-core';

// START_SNIPPET: SignVerifySnippet

// 1 - Generate a private key and address for the signer

const privateKey = secp256k1.generatePrivateKey();
const publicKey = secp256k1.derivePublicKey(privateKey);
const signerAddress = addressUtils.fromPublicKey(publicKey);

// 2 - Create a certificate

const cert: Certificate = {
    purpose: 'identification',
    payload: {
        type: 'text',
        content: 'fyi'
    },
    domain: 'localhost',
    timestamp: 1545035330,
    signer: signerAddress
};

// 3 - Sign certificate

const jsonStr = certificate.encode(cert);
const signature = secp256k1.sign(blake2b256(jsonStr), privateKey);

// Add 0x to signature
cert.signature = '0x' + signature.toString('hex');

// END_SNIPPET: SignVerifySnippet

// Verify certificate
certificate.verify(cert);
