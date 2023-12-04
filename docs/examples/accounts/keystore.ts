import { keystore, secp256k1 } from '@vechainfoundation/vechain-sdk-core';
import { expect } from 'expect';

// 1 - Create private key using Secp256k1

const privateKey = secp256k1.generatePrivateKey();

// @NOTE you can use BIP 39 to!
// const words = mnemonic.generate()
// const privateKey = mnemonic.derivePrivateKey(words)

// ...

// 2 - Encrypt/decrypt private key using Ethereum's keystore scheme

const keyStorePassword = 'your password';
const newKeyStore = await keystore.encrypt(privateKey, keyStorePassword);

// 3 - Throw for wrong password

const recoveredPrivateKey = await keystore.decrypt(
    newKeyStore,
    keyStorePassword
);

console.log(recoveredPrivateKey.privateKey.toString());
// 0x...

// Roughly check keystore format
expect(keystore.isValid(newKeyStore)).toBeTruthy();
// Key store ok true
