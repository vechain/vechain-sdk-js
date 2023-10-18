import { ethers } from 'ethers';
import { ERRORS, HEX_ADDRESS_REGEX } from '../utils';

/**
 * Derives a vechain thor address from a public key.
 *
 * @remarks
 * This function generates a vechain thor address by utilizing the ethers.js library's `computeAddress` function.
 * Note that the public key should be provided in an uncompressed form.
 *
 * @param publicKey - The uncompressed public key as a `Buffer`.
 * @returns The derived vechain thor address as a string.
 */
function fromPublicKey(publicKey: Buffer): string {
    return ethers.computeAddress('0x' + publicKey.toString('hex'));
}

/**
 * Verifies whether a string qualifies as a valid vechain thor address.
 *
 * @remarks
 * This function checks a provided string against a regular expression to determine whether it is formatted as a valid vechain thor address.`
 *
 * @param addressToVerify - The string to be checked for address-like formatting.
 * @returns A boolean indicating whether the string adheres to vechain thor address formatting.
 */
function isAddress(addressToVerify: string): boolean {
    return HEX_ADDRESS_REGEX.test(addressToVerify);
}

/**
 * Converts a vechain thor address to its checksummed version.
 *
 * @remarks
 * This function validates and then converts an address into its EIP-55 compliant checksummed form using ethers.js’s `getAddress` function.
 * Throws an error if the input string is not a valid vechain thor address.
 *
 * @param address - The input vechain thor address string to be checksummed.
 * @returns The checksummed address string, compliant with EIP-55.
 *
 * @throws
 * - Will throw an error if the provided address string is not a valid vechain thor address.
 */
function toChecksumed(address: string): string {
    if (!isAddress(address)) {
        throw new Error(ERRORS.ADDRESS.INVALID_ADDRESS);
    }
    return ethers.getAddress(address);
}

export const address = { fromPublicKey, isAddress, toChecksumed };
