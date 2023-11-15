import {
    type Certificate,
    certificate,
    secp256k1,
    blake2b256,
    addressUtils
} from '@vechainfoundation/vechain-sdk-core';

// In this example we create a certificate and
// sign it, and then call verify to verify the signature

// Generate a private key and address for the signer
const privateKey = secp256k1.generatePrivateKey();
const publicKey = secp256k1.derivePublicKey(privateKey);
const signerAddress = addressUtils.fromPublicKey(publicKey);

// Create a certificate
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

// Sign certificate
const jsonStr = certificate.encode(cert);
const signature = secp256k1.sign(blake2b256(jsonStr), privateKey);

// Add 0x to signature
cert.signature = '0x' + signature.toString('hex');

// Verify certificate
certificate.verify(cert);
