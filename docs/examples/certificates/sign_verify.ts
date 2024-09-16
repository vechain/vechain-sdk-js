import {
    Hex,
    Address,
    Blake2b256,
    certificate,
    Secp256k1,
    type Certificate
} from '@vechain/sdk-core';

// START_SNIPPET: SignVerifySnippet

// 1 - Generate a private key and address for the signer

const privateKey = await Secp256k1.generatePrivateKey();
const publicKey = Secp256k1.derivePublicKey(privateKey);
const signerAddress = Address.ofPublicKey(Buffer.from(publicKey)).toString();

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
const signature = Secp256k1.sign(Blake2b256.of(jsonStr).bytes, privateKey);

// Add 0x to signature
cert.signature = Hex.of(signature).toString();

// Verify certificate
certificate.verify(cert);

// END_SNIPPET: SignVerifySnippet
