import {
    Hex0x,
    addressUtils,
    blake2b256,
    certificate,
    secp256k1,
    type Certificate
} from '@vechain/sdk-core';

// START_SNIPPET: SignVerifySnippet

// 1 - Generate a private key and address for the signer

const privateKey = secp256k1.generatePrivateKey();
const publicKey = secp256k1.derivePublicKey(privateKey);
const signerAddress = addressUtils.fromPublicKey(Buffer.from(publicKey));

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
cert.signature = Hex0x.of(signature);

// Verify certificate
certificate.verify(cert);

// END_SNIPPET: SignVerifySnippet
