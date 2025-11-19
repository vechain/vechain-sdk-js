// START_SNIPPET: AddressDerivationSnippet
import { Address, Hex } from '@vechain/sdk-core';
import { expect } from 'expect';
// Derive address from a private key
const addressFromPrivateKey = Address.ofPrivateKey(Hex.of('0x7582be841ca040aa940fff6c05773129e135623e41acce3e0b8ba520dc1ae26a')
    .bytes).toString();
console.log(addressFromPrivateKey); // 0xd989829d88B0eD1B06eDF5C50174eCfA64F14A64
// Derive address from a public key
const addressFromExtendedPublicKey = Address.ofPublicKey(Hex.of('04b90e9bb2617387eba4502c730de65a33878ef384a46f1096d86f2da19043304afa67d0ad09cf2bea0c6f2d1767a9e62a7a7ecc41facf18f2fa505d92243a658f').bytes).toString();
console.log(addressFromExtendedPublicKey); // 0xd989829d88B0eD1B06eDF5C50174eCfA64F14A64
// END_SNIPPET: AddressDerivationSnippet
expect(addressFromPrivateKey).toEqual('0xd989829d88B0eD1B06eDF5C50174eCfA64F14A64');
expect(addressFromExtendedPublicKey).toEqual('0xd989829d88B0eD1B06eDF5C50174eCfA64F14A64');
