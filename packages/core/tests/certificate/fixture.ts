import * as n_utils from '@noble/curves/abstract/utils';
import { Address, Secp256k1 } from '../../src';

/**
 * https://en.wikipedia.org/wiki/Unicode_compatibility_characters
 */
const HANA_KANJI_AMBIGUITY_CHALLENGE = '戀說零遼倫痢臨輻礼﨩墨碑臭舘';

/**
 * Private Key used for digital signature during certificate creation
 */
const certPrivateKey = n_utils.hexToBytes(
    '7582be841ca040aa940fff6c05773129e135623e41acce3e0b8ba520dc1ae26a'
);

/**
 * Certificate to be used for testing, mostly for encoding and verify functions
 */
const cert = {
    purpose: 'identification',
    payload: {
        type: 'text',
        content: HANA_KANJI_AMBIGUITY_CHALLENGE
    },
    domain: 'localhost',
    timestamp: 1545035330,
    signer: Address.ofPublicKey(
        Secp256k1.derivePublicKey(certPrivateKey)
    ).toString()
};

export { certPrivateKey, cert };
