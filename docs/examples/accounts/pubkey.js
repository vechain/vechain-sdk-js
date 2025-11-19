import { Address, Hex, HDKey } from '@vechain/sdk-core';
// START_SNIPPET: PubKeySnippet
// 1 - Create HD node from xpub (extended private key) and chain code
const xpub = Hex.of('0x04dc40b4324626eb393dbf77b6930e915dcca6297b42508adb743674a8ad5c69a046010f801a62cb945a6cb137a050cefaba0572429fc4afc57df825bfca2f219a').bytes;
const chainCode = Hex.of('0x105da5578eb3228655a8abe70bf4c317e525c7f7bb333634f5b7d1f70e111a33').bytes;
// 2 - Create BIP32 HD node from xpub
const hdKey = HDKey.fromPublicKey(xpub, chainCode);
// 3 - Derive 5 child public keys
for (let i = 0; i < 5; i++) {
    const child = hdKey.deriveChild(i);
    console.log(`children ${i}`, Address.ofPublicKey(child.publicKey));
    // children 0 0x...
    // children 1 0x...
    // ...
    // children 4 0x...
}
// 4 - Wipe private data to avoid any hack.
hdKey.wipePrivateData();
// END_SNIPPET: PubKeySnippet
