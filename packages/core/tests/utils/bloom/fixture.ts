import { InvalidAddressError } from '@vechain/sdk-errors';
import { Hex } from '../../../src';

/**
 * Blooms filter used to check if "it is a bloom filter or not" verification works
 */
const blooms = [
    { bloom: '0x00000000000000000', isBloom: true },
    { bloom: '00000000000000000', isBloom: true },
    { bloom: 'cceeeeeeeeee2e02', isBloom: true },
    { bloom: '0xcceeefaf544356660001123123eeeeeee2e02', isBloom: true },
    { bloom: '0xABCDEF01230431334', isBloom: true },
    { bloom: '0xABCdef01230431334', isBloom: false },
    { bloom: '0x', isBloom: false },
    { bloom: '', isBloom: false },
    { bloom: '0x+ò8nbas', isBloom: false }
];

/**
 * Test cases for bloom filter membership and other tests
 */
const bloomTestCases = [
    {
        bloom: 'c207aca13ca010db8b5f89b3689318',
        k: 13,
        data: 'A129f34Ad3e333373425088De3e6d7C09E0B7Dab',
        expected: true,
        description: "Without '0x' prefix"
    },
    {
        bloom: '0x9c08a0c38a54ab18fa95eb1a6cedb819130e39c9e90805',
        k: 13,
        data: '0x40735a8a228fba6ce0f18001168cd6cbd982dc98',
        expected: true,
        description: "With '0x' prefix"
    },
    {
        bloom: '0x9c08a0c38a54ab18fa95eb1a6cedb819130e39c9e90805',
        k: 13,
        data: '40735a8a228fba6ce0f18001168cd6cbd982dc98',
        expected: true,
        description: "With '0x' and without '0x' prefix"
    },
    {
        bloom: '49abf7bc1aa1ba16219497d256',
        k: 13,
        data: '0xBa6B65f7A48636B3e533205d9070598b4faF6a0C',
        expected: true,
        description: "Without '0x' and with '0x' prefix"
    }
];

/**
 * Value type test cases
 */
const valueTypeBloomTestCases = [
    {
        bloom: 'a4d641159d68d829345f86f40d50676cf042f6265072075a94',
        k: 13,
        data: Hex.of('key1'),
        expected: true,
        description: 'regular string'
    },
    {
        bloom: '1190199325088200',
        k: 6,
        data: Hex.of('\x00\x01\x02'),
        expected: true,
        description: 'binary data'
    },
    {
        bloom: '0x1190199325088200',
        k: 6,
        data: Hex.of('🚀'),
        expected: true,
        description: 'emoji'
    }
];

/**
 * Test cases for bloom inclusion of invalid addresses
 */
const invalidAddressBloomTestCases = [
    {
        bloom: 'c207aca13ca010db8b5f89b3689318',
        k: 13,
        address: '0xINVALIDADDRESS',
        expected: InvalidAddressError,
        description: 'invalid address'
    },
    {
        bloom: 'c207aca13ca010db8b5f89b3689318',
        k: 13,
        address: 'INVALIDADDRESS',
        expected: InvalidAddressError,
        description: 'invalid address without 0x prefix'
    },
    {
        bloom: 'c207aca13ca010db8b5f89b3689318',
        k: 13,
        address: '0xc9318',
        expected: InvalidAddressError,
        description: 'invalid address too short'
    }
];

/**
 * Test cases for bloom inclusion of valid addresses
 */
const validAddressBloomTestCases = [
    {
        bloom: '0x1c111c0c92a9413c38db871299fd72155b79d99b39c819',
        k: 13,
        address: '0xF6C4EE6946cE0c1e2154324026b4b2f16221e733',
        expected: true,
        description: 'valid address with 0x prefix'
    },
    {
        bloom: '0x1c111c0c92a9413c38db871299fd72155b79d99b39c819',
        k: 13,
        address: '0xDafCA4A51eA97B3b5F21171A95DAbF540894a55A',
        expected: true,
        description: 'valid address with 0x prefix'
    }
];

export {
    blooms,
    bloomTestCases,
    valueTypeBloomTestCases,
    invalidAddressBloomTestCases,
    validAddressBloomTestCases
};
