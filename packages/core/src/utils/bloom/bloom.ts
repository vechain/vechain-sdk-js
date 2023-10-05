import { bloom as bloomInstance } from '../../bloom';
import { dataUtils } from '../data';
import { ERRORS } from '../errors';
import { type HexString } from '../types';
import { address } from '../../address';

/**
 * Checks if a given string adheres to the Bloom filter format.
 * @remarks
 * The Bloom filter format should be a hexadecimal string of at least 16 characters.
 * It may optionally be prefixed with '0x'.
 *
 * @param bloom - The string to validate.
 * @returns A boolean indicating whether the provided string adheres to the Bloom filter format.
 *
 * @example
 * ```typescript
 * const bloomValid: string = "0x5522cbe5f76c5e8a9994b6f7c967d3aefa4d31e409cfc07308aeb2853c";
 * const bloomInvalid: string = "0x5522cbe5f76c5g8a"; // Contains an invalid character 'g'
 *
 * console.log(isBloom(bloomValid)); // Expected output: true
 * console.log(isBloom(bloomInvalid)); // Expected output: false
 * ```
 */
const isBloom = (bloom: string): boolean => {
    if (typeof bloom !== 'string') {
        return false;
    }

    // At least 16 characters besides '0x' both all lowercase and all uppercase
    if (
        /^(0x)?[0-9a-f]{16,}$/.test(bloom) ||
        /^(0x)?[0-9A-F]{16,}$/.test(bloom)
    ) {
        return true;
    }

    return false;
};

/**
 * Verifies whether the data, specified in a hex string format, is potentially contained in a set represented by the Bloom filter.
 * @remarks
 * This function throws errors if the input parameters do not adhere to the expected formats.
 * Ensure the `data` parameter is a hexadecimal string and `k` is a positive integer.
 *
 * @param bloom - Hex string representing the Bloom filter.
 * @param k - Number of hash functions used in the filter.
 * @param data - Hex string of the data to check against the Bloom filter.
 * @returns True if the data may be in the set represented by the Bloom filter; false otherwise.
 *
 * @throws
 * - Will throw an error if `bloom` is not in a valid Bloom filter format.
 * - Will throw an error if `data` is not a valid hexadecimal string.
 * - Will throw an error if `k` is not a positive integer.
 *
 * @example
 * ```typescript
 * const bloom: HexString = "0x5522cbe5310cdaa96c5e8a9994b6f7c967d3aefa4d31e409cfc07308aeb2853c";
 * const k: number = 3;
 * const dataToCheck: string = "Hello world";
 *
 * const mayBeInSet: boolean = isInBloom(bloom, k, toHexString(dataToCheck));
 * ```
 */
const isInBloom = (bloom: HexString, k: number, data: HexString): boolean => {
    if (!isBloom(bloom)) {
        throw new Error(ERRORS.BLOOM.INVALID_BLOOM);
    }

    if (!dataUtils.isHexString(data)) {
        throw new Error(ERRORS.DATA.INVALID_DATA_TYPE('a hexadecimal string'));
    }

    if (!Number.isInteger(k) || k <= 0) {
        throw new Error(ERRORS.BLOOM.INVALID_K);
    }

    if (typeof data !== 'string') {
        throw new Error(ERRORS.DATA.INVALID_DATA_TYPE('a string'));
    }

    // Ensure data is a Buffer
    const dataBuffer = Buffer.from(dataUtils.removePrefix(data), 'hex');

    const bloomBuffer = Buffer.from(dataUtils.removePrefix(bloom), 'hex');
    const bloomFilter = new bloomInstance.Filter(bloomBuffer, k);

    return bloomFilter.contains(dataBuffer);
};

/**
 * Determines whether an address is potentially part of a set represented by a Bloom filter.
 * @remarks
 * This function first checks if `addressToCheck` adheres to the expected address format
 * and then verifies its possible existence in the set represented by the Bloom filter.
 * The address must be a valid vechain thor address, and the Bloom filter should adhere to
 * specified Bloom filter format constraints.
 *
 * Note that due to the probabilistic nature of Bloom filters, a return value of `true`
 * indicates that the address may be in the set, while `false` confirms that the address
 * is not in the set.
 *
 * @param bloom - A hex string representing the Bloom filter against which the address is checked.
 * @param k - The number of hash functions used by the Bloom filter, must be a positive integer.
 * @param addressToCheck - The address in hexadecimal string format to be checked against the Bloom filter.
 * @returns A boolean indicating whether the address may be part of the set represented by the Bloom filter.
 *
 * @throws
 * - Will throw an error if `bloom` is not a valid Bloom filter format.
 * - Will throw an error if `k` is not a positive integer.
 * - Will throw an error if `addressToCheck` is not a valid vechain thor address format.
 *
 * @example
 * ```typescript
 * const bloom: HexString = "0x1c111c0c92a9413c38db871299fd72155b79d99b39c819";
 * const k: number = 13;
 * const addressToCheck: HexString = "0xDafCA4A51eA97B3b5F21171A95DAbF540894a55A";
 *
 * const mayBeInSet: boolean = isAddressInBloom(bloom, k, addressToCheck); // true
 * const isNotInSet: boolean = isAddressInBloom(bloom, k, "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"); // false
 *
 * ```
 */
const isAddressInBloom = (
    bloom: HexString,
    k: number,
    addressToCheck: HexString
): boolean => {
    if (!address.isAddress(addressToCheck)) {
        throw new Error(ERRORS.ADDRESS.INVALID_ADDRESS);
    }

    return isInBloom(bloom, k, addressToCheck);
};

export const bloomUtils = { isBloom, isInBloom, isAddressInBloom };
