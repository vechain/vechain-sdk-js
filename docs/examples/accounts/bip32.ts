import { mnemonic, HDNode } from '@vechainfoundation/vechain-sdk-core';

// Generate BIP39 mnemonic words, default to 12 words(128bit strength)
const rndMnemonic = mnemonic.generate();
console.log('Mnemonic words', rndMnemonic);
// Mnemonic words: "w1 w2 ... w12"

// Create BIP32 HD node from mnemonic words
const hdnode = HDNode.fromMnemonic(rndMnemonic);

// Derive 5 child private keys
for (let i = 0; i < 5; i++) {
    const child = hdnode.derive(i);
    console.log(`children ${i}`, child.address);
    // children 0 0x...
    // children 1 0x...
    // ...
    // children 4 0x...
}
