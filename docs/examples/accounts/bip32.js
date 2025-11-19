import { Address, HDKey, Mnemonic } from '@vechain/sdk-core';
import { expect } from 'expect';
// START_SNIPPET: Bip32Snippet
// 1 - Generate BIP39 mnemonic words, default to 12 words (128bit strength)
const randomMnemonic = Mnemonic.of();
console.log('Mnemonic words', randomMnemonic);
// Mnemonic words: "w1 w2 ... w12"
// 2 - Create BIP32 HD node from mnemonic words
const hdnode = HDKey.fromMnemonic(randomMnemonic);
// 3 - Derive 5 child private keys
for (let i = 0; i < 5; i++) {
    const child = hdnode.deriveChild(i);
    console.log(`children ${i} address`, Address.ofPublicKey(child.publicKey).toString());
    console.log(`children ${i} private key`, child.privateKey);
    // children 0 0x...
    // children 1 0x...
    // ...
    // children 4 0x...
}
// END_SNIPPET: Bip32Snippet
// In the recovery process, validation is recommended
expect(Mnemonic.isValid(randomMnemonic)).toBeTruthy();
