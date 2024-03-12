import { core } from '@vechain/sdk-core';

function generateMnemonic(): string[] {
    const mnemonic = core.mnemonic.generate();

    return mnemonic;
}

export { generateMnemonic };
