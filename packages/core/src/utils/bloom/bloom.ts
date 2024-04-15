import * as utils from '@noble/curves/abstract/utils';
import { ADDRESS, assert, BLOOM, DATA } from '@vechain/sdk-errors';
import { Hex0x, Hex } from '../hex';
import { addressUtils } from '../../address';
import { bloom } from '../../bloom';
import type {
    Clause,
    ExpandedBlockDetail,
    TransactionsExpandedBlockDetail
} from '@vechain/sdk-network';

/**
 * Regular expression pattern to match the uppercase hexadecimal strings
 * of length 16 or more, with optional leading "0x".
 *
 * @type {RegExp}
 * @see {isBloom}
 */
const BLOOM_REGEX = /^(0x)?[0-9a-f]{16,}$/i;

/**
 * Bloom Filter *k* parameter set to 5 (hence 5 hashes functions are
 * used in filter generation) is computed supposing to express the
 * 20 bytes long address in 1 byte, hence k = 8 * ln(2) approximated to 5,
 * leading to a Bloom Filter size of between 8 and 16 bytes to encode
 * the addresses of a Thor block with a probability of false positives much
 * smaller than 1%.
 */
const BLOOM_DEFAULT_K = 5;

/**
 * Retrieves all addresses involved in a given block. This includes beneficiary, signer, clauses,
 * delegator, gas payer, origin, contract addresses, event addresses, and transfer recipients and senders.
 *
 * @param {ExpandedBlockDetail} block - The block object to extract addresses from.
 *
 * @returns {string[]} - An array of addresses involved in the block, included
 * empty addresses, duplicate elements are removed.
 *
 * @see {filterOf}
 */
const addressesOf = (block: ExpandedBlockDetail): string[] => {
    const addresses = new Set<string>();
    addresses.add(block.beneficiary);
    addresses.add(block.signer);
    block.transactions.forEach(
        (transaction: TransactionsExpandedBlockDetail) => {
            transaction.clauses.forEach((clause: Clause) => {
                if (typeof clause.to === 'string') {
                    addresses.add(clause.to);
                }
            });
            addresses.add(transaction.delegator);
            addresses.add(transaction.gasPayer);
            addresses.add(transaction.origin);
            transaction.outputs.forEach((output) => {
                if (typeof output.contractAddress === 'string') {
                    addresses.add(output.contractAddress);
                }
                output.events.forEach((event) => {
                    addresses.add(event.address);
                });
                output.transfers.forEach((transfer) => {
                    addresses.add(transfer.recipient);
                    addresses.add(transfer.sender);
                });
            });
        }
    );
    return Array.from(addresses);
};

/**
 * Generates a Bloom Filter(https://en.wikipedia.org/wiki/Bloom_filter)
 * from a list of addresses ignoring elements of the list are not VeChain Thor addresses
 * and duplicate elements to avoid to corrupt the resulting filters with empty strings.
 *
 * Use {@link addressesOf} to build the Bloom Filter for the addresses of
 * a an {@link ExpandedBlockDetail}.
 *
 * Secure audit function.
 * * {@link bloom.Generator}
 *
 * @param {string[]} addresses - The list of addresses to be part of the Bloom Filter,
 * expressed in hexadecimal notation, optionally prefixed with '0x',
 * (ERC-55: Mixed-case checksum address encoding)[https://eips.ethereum.org/EIPS/eip-55] supported.
 * @param {number} [k=5] - The number of hash functions used by the Bloom Filter.
 * Default is 5 as optimal to compress each address size 20 times in 1 byte key.
 *
 * @returns {string} The generated bloom filter in hexadecimal format.
 *
 * @see {addressesOf}.
 */
const filterOf = (addresses: string[], k: number = 5): string => {
    const keys = new Set<Uint8Array>();
    addresses.forEach((address) => {
        if (addressUtils.isAddress(Hex0x.canon(address))) {
            keys.add(utils.hexToBytes(Hex.canon(address)));
        }
    });
    const generator = new bloom.Generator();
    keys.forEach((key) => {
        generator.add(key);
    });
    return utils.bytesToHex(
        generator.generate(bloom.calculateBitsPerKey(k), k).bits
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
 * Secure audit function.
 * * {@link bloom.Filter}
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
 * Secure audit function.
 * * {@link isInBloom}
 *
 * @remarks
 * This function first checks if `addressToCheck` adheres to the expected address format
 * and then verifies its possible existence in the set represented by the Bloom filter.
 * The address must be a valid vechain thor address, and the Bloom filter should adhere to
 * specified Bloom filter format constraints.
 *
 * @param {string} filter - The Bloom filter encoded as a hexadecimal string.
 * @param {number} k - The number of hash functions used by the Bloom Filter.
 * @param {string} address - The address to check if it is present in the Bloom filter.
 * [ERC-55  Mixed-case checksum address encoding ](https://eips.ethereum.org/EIPS/eip-55) supported.
 * @returns {boolean} - True if the address is possibly present in the Bloom Filter, false otherwise.
 *
 * @throws{InvalidAddressError} If `addressToCheck` is not a valid Vechain Thor address.
 * @throws{InvalidBloomError} If `filter` is not in a valid Bloom filter format.
 * @throws{InvalidKError} If `k` is not a positive integer.
 */
const isAddressInBloom = (
    filter: string,
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
    return isInBloom(filter, k, address);
};

export const bloomUtils = {
    BLOOM_DEFAULT_K,
    addressesOf,
    filterOf,
    isBloom,
    isInBloom,
    isAddressInBloom
};
