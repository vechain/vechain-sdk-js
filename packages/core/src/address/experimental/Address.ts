import * as nc_utils from '@noble/curves/abstract/utils';
import { HEX } from '../../utils';
import { assert, DATA } from '@vechain/sdk-errors';
import { secp256k1 } from '../../secp256k1';
import { keccak256 } from '../../hash';

class Address extends HEX {
    /**
     * Regular expression pattern used to validate an address.
     *
     * @type {RegExp}
     */
    private static readonly REGEX_ADDRESS = /^(0x)?[0-9a-f]{40}$/i;

    constructor(hex: string) {
        assert(
            'Address.constructor',
            Address.isValid(hex),
            DATA.INVALID_DATA_TYPE,
            'not an address expression',
            { hex }
        );
        super(hex, (hex: string) => Address.checksum(hex));
    }

    private static checksum(txt: string): string {
        const lowc = txt.toLowerCase();
        const hash = nc_utils.bytesToHex(keccak256(lowc));
        let checksum = '';
        for (let i = 0; i < lowc.length; i++) {
            if (parseInt(hash[i], HEX.RADIX) >= 8) {
                checksum += lowc[i].toUpperCase();
            } else {
                checksum += lowc[i];
            }
        }
        return checksum;
    }

    public static isValid(exp: string): boolean {
        return Address.REGEX_ADDRESS.test(exp);
    }

    public static of(value: Uint8Array): Address {
        return new Address(nc_utils.bytesToHex(value));
    }

    public static ofPrivateKey(privateKey: Uint8Array): Address {
        return Address.ofPublicKey(secp256k1.derivePublicKey(privateKey));
    }

    public static ofPublicKey(publicKey: Uint8Array): Address {
        return Address.of(
            keccak256(secp256k1.inflatePublicKey(publicKey).slice(1)).slice(12)
        );
    }
}

export { Address };
