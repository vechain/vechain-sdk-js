import { keystore, Secp256k1 } from '@vechain/sdk-core';
import { expect } from 'expect';
// START_SNIPPET: KeystoreSnippet
// 1 - Create private key using Secp256k1
const privateKey = await Secp256k1.generatePrivateKey();
// @NOTE you can use BIP 39 too!
// const words = Mnemonic.of()
// const privateKey = Mnemonic.toPrivateKey(words)
// ...
// 2 - Encrypt/decrypt private key using Ethereum's keystore scheme
// @NOTE the password should not be represented as a string,
// the Ethereum canonical representation to of password used in
// keystore encryption is UTF-8 NFKC.
const keyStorePassword = 'your password';
const newKeyStore = await keystore.encrypt(privateKey, keyStorePassword);
// @NOTE the `encrypt` function wipes private key and password after use.
// 3 - Throw the wrong password
const recoveredPrivateKey = await keystore.decrypt(newKeyStore, keyStorePassword);
// @NOTE the `decrypt`` function wipes private key and password after use.
console.log(recoveredPrivateKey.privateKey.toString());
// 0x...
// END_SNIPPET: KeystoreSnippet
// Roughly check the keystore format
expect(keystore.isValid(newKeyStore)).toBeTruthy();
// Key store ok true
