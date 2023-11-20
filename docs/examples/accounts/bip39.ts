import { mnemonic } from '@vechainfoundation/vechain-sdk-core';
import { expect } from 'expect';

// Generate BIP39 mnemonic words, default to 12 words(128bit strength)
const rndMnemonic = mnemonic.generate();

// Derive private key from mnemonic words according to BIP32, using the path `m/44'/818'/0'/0`.
// Defined for VET at https://github.com/satoshilabs/slips/blob/master/slip-0044.md
const privateKey = mnemonic.derivePrivateKey(rndMnemonic);
console.log(privateKey.toString('hex'));
// ...SOME PRIVATE KEY...

// In recovery process, validation is recommendeddd
const ok = mnemonic.validate(rndMnemonic);
expect(ok).toBeTruthy();
// true
