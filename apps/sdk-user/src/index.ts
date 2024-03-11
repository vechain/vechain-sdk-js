import { core, mnemonic } from '@vechain/sdk-core';

const phrase = mnemonic.generate();
console.log(phrase);
const phrase2 = core.mnemonic.generate();
console.log(phrase2);
