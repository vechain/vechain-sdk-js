import { Address, Mnemonic } from '@vechain/sdk-temp/common';
import { ThorClient, ThorNetworks } from '@vechain/sdk-temp/thor'
import { HDKey } from '@vechain/sdk-temp/common';

// DEBUG: create client
const client = ThorClient.at(ThorNetworks.TESTNET);
// just random call to test if the client is working
const block = await client.blocks.getBlock();
if (block === null) {
    console.error('Failed to get block');
    process.exit(1);
}
console.log('Block', block);

// 1 - Generate BIP39 mnemonic words, default to 12 words (128bit strength)
const randomMnemonic = Mnemonic.of();

console.log('Mnemonic words', randomMnemonic);
// Mnemonic words: ["w1", "w2", ..., "w12"]

// 2 - Derive private key from mnemonic words according to BIP32, using the path `m/44'/818'/0'/0`.
// Defined for VET at https://github.com/satoshilabs/slips/blob/master/slip-0044.md

const derivation_path_ethereum = "m/44'/60'/0'/0";
const derivation_path_vechain = "m/44'/818'/0'/0";

// Child 0
// Note: In v3, Mnemonic.toPrivateKey always starts from root and derives the full path
// For custom derivation paths, we need to use HDKey.fromMnemonic with the base path, then deriveChild

// Ethereum path
const ethereumHdKey = HDKey.fromMnemonic(randomMnemonic, derivation_path_ethereum);
const ethereumChild0 = ethereumHdKey.deriveChild(0);
console.log(
    'Child 0:',
    Address.ofPrivateKey(ethereumChild0.privateKey as Uint8Array).toString(),
    'Class Mnemonic - Ethereum path'
);

console.log(
    'Child 0:',
    Address.ofPublicKey(ethereumChild0.publicKey as Uint8Array).toString(),
    'Class HDKey - Ethereum path'
);

// VeChain path
const vechainHdKey = HDKey.fromMnemonic(randomMnemonic, derivation_path_vechain);
const vechainChild0 = vechainHdKey.deriveChild(0);
console.log(
    'Child 0:',
    Address.ofPrivateKey(vechainChild0.privateKey as Uint8Array).toString(),
    'Class Mnemonic - VeChain path'
);

console.log(
    'Child 0:',
    Address.ofPublicKey(vechainChild0.publicKey as Uint8Array).toString(),
    'Class HDKey - VeChain path'
);

// Default path
// Note: In v2, Mnemonic.toPrivateKey() without path derived from root 'm' with path 'm/0'
// In v3, Mnemonic.toPrivateKey() uses HDKey.fromMnemonic() which defaults to VET_DERIVATION_PATH
// To replicate v2 behavior, we explicitly derive from root 'm' with path 'm/0'
const rootHdKey = HDKey.fromMnemonic(randomMnemonic, 'm');
const m0FromRoot = rootHdKey.derive('m/0');
console.log(
    'Child 0:',
    Address.ofPrivateKey(m0FromRoot.privateKey as Uint8Array).toString(),
    'Class Mnemonic - Default path'
);

// In v3, HDKey.fromMnemonic() without path uses VET_DERIVATION_PATH as default
// This matches v2 behavior where HDKey.fromMnemonic() used VET_DERIVATION_PATH
const defaultHdKey = HDKey.fromMnemonic(randomMnemonic);
console.log(
    'Child 0:',
    Address.ofPublicKey(
        defaultHdKey.deriveChild(0).publicKey as Uint8Array
    ).toString(),
    'Class HDKey - Default path'
);
