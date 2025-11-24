# Mnemonic and HDKey Example

This example demonstrates how to generate BIP39 mnemonic words and derive addresses using different derivation paths (Ethereum, VeChain, and default) in SDK v3.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/vechain/vechain-sdk-js/tree/sdk-v3/examples/mnemonic-hdkey-example)

## Usage

```bash
yarn dev
```

or

```bash
tsx index.ts
```

## What it demonstrates

1. **Generate BIP39 mnemonic words** - Creates a 12-word mnemonic phrase (128-bit strength)
2. **Derive addresses with Ethereum path** - Uses `m/44'/60'/0'/0` derivation path
3. **Derive addresses with VeChain path** - Uses `m/44'/818'/0'/0` derivation path  
4. **Derive addresses with default path** - Shows the difference between `Mnemonic.toPrivateKey()` and `HDKey.fromMnemonic()` default behaviors

The example shows how both `Mnemonic.toPrivateKey()` and `HDKey.fromMnemonic()` can be used to derive addresses, and how they behave differently with different derivation paths.

