import { ADDRESS, assert } from '@vechain/sdk-errors';
import { Hex0x } from '../utils';
import { keccak256 } from '../hash';
import { secp256k1 } from '../secp256k1';

import { ethers } from 'ethers';

/**
 * Regular expression for validating hexadecimal addresses. Must have "0x" prefix. Must be 40 characters long.
 */
const HEX_ADDRESS_REGEX = /^0x[0-9a-f]{40}$/i;

/**
 * Computes an VeChain Thor address from a given private key.
 *
 * Secure audit function.
 * - {@link fromPublicKey}
 * - {@link secp256k1.derivePublicKey}
 *
 * @param {Uint8Array} privateKey - The private key used to compute the public key
 * from wihich the address is computed.
 * @returns {string} - The string representation of the address,
 * prefixed with `0x` according the
 * [ERC-55: Mixed-case checksum address encoding](https://eips.ethereum.org/EIPS/eip-55).
 *
 * @see {secp256k1.derivePublicKey}
 * @see {fromPublicKey}
 */
function fromPrivateKey(privateKey: Uint8Array): string {
    return fromPublicKey(secp256k1.derivePublicKey(privateKey));
}
/**
 * Computes a VeChain Thor address from a public key.
 *
 * Secure audit function.
 * - {@link secp256k1.inflatePublicKey}
 * - {@link keccak256}
 *
 * @param {Uint8Array} publicKey - The public key to convert,
 * either in compressed or uncompressed.
 * @returns {string} - The string representation of the address,
 * prefixed with `0x` according the
 * [ERC-55: Mixed-case checksum address encoding](https://eips.ethereum.org/EIPS/eip-55).
 *
 * @remark
 * Following the [Ethereum Address](https://ethereum.org/en/whitepaper/#notes-and-further-reading)
 * specification, the returned address is computed
 * - from the uncompressed public key,
 * - removing the first byte flagging the uncompressed form,
 * - computing the [KECCAK256](https://en.wikipedia.org/wiki/SHA-3) hash
 * - represented in ERC-55 mixed case hexadecimal form,
 * - prefixed with `0x`.
 *
 * @see {secp256k1.inflatePublicKey}
 */

function fromPublicKey(publicKey: Uint8Array): string {
    return Hex0x.of(
        keccak256(secp256k1.inflatePublicKey(publicKey).slice(1)).slice(12)
    );
}

/**
 * Checks if the given string is a valid VeChain Thor address.
 *
 * @param {string} addressToVerify - The string to be checked for validity.
 * @return {boolean} - True if the string is a valid address, otherwise false.
 *
 * @see {HEX_ADDRESS_REGEX}
 */
function isAddress(addressToVerify: string): boolean {
    return HEX_ADDRESS_REGEX.test(addressToVerify);
}

/**
 * Converts a vechain thor address to its checksummed version.
 *
 * @remarks
 * This function validates and then converts an address into its EIP-55 compliant checksum form using ethers.js’s `getAddress` function.
 * Throws an error if the input string is not a valid vechain thor address.
 *
 * @throws{InvalidAddressError}
 * @param address - The input vechain thor address string to be checksummed.
 * @returns The checksum address string, compliant with EIP-55.
 */
function toChecksummed(address: string): string {
    assert(
        'toChecksummed',
        isAddress(address),
        ADDRESS.INVALID_ADDRESS,
        'Checksum failed: Input must be a valid Vechain Thor address.',
        { address }
    );

    return ethers.getAddress(address);
}

export const addressUtils = {
    fromPrivateKey,
    fromPublicKey,
    isAddress,
    toChecksummed
};
