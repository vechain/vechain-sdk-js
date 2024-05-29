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
    { bloom: '0xABCdef01230431334', isBloom: true },
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

/**
 * Fixture for block addresses
 */
const blockAddressesFixture = [
    '0x1eef8963e1222417af4dac0d98553abddb4a76b5',
    '0x6298c7a54720febdefd741d0899d287c70954c68',
    '0x576da7124c7bb65a692d95848276367e5a844d95',
    '0xa416bdda32b00e218f08ace220bab512c863ff2f',
    '0x45429a2255e7248e57fce99e7239aed3f84b7a53',
    '0x5db3c8a942333f6468176a870db36eef120a34dc',
    '0x1a8abd6d5627eb26ad71c0c7ae5224cdc640faf3',
    '0x23a46368e4acc7bb2fe0afeb054def51ec56aa74',
    '0xbeae4bef0121f11d269aedf6adb227259d4314ad',
    '0x0000000000000000000000000000456e65726779',
    '0x95fe74d1ae072ee45bdb09879a157364e5341565',
    '0xb7591602c0c9d525bc3a7cf3c729fd91b8bf5bf6',
    '0x9a107a75cff525b033a3e53cadafe3d193b570ec',
    '0xb2c20a6de401003a671659b10629eb82ff254fb8'
];

export {
    blooms,
    bloomTestCases,
    invalidAddressBloomTestCases,
    validAddressBloomTestCases,
    valueTypeBloomTestCases,
    blockAddressesFixture
};
