"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invalidDecodeBytes32StringTestCases = exports.decodeBytes32StringTestCases = exports.invalidEncodeBytes32StringTestCases = exports.encodeBytes32StringTestCases = exports.prefixedAndUnprefixedStrings = exports.invalidThorIDs = exports.validThorIDs = exports.invalidHexStrings = exports.validHexStrings = void 0;
const sdk_errors_1 = require("@vechain/sdk-errors");
/**
 * Valid hex strings.
 */
const validHexStrings = ['0x48656c6c6f', '48656c6c6f', '0x', ''];
exports.validHexStrings = validHexStrings;
/**
 * Invalid hex strings.
 */
const invalidHexStrings = [
    '0xG8656c6c6f',
    'H8656c6c6f',
    '0x ',
    '0x48656c6c6fz'
];
exports.invalidHexStrings = invalidHexStrings;
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
exports.validThorIDs = validThorIDs;
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
exports.invalidThorIDs = invalidThorIDs;
/**
 * Prefixed and unprefixed strings
 */
const prefixedAndUnprefixedStrings = [
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
exports.prefixedAndUnprefixedStrings = prefixedAndUnprefixedStrings;
/**
 * Test cases for encodeBytes32String function.
 */
const encodeBytes32StringTestCases = [
    {
        value: 'Hello',
        zeroPadding: 'left',
        expected: '0x00000000000000000000000000000000000000000000000000000048656c6c6f'
    },
    {
        value: 'Hello',
        zeroPadding: 'right',
        expected: '0x48656c6c6f000000000000000000000000000000000000000000000000000000'
    },
    {
        value: "Hello World! I'm  with  32 bytes",
        zeroPadding: 'left',
        expected: '0x48656c6c6f20576f726c64212049276d20207769746820203332206279746573'
    },
    {
        value: "Hello World! I'm  with  32 bytes",
        zeroPadding: 'right',
        expected: '0x48656c6c6f20576f726c64212049276d20207769746820203332206279746573'
    },
    {
        value: 'base-gas-price',
        zeroPadding: 'left',
        expected: '0x000000000000000000000000000000000000626173652d6761732d7072696365'
    },
    {
        value: '1',
        zeroPadding: undefined,
        expected: '0x3100000000000000000000000000000000000000000000000000000000000000'
    },
    {
        value: 'base-gas-price',
        zeroPadding: 'right',
        expected: '0x626173652d6761732d7072696365000000000000000000000000000000000000'
    }
];
exports.encodeBytes32StringTestCases = encodeBytes32StringTestCases;
/**
 * Test cases for invalid encodeBytes32String function.
 */
const invalidEncodeBytes32StringTestCases = [
    {
        value: 'Too-many-characters-Too-many-characters-Too-many-characters-Too-many-characters-Too-many-characters-Too-many-characters-Too-many-characters',
        zeroPadding: 'left',
        expectedError: sdk_errors_1.InvalidDataType // value exceeds 32 bytes
    }
];
exports.invalidEncodeBytes32StringTestCases = invalidEncodeBytes32StringTestCases;
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
exports.decodeBytes32StringTestCases = decodeBytes32StringTestCases;
/**
 * Test cases for invalid decodeBytes32String function.
 */
const invalidDecodeBytes32StringTestCases = [
    {
        value: 'non-hex-string',
        expectedError: sdk_errors_1.InvalidDataType
    },
    {
        value: '0x432345123',
        expectedError: sdk_errors_1.InvalidDataType
    },
    {
        value: '0x48656c6c6fz0576f726c64212049276d20207769746820203332206279746573', // Invalid hex contains 'z'
        expectedError: sdk_errors_1.InvalidDataType
    }
];
exports.invalidDecodeBytes32StringTestCases = invalidDecodeBytes32StringTestCases;
