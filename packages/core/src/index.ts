import * as address from './address';
import * as encoding from './encoding';
import * as mnemonic from './mnemonic';
import * as hash from './hash';
import * as hdnode from './hdnode';
import * as keystore from './keystore';
import * as secp256k1 from './secp256k1';
import * as utils from './utils';

export * from './address';
export * from './encoding';
export * from './mnemonic';
export * from './hash';
export * from './hdnode';
export * from './keystore';
export * from './secp256k1';
export * from './utils';

// Combine all exports into a single object
export default {
    ...address,
    ...encoding,
    ...mnemonic,
    ...hash,
    ...hdnode,
    ...keystore,
    ...secp256k1,
    ...utils
};
