---
description: Handling of mnemonics and keystores.
---

# Accounts

Thor DevKit employs two primary classes, mnemonics and keystore, to facilitate account handling.

## Mnemonics

Mnemonics represent a standard human-readable approach to generate private keys. They consist of a set of words that are human-friendly and can be converted into entropy for generating private keys using derivation paths and various cryptography concepts. Notably, this process adheres to standards such as BIP-32, BIP-39, and BIP-44. These standards provide specifications and guidelines for mnemonic phrase generation, hierarchical deterministic wallets, and key derivation.

### BIP-39

```typescript { name=bip39, category=accounts,ci }
import { mnemonic } from '@vechain-sdk/core';

// Generate BIP39 mnemonic words, default to 12 words(128bit strength)
const rndMnemonic = mnemonic.generate();

// Derive private key from mnemonic words according to BIP32, using the path `m/44'/818'/0'/0`.
// Defined for VET at https://github.com/satoshilabs/slips/blob/master/slip-0044.md
const privateKey = mnemonic.derivePrivateKey(rndMnemonic.phrase.split(' '));
console.log(privateKey.toString('hex'));
// ...SOME PRIVATE KEY...

// In recovery process, validation is recommended
const ok = mnemonic.validate(rndMnemonic.phrase.split(' '));
console.log(ok);
// true
```

### BIP-32

```typescript { name=bip32, category=accounts,ci }
import { mnemonic, HDNode } from '@vechain-sdk/core';

// Generate BIP39 mnemonic words, default to 12 words(128bit strength)
const rndMnemonic = mnemonic.generate();
console.log('Mnemonic words', rndMnemonic.phrase.split(' '));
// Mnemonic words: "w1 w2 ... w12"

// Create BIP32 HD node from mnemonic words
const hdnode = HDNode.fromMnemonic(rndMnemonic.phrase.split(' '));

// Derive 5 child private keys
for (let i = 0; i < 5; i++) {
    const child = hdnode.derive(i);
    console.log(`children ${i}`, child.address);
    // children 0 0x...
    // children 1 0x...
    // ...
    // children 4 0x...
}
```

### From Public Key

```typescript { name=bip32pub, category=accounts,ci }
import { HDNode } from '@vechain-sdk/core';

// Create HD node from xpub
const xpub = Buffer.from(
    '04dc40b4324626eb393dbf77b6930e915dcca6297b42508adb743674a8ad5c69a046010f801a62cb945a6cb137a050cefaba0572429fc4afc57df825bfca2f219a',
    'hex'
);
const chainCode = Buffer.from(
    '105da5578eb3228655a8abe70bf4c317e525c7f7bb333634f5b7d1f70e111a33',
    'hex'
);

// Create BIP32 HD node from xpub
const hdnode = HDNode.fromPublicKey(xpub, chainCode);

// Derive 5 child public keys
for (let i = 0; i < 5; i++) {
    const child = hdnode.derive(i);
    console.log(`children ${i}`, child.address);
    // children 0 0x...
    // children 1 0x...
    // ...
    // children 4 0x...
}
```

## Keystore

On the other hand, Keystore is employed for encrypting private keys in accordance with the Ethereum standard. By using Keystore, the private keys can be securely encrypted to prevent unauthorized access or exposure.

Through the use of mnemonics and keystore, Thor DevKit ensures secure and user-friendly account handling. Mnemonics allow for easy generation of private keys, while keystore provides an additional layer of protection by encrypting the private keys in a standardized manner as per Ethereum's security practices. These functionalities collectively contribute to a robust and secure approach to managing accounts within the Thor ecosystem.

```typescript { name=keystore, category=accounts,ci }
import { keystore, secp256k1 } from '@vechain-sdk/core';

async function example(): Promise<void> {
    // Create private key

    // BIP 39
    // const words = mnemonic.generate()
    // const privateKey = mnemonic.derivePrivateKey(words)

    // Secp256k1
    const privateKey = secp256k1.generate();

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
    console.log('Key store ok', ok);
    // Key store ok true
}
await example();
```