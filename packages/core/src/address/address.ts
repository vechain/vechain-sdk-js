import { ethers } from 'ethers';
import { ERRORS, HEX_ADDRESS_REGEX } from '../utils';

/**
 * Derives an Ethereum address from a public key.
 *
 * @remarks
 * This function generates an Ethereum address by utilizing the ethers.js library's `computeAddress` function.
 * Note that the public key should be provided in an uncompressed form.
 *
 * @example
 * ```
 * const publicKey = Buffer.from('your_uncompressed_public_key', 'hex');
 * const address = fromPublicKey(publicKey);
 * ```
 *
 * @param publicKey - The uncompressed public key as a `Buffer`.
 * @returns The derived Ethereum address as a string.
 */
function fromPublicKey(publicKey: Buffer): string {
    return ethers.computeAddress('0x' + publicKey.toString('hex'));
}

/**
 * Verifies whether a string qualifies as a valid Ethereum address.
 *
 * @remarks
 * This function checks a provided string against a regular expression to determine whether it is formatted as a valid Ethereum address.
 *
 * @example
 * ```
 * const isValid = isAddress("0x742d35Cc6634C0532925a3b844Bc454e4438f44e"); // true
 * ```
 *
 * @param addressToVerify - The string to be checked for address-like formatting.
 * @returns A boolean indicating whether the string adheres to Ethereum address formatting.
 */
function isAddress(addressToVerify: string): boolean {
    return HEX_ADDRESS_REGEX.test(addressToVerify);
}

/**
 * Converts a vechain thor address to its checksummed version.
 *
 * @remarks
 * This function validates and then converts an address into its EIP-55 compliant checksummed form using ethers.js’s `getAddress` function.
 * Throws an error if the input string is not a valid Ethereum address.
 *
 * @example
 * ```
 * const checksummedAddress = toChecksumed("0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359"); // 0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359
 * ```
 *
 * @param address - The input Ethereum address string to be checksummed.
 * @returns The checksummed address string, compliant with EIP-55.
 *
 * @throws
 * - Will throw an error if the provided address string is not a valid Ethereum address.
 */
function toChecksumed(address: string): string {
    if (!isAddress(address)) {
        throw new Error(ERRORS.ADDRESS.INVALID_ADDRESS);
    }
    return ethers.getAddress(address);
}

export const address = { fromPublicKey, isAddress, toChecksumed };
