import { bloom as bloomInstance } from '../../bloom';
import { dataUtils } from '../data';
import { addressUtils } from '../../address';
import { BLOOM_REGEX_LOWERCASE, BLOOM_REGEX_UPPERCASE } from '../const';
import {
    ADDRESS,
    BLOOM,
    buildError,
    DATA
} from '@vechainfoundation/vechain-sdk-errors';

/**
 * Checks if a given string adheres to the Bloom filter format.
 * @remarks
 * The Bloom filter format should be a hexadecimal string of at least 16 characters.
 * It may optionally be prefixed with '0x'.
 *
 * @param bloom - The string to validate.
 * @returns A boolean indicating whether the provided string adheres to the Bloom filter format.
 *
 */
const isBloom = (bloom: string): boolean => {
    if (typeof bloom !== 'string') {
        return false;
    }

    // At least 16 characters besides '0x' both all lowercase and all uppercase
    return (
        BLOOM_REGEX_LOWERCASE.test(bloom) || BLOOM_REGEX_UPPERCASE.test(bloom)
    );
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
 * @throws{InvalidBloomError, InvalidDataTypeError, InvalidKError}
 * - Will throw an error if `bloom` is not in a valid Bloom filter format.
 * - Will throw an error if `data` is not a valid hexadecimal string.
 * - Will throw an error if `k` is not a positive integer.
 */
const isInBloom = (bloom: string, k: number, data: string): boolean => {
    if (!isBloom(bloom)) {
        throw buildError(
            BLOOM.INVALID_BLOOM,
            'Invalid bloom filter format. Bloom filters must adhere to the format 0x[0-9a-fA-F]{16,}.'
        );
    }

    if (!dataUtils.isHexString(data, false)) {
        throw buildError(
            DATA.INVALID_DATA_TYPE,
            'Invalid data type. Data should be an hexadecimal string'
        );
    }

    if (!Number.isInteger(k) || k <= 0) {
        throw buildError(
            BLOOM.INVALID_K,
            'Invalid k. It should be a positive integer.'
        );
    }

    if (typeof data !== 'string') {
        throw buildError(
            DATA.INVALID_DATA_TYPE,
            'Invalid data type. Data should be a string'
        );
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
 * @throws{InvalidAddressError}
 * - Will throw an error if `bloom` is not a valid Bloom filter format.
 * - Will throw an error if `k` is not a positive integer.
 * - Will throw an error if `addressToCheck` is not a valid vechain thor address format.
 * ```
 */
const isAddressInBloom = (
    bloom: string,
    k: number,
    addressToCheck: string
): boolean => {
    if (!addressUtils.isAddress(addressToCheck)) {
        throw buildError(
            ADDRESS.INVALID_ADDRESS,
            'Invalid address given as input in Bloom filter.'
        );
    }

    return isInBloom(bloom, k, addressToCheck);
};

export const bloomUtils = { isBloom, isInBloom, isAddressInBloom };
