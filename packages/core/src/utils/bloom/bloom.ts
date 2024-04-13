import * as utils from '@noble/curves/abstract/utils';
import { ADDRESS, assert, BLOOM, DATA } from '@vechain/sdk-errors';
import { Hex0x, Hex } from '../hex';
import { addressUtils } from '../../address';
import { bloom } from '../../bloom';

/**
 * Regular expression pattern to match the uppercase hexadecimal strings
 * of length 16 or more, with optional leading "0x".
 *
 * @type {RegExp}
 * @see {isBloom}
 */
const BLOOM_REGEX = /^(0x)?[0-9a-f]{16,}$/i;

/**
 * Regular expression pattern to match a lowercase hexadecimal number
 * with a minimum length of 16 characters.
 *
 * @type {RegExp}
 * @see {isBloom}
 */
// const BLOOM_REGEX_LOWERCASE = /^(0x)?[0-9a-f]{16,}$/;

const filterOf = (addresses: string[], bitPerKey: number = 160): string => {
    const keys: Uint8Array[] = [];
    addresses.forEach((address) => {
        if (addressUtils.isAddress(Hex0x.canon(address))) {
            keys.push(utils.hexToBytes(Hex.canon(address)));
        }
    });
    const generator = new bloom.Generator();
    keys.forEach((key) => {
        generator.add(key);
    });
    return utils.bytesToHex(
        generator.generate(bitPerKey, bloom.calculateK(bitPerKey)).bits
    );
};

/**
 * Checks if a given string is a valid Bloom Filter string.
 *
 * @remarks
 * The Bloom Filter format should be a hexadecimal string
 * of at least 16 characters.
 *
 * @param {string} filter - The string to check.
 * @returns {boolean} True if the string is a valid filter string, false otherwise.
 */
const isBloom = (filter: string): boolean => {
    if (typeof filter !== 'string') {
        return false;
    }
    return BLOOM_REGEX.test(filter);
};

/**
 * Determines whether a given data string is present in a Bloom Filter.
 *
 * The [Bloom Filter](https://en.wikipedia.org/wiki/Bloom_filter)
 * encodes in a compact form a set of elements allowing to
 * check if an element possibly belongs to the set or surely doesn't
 * belong to the set.
 *
 * @param {string} filter - The Bloom Filter encoded as a hexadecimal string.
 * @param {number} k - The number of hash functions used by the Bloom Filter.
 * @param {string} data - The data string to be checked against the Bloom Filter.
 * @returns {boolean} True if the data is present in the Bloom Filter, false otherwise.
 *
 * @throws{InvalidBloomError} If `bloom` is not in a valid Bloom filter format.
 * @throws{InvalidDataTypeError} If `data` is not a valid hexadecimal string.
 * @throws{InvalidKError} If `k` is not a positive integer.
 */
const isInBloom = (filter: string, k: number, data: string): boolean => {
    assert(
        'bloomUtils.isInBloom',
        isBloom(filter),
        BLOOM.INVALID_BLOOM,
        'Invalid bloom filter format. Bloom filters must adhere to the format 0x[0-9a-fA-F]{16,}.',
        { bloom: filter }
    );
    assert(
        'bloomUtils.isInBloom',
        typeof data === 'string' && Hex0x.isValid(data, true),
        DATA.INVALID_DATA_TYPE,
        'Invalid data type. Data should be an hexadecimal string',
        { data }
    );
    assert(
        'bloomUtils.isInBloom',
        Number.isInteger(k) && k > 0,
        BLOOM.INVALID_K,
        'Invalid k. It should be a positive integer.',
        { k }
    );
    const bloomFilter = new bloom.Filter(
        utils.hexToBytes(Hex.canon(filter)),
        k
    );
    return bloomFilter.contains(utils.hexToBytes(Hex.canon(data)));
};
/**
 * Checks if an address is present in a Bloom Filter.
 *
 * @remarks
 * This function first checks if `addressToCheck` adheres to the expected address format
 * and then verifies its possible existence in the set represented by the Bloom filter.
 * The address must be a valid vechain thor address, and the Bloom filter should adhere to
 * specified Bloom filter format constraints.
 *
 * @param {string} bloom - The bloom filter encoded as a hexadecimal string.
 * @param {number} k - The number of hash functions used by the Bloom Filter.
 * @param {string} address - The address to check if it is present in the Bloom filter.
 *[ERC-55  Mixed-case checksum address encoding ](https://eips.ethereum.org/EIPS/eip-55) supported.
 * @returns {boolean} - True if the address is possibly present in the Bloom Filter, false otherwise.
 *
 * @throws{InvalidAddressError} If `addressToCheck` is not a valid Vechain Thor address.
 * @throws{InvalidBloomError} If `bloom` is not in a valid Bloom filter format.
 * @throws{InvalidKError} If `k` is not a positive integer.
 */
const isAddressInBloom = (
    bloom: string,
    k: number,
    address: string
): boolean => {
    assert(
        'bloomUtils.isAddressInBloom',
        addressUtils.isAddress(address),
        ADDRESS.INVALID_ADDRESS,
        'Invalid address given as input in Bloom filter. Ensure it is a valid vechain thor address.',
        { addressToCheck: address }
    );
    return isInBloom(bloom, k, address);
};

export const bloomUtils = { filterOf, isBloom, isInBloom, isAddressInBloom };
