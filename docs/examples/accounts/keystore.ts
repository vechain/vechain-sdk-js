import { keystore, secp256k1 } from '@vechain/sdk-core';
import { expect } from 'expect';

// START_SNIPPET: KeystoreSnippet

// 1 - Create private key using Secp256k1

const privateKey = secp256k1.generatePrivateKey();

// @NOTE you can use BIP 39 too!
// const words = mnemonic.generate()
// const privateKey = mnemonic.derivePrivateKey(words)

// ...

// 2 - Encrypt/decrypt private key using Ethereum's keystore scheme

// @NOTE the password should not be represented as a string,
// the Ethereum canonical representation to of password used in
// keystore encryption is UTF-8 NFKC.
const keyStorePassword = 'your password';

const newKeyStore = keystore.encrypt(
    privateKey,
    new TextEncoder().encode(keyStorePassword.normalize('NFKC'))
);

// @NOTE the `encrypt` function wipes private key and password after use.

// 3 - Throw for wrong password

const recoveredPrivateKey = keystore.decrypt(
    newKeyStore,
    new TextEncoder().encode(keyStorePassword.normalize('NFKC'))
);

// @NOTE the `decrypt`` function wipes private key and password after use.

console.log(recoveredPrivateKey.privateKey.toString());
// 0x...

// END_SNIPPET: KeystoreSnippet

// Roughly check keystore format
expect(keystore.isValid(newKeyStore)).toBeTruthy();
// Key store ok true
