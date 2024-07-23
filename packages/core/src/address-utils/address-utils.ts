import { Hex, Hex0x } from '../utils';
import { keccak256 } from '../hash';
import { secp256k1 } from '../secp256k1';
import { InvalidAddress } from '@vechain/sdk-errors';

/**
 * Regular expression for validating hexadecimal addresses
 * Must have "0x" prefix, 40 hexadecimal digits must follow.
 */
const HEX_ADDRESS_REGEX = /^0x[0-9a-f]{40}$/i;

/**
 * Computes a VeChainThor address from a given private key.
 *
 * Secure audit function.
 * - {@link fromPublicKey}
 * - {@link secp256k1.derivePublicKey}
 *
 * @param {Uint8Array} privateKey - The private key used to compute the public key
 * from which the address is computed.
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
 * Computes a VeChainThor address from a public key.
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
 * @remarks
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
    return toERC55Checksum(
        Hex0x.of(
            keccak256(secp256k1.inflatePublicKey(publicKey).slice(1)).slice(12)
        )
    );
}

/**
 * Checks if the given string is a valid VeChainThor address.
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
 * Converts the given VeChainThor address to its
 * [EIP/ERC-55: Mixed-case checksum address encoding](https://eips.ethereum.org/EIPS/eip-55)
 * representation.
 *
 * Secure audit function.
 * - {@link keccak256}
 *
 * @param {string} address - The address to be converted,
 * it must be prefixed with `0x`.
 * @return {string} - The EIP/ERC-55 checksum address.
 * @throws {InvalidAddress}
 */
function toERC55Checksum(address: string): string {
    if (!isAddress(address)) {
        throw new InvalidAddress(
            'addressUtils.toERC55Checksum()',
            'Checksum failed: Input must be a valid VeChainThor address.',
            { address }
        );
    }

    const digits = Hex.canon(address.toLowerCase());
    const hash = Hex.of(keccak256(digits));
    let result: string = '0x';
    for (let i = 0; i < digits.length; i++) {
        if (parseInt(hash[i], 16) >= 8) {
            result += digits[i].toUpperCase();
        } else {
            result += digits[i];
        }
    }
    return result;
}

export const addressUtils = {
    fromPrivateKey,
    fromPublicKey,
    isAddress,
    toERC55Checksum
};
