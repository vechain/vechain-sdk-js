import { mnemonic } from '@vechain/vechain-sdk-core';
import { expect } from 'expect';

// 1 - Generate BIP39 mnemonic words, default to 12 words (128bit strength)

const randomMnemonic = mnemonic.generate();

console.log('Mnemonic words', randomMnemonic);
// Mnemonic words: "w1 w2 ... w12"

// 2 - Derive private key from mnemonic words according to BIP32, using the path `m/44'/818'/0'/0`.

// Defined for VET at https://github.com/satoshilabs/slips/blob/master/slip-0044.md
const privateKey = mnemonic.derivePrivateKey(randomMnemonic);

console.log(privateKey.toString('hex'));
// ...SOME PRIVATE KEY...

// In recovery process, validation is recommended
expect(mnemonic.validate(randomMnemonic)).toBeTruthy();
// true
