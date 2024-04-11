import { HDNode, mnemonic } from '@vechain/sdk-core';
import { expect } from 'expect';

// START_SNIPPET: Bip32Snippet

// 1 - Generate BIP39 mnemonic words, default to 12 words (128bit strength)

const randomMnemonic = mnemonic.generate();

console.log('Mnemonic words', randomMnemonic);
// Mnemonic words: "w1 w2 ... w12"

// 2 - Create BIP32 HD node from mnemonic words

const hdnode = HDNode.fromMnemonic(randomMnemonic);

// 3 - Derive 5 child private keys

for (let i = 0; i < 5; i++) {
    const child = hdnode.derive(i);
    console.log(`children ${i} address`, child.address);
    console.log(`children ${i} private key`, child.privateKey);
    // children 0 0x...
    // children 1 0x...
    // ...
    // children 4 0x...
}

// END_SNIPPET: Bip32Snippet

// In the recovery process, validation is recommended
expect(mnemonic.validate(randomMnemonic)).toBeTruthy();
