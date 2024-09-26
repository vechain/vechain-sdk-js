import { Address, Certificate, Secp256k1 } from '@vechain/sdk-core';

// START_SNIPPET: SignVerifySnippet

// 1 - Generate a private key and address for the signer

const privateKey = await Secp256k1.generatePrivateKey();
const publicKey = Secp256k1.derivePublicKey(privateKey);
const signerAddress = Address.ofPublicKey(publicKey).toString();

// 2 - Create a certificate

const certificate = Certificate.of({
    purpose: 'identification',
    payload: {
        type: 'text',
        content: 'fyi'
    },
    domain: 'localhost',
    timestamp: 1545035330,
    signer: signerAddress
});

// 3 - Sign certificate

certificate.sign(privateKey);

// Verify certificate
certificate.verify();

// END_SNIPPET: SignVerifySnippet
