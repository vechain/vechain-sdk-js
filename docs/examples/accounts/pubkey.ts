import { HDNode } from '@vechainfoundation/core';

// Create HD node from xpub
const xpub = Buffer.from(
    '04dc40b4324626eb393dbf77b6930e915dcca6297b42508adb743674a8ad5c69a046010f801a62cb945a6cb137a050cefaba0572429fc4afc57df825bfca2f219a',
    'hex'
);
const chainCode = Buffer.from(
    '105da5578eb3228655a8abe70bf4c317e525c7f7bb333634f5b7d1f70e111a33',
    'hex'
);

// Create BIP32 HD node from xpub
const hdnode = HDNode.fromPublicKey(xpub, chainCode);

// Derive 5 child public keys
for (let i = 0; i < 5; i++) {
    const child = hdnode.derive(i);
    console.log(`children ${i}`, child.address);
    // children 0 0x...
    // children 1 0x...
    // ...
    // children 4 0x...
}
