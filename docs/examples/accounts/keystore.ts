import { keystore, secp256k1 } from '@vechainfoundation/vechain-sdk-core';
import { expect } from 'expect';

async function example(): Promise<void> {
    // Create private key

    // BIP 39
    // const words = mnemonic.generate()
    // const privateKey = mnemonic.derivePrivateKey(words)

    // Secp256k1
    const privateKey = secp256k1.generatePrivateKey();

    // ...

    // Encrypt/decrypt private key using Ethereum's keystore scheme
    const keyStorePassword = 'your password';
    const newKeyStore = await keystore.encrypt(privateKey, keyStorePassword);

    // Throw for wrong password
    const recoveredPrivateKey = await keystore.decrypt(
        newKeyStore,
        keyStorePassword
    );
    console.log(recoveredPrivateKey.privateKey.toString());
    // ...

    // Roughly check keystore format
    const ok = keystore.isValid(newKeyStore);
    expect(ok).toBeTruthy();
    // Key store ok true
}
await example();
