---
description: Handling of mnemonics and keystore.
---

# Accounts

Vechain SDK employs two primary classes, mnemonics and keystore, to facilitate account handling.

## Mnemonics

Mnemonics represent a standard human-readable approach to generate private keys. They consist of a set of words that are human-friendly and can be converted into entropy for generating private keys using derivation paths and various cryptography concepts. Notably, this process adheres to standards such as BIP-32, BIP-39, and BIP-44. These standards provide specifications and guidelines for mnemonic phrase generation, hierarchical deterministic wallets, and key derivation.

### BIP-39

BIP-39, or Bitcoin Improvement Proposal 39, outlines a standard for creating mnemonic phrases to represent private keys. 
These mnemonic phrases are typically generated as a sequence of words chosen from a predefined list, which makes them easier for humans to remember and transcribe accurately.
BIP-39 provides several benefits:
 - **Human Readability**: Mnemonic phrases are constructed from a fixed set of words, typically 12 or 24, chosen from a predefined list. This makes them easier for users to write down and remember compared to raw private keys.
 - **Error Detection**: BIP-39 includes a checksum in the mnemonic phrase, which allows for simple error detection. If a word is mistyped or omitted, the checksum will fail to validate, alerting the user to the error.
 - **Compatibility**: BIP-39 mnemonics are widely supported across different wallets and applications within the cryptocurrency ecosystem. This ensures interoperability and ease of use for users who wish to access their funds from different platforms.
 - **Security**: By generating private keys from a mnemonic phrase, users can securely back up and restore their wallets. As long as the mnemonic phrase is kept secure, users can recover their funds even if their original device is lost or damaged.

```typescript { name=bip39, category=example }
// 1 - Generate BIP39 mnemonic words, default to 12 words (128bit strength)

const randomMnemonic = Mnemonic.of();

console.log('Mnemonic words', randomMnemonic);
// Mnemonic words: "w1 w2 ... w12"

// 2 - Derive private key from mnemonic words according to BIP32, using the path `m/44'/818'/0'/0`.

// Defined for VET at https://github.com/satoshilabs/slips/blob/master/slip-0044.md
const privateKey = mnemonic.derivePrivateKey(randomMnemonic);

console.log(Hex.of(privateKey).toString());
// ...SOME PRIVATE KEY...
```

### BIP-32

BIP-32, or Bitcoin Improvement Proposal 32, defines a standard for hierarchical deterministic wallets (HD wallets). 
HD wallets allow for the generation of a tree-like structure of keys derived from a single master seed.
This hierarchy provides several advantages, including:
 - **Deterministic Key Generation**: All keys in an HD wallet are derived from a single master seed. This means that a user only needs to back up their master seed to recover all of their derived keys, rather than backing up each key individually.
 - **Hierarchical Structure**: HD wallets use a tree-like structure to organize keys. This allows for the creation of multiple accounts or sub wallets within a single wallet, each with its own unique set of keys derived from the master seed.
 - **Security**: By using a master seed to derive keys, HD wallets simplify the backup and recovery process while maintaining security. As long as the master seed is kept secure, all derived keys are also secure.
 - **Privacy**: HD wallets provide improved privacy by generating a new public key for each transaction. This prevents observers from linking multiple transactions to a single wallet address.

```typescript { name=bip32, category=example }
// 1 - Generate BIP39 mnemonic words, default to 12 words (128bit strength)

const randomMnemonic = Mnemonic.of();

console.log('Mnemonic words', randomMnemonic);
// Mnemonic words: "w1 w2 ... w12"

// 2 - Create BIP32 HD node from mnemonic words

const hdnode = HDKey.fromMnemonic(randomMnemonic);

// 3 - Derive 5 child private keys

for (let i = 0; i < 5; i++) {
    const child = hdnode.deriveChild(i);
    console.log(
        `children ${i} address`,
        Address.ofPublicKey(child.publicKey).toString()
    );
    console.log(`children ${i} private key`, child.privateKey);
    // children 0 0x...
    // children 1 0x...
    // ...
    // children 4 0x...
}
```

### Extended Public Key (xpub)

An extended public key (xpub) is derived from an HD wallet's master public key (often referred to as an extended private key, xprv). It represents a point in the HD wallet's key derivation path from which child public keys can be derived, but not private keys. This allows for the creation of a "watch-only" wallet, where the ability to generate transactions is restricted, enhancing security.

### HDKey Instance

In the context of hierarchical deterministic wallets, an HDKey instance represents a node in the hierarchical tree structure of keys.
This key can be derived from a parent key using specific derivation paths.
HDKey instances encapsulate information such as the private key, public key, chain code, and index, allowing for secure and efficient key derivation.

### From Public Key

Generating an HDKey instance from an extended public key (xpub) allows developers to derive child public keys for purposes such as address generation, transaction monitoring, or building hierarchical structures within the wallet. This functionality is particularly useful in scenarios where the private keys are stored securely offline, and only public keys are exposed to the network for enhanced security.

```typescript { name=pubkey, category=example }
// 1 - Create HD node from xpub (extended private key) and chain code

const xpub = Hex.of(
    '0x04dc40b4324626eb393dbf77b6930e915dcca6297b42508adb743674a8ad5c69a046010f801a62cb945a6cb137a050cefaba0572429fc4afc57df825bfca2f219a'
).bytes;

const chainCode = Hex.of(
    '0x105da5578eb3228655a8abe70bf4c317e525c7f7bb333634f5b7d1f70e111a33'
).bytes;

// 2 - Create BIP32 HD node from xpub

const hdKey = HDKey.fromPublicKey(xpub, chainCode);

// 3 - Derive 5 child public keys

for (let i = 0; i < 5; i++) {
    const child = hdKey.deriveChild(i);

    console.log(`children ${i}`, Address.ofPublicKey(child.publicKey));
    // children 0 0x...
    // children 1 0x...
    // ...
    // children 4 0x...
}

// 4 - Wipe private data to avoid any hack.

hdKey.wipePrivateData();
```

## Keystore

On the other hand, Keystore is employed for encrypting private keys in accordance with the Ethereum standard. By using Keystore, the private keys can be securely encrypted to prevent unauthorized access or exposure.

Through the use of mnemonics and keystore, VeChainSDK ensures secure and user-friendly account handling. Mnemonics allow for easy generation of private keys, while keystore provides an additional layer of protection by encrypting the private keys in a standardized manner as per Ethereum's security practices. These functionalities collectively contribute to a robust and secure approach to managing accounts within the Thor ecosystem.

```typescript { name=keystore, category=example }
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

const recoveredPrivateKey = await keystore.decrypt(
    newKeyStore,
    keyStorePassword
);

// @NOTE the `decrypt`` function wipes private key and password after use.

console.log(recoveredPrivateKey.privateKey.toString());
// 0x...
```

