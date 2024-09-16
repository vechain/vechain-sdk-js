import { InvalidDataType } from '@vechain/sdk-errors';

/**
 * Valid hex strings.
 */
const validHexStrings = ['0x48656c6c6f', '48656c6c6f', '0x', ''];

/**
 * Invalid hex strings.
 */
const invalidHexStrings = [
    '0xG8656c6c6f',
    'H8656c6c6f',
    '0x ',
    '0x48656c6c6fz'
];

/**
 * Valid thor IDs.
 */
const validThorIDs = [
    {
        value: '0x271f7db20141001975f71deb8fca90d6b22b8d6610dfb5a3e0bbeaf78b5a4891',
        checkPrefix: true
    },
    {
        value: '271f7db20141001975f71deb8fca90d6b22b8d6610dfb5a3e0bbeaf78b5a4891',
        checkPrefix: false
    },
    {
        value: '271f7db20141001975f71deb8fca90d6b22b8d6610dfb5a3e0bbeaf78b5a4891',
        checkPrefix: false
    }
];

/**
 * Invalid thor IDs.
 */
const invalidThorIDs = [
    {
        value: '0x271f7db20141001975f71deb8fca90d6b22b8d6610d',
        checkPrefix: true
    },
    {
        value: '0xInvalidThorID',
        checkPrefix: false
    },
    {
        value: '0xInvalidThorID',
        checkPrefix: true
    }
];

/**
 * Prefixed and unprefixed strings
 */
const prefixedAndUnprefixedStrings: Array<{
    prefixed: string;
    unprefixed: string;
}> = [
    {
        prefixed: '0x48656c6c6f',
        unprefixed: '48656c6c6f'
    },
    {
        prefixed: '0x',
        unprefixed: ''
    },
    // NOTE: should not modify hex string without "0x" prefix. This is correct!
    {
        prefixed: '',
        unprefixed: ''
    },
    {
        prefixed: '48656c6c6f',
        unprefixed: '48656c6c6f'
    }
];

/**
 * Test cases for encodeBytes32String function.
 */
const encodeBytes32StringTestCases: Array<{
    value: string;
    zeroPadding?: 'left' | 'right';
    expected: string;
}> = [
    {
        value: 'Hello',
        zeroPadding: 'left',
        expected:
            '0x00000000000000000000000000000000000000000000000000000048656c6c6f'
    },
    {
        value: 'Hello',
        zeroPadding: 'right',
        expected:
            '0x48656c6c6f000000000000000000000000000000000000000000000000000000'
    },
    {
        value: "Hello World! I'm  with  32 bytes",
        zeroPadding: 'left',
        expected:
            '0x48656c6c6f20576f726c64212049276d20207769746820203332206279746573'
    },
    {
        value: "Hello World! I'm  with  32 bytes",
        zeroPadding: 'right',
        expected:
            '0x48656c6c6f20576f726c64212049276d20207769746820203332206279746573'
    },
    {
        value: 'base-gas-price',
        zeroPadding: 'left',
        expected:
            '0x000000000000000000000000000000000000626173652d6761732d7072696365'
    },
    {
        value: '1',
        zeroPadding: undefined,
        expected:
            '0x3100000000000000000000000000000000000000000000000000000000000000'
    },
    {
        value: 'base-gas-price',
        zeroPadding: 'right',
        expected:
            '0x626173652d6761732d7072696365000000000000000000000000000000000000'
    }
];

/**
 * Test cases for invalid encodeBytes32String function.
 */
const invalidEncodeBytes32StringTestCases: Array<{
    value: string;
    zeroPadding?: 'left' | 'right';
    expectedError: typeof InvalidDataType;
}> = [
    {
        value: 'Too-many-characters-Too-many-characters-Too-many-characters-Too-many-characters-Too-many-characters-Too-many-characters-Too-many-characters',
        zeroPadding: 'left',
        expectedError: InvalidDataType // value exceeds 32 bytes
    }
];

/**
 * Test cases for decodeBytes32String function.
 */
const decodeBytes32StringTestCases = [
    {
        value: '0x00000000000000000000000000000000000000000000000000000048656c6c6f',
        expected: 'Hello'
    },
    {
        value: '0x48656c6c6f000000000000000000000000000000000000000000000000000000',
        expected: 'Hello'
    },
    {
        value: '0x48656c6c6f20576f726c64212049276d20207769746820203332206279746573',
        expected: "Hello World! I'm  with  32 bytes"
    },
    {
        value: '0x000000000000000000000000000000000000626173652d6761732d7072696365',
        expected: 'base-gas-price'
    }
];

/**
 * Test cases for invalid decodeBytes32String function.
 */
const invalidDecodeBytes32StringTestCases = [
    {
        value: 'non-hex-string',
        expectedError: InvalidDataType
    },
    {
        value: '0x432345123',
        expectedError: InvalidDataType
    },
    {
        value: '0x48656c6c6fz0576f726c64212049276d20207769746820203332206279746573', // Invalid hex contains 'z'
        expectedError: InvalidDataType
    }
];

export {
    validHexStrings,
    invalidHexStrings,
    validThorIDs,
    invalidThorIDs,
    prefixedAndUnprefixedStrings,
    encodeBytes32StringTestCases,
    invalidEncodeBytes32StringTestCases,
    decodeBytes32StringTestCases,
    invalidDecodeBytes32StringTestCases
};
