import { Hex, Mnemonic } from '@vechain/sdk-core';
import { expect } from 'expect';

// START_SNIPPET: Bip39Snippet

// 1 - Generate BIP39 mnemonic words, default to 12 words (128bit strength)

const randomMnemonic = Mnemonic.of();

console.log('Mnemonic words', randomMnemonic);
// Mnemonic words: "w1 w2 ... w12"

// 2 - Derive private key from mnemonic words according to BIP32, using the path `m/44'/818'/0'/0`.

// Defined for VET at https://github.com/satoshilabs/slips/blob/master/slip-0044.md
const privateKey = Mnemonic.toPrivateKey(randomMnemonic);

console.log(Hex.of(privateKey).toString());
// ...SOME PRIVATE KEY...

// END_SNIPPET: Bip39Snippet

// In recovery process, validation is recommended
expect(Mnemonic.isValid(randomMnemonic)).toBeTruthy();
