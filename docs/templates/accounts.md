---
description: Handling of mnemonics and keystores.
---

# Accounts

Vechain SDK employs two primary classes, mnemonics and keystore, to facilitate account handling.

## Mnemonics

Mnemonics represent a standard human-readable approach to generate private keys. They consist of a set of words that are human-friendly and can be converted into entropy for generating private keys using derivation paths and various cryptography concepts. Notably, this process adheres to standards such as BIP-32, BIP-39, and BIP-44. These standards provide specifications and guidelines for mnemonic phrase generation, hierarchical deterministic wallets, and key derivation.

### BIP-39

[example](examples/accounts/bip39.ts)

### BIP-32

[example](examples/accounts/bip32.ts)

### From Public Key

[example](examples/accounts/pubkey.ts)

## Keystore

On the other hand, Keystore is employed for encrypting private keys in accordance with the Ethereum standard. By using Keystore, the private keys can be securely encrypted to prevent unauthorized access or exposure.

Through the use of mnemonics and keystore, vechain SDK ensures secure and user-friendly account handling. Mnemonics allow for easy generation of private keys, while keystore provides an additional layer of protection by encrypting the private keys in a standardized manner as per Ethereum's security practices. These functionalities collectively contribute to a robust and secure approach to managing accounts within the Thor ecosystem.

[example](examples/accounts/keystore.ts)
