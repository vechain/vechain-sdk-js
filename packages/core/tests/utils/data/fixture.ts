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
    }
];

/**
 * Prefixd and unprefixed strings
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
 * Test cases for isNumeric function.
 */
const isNumericTestCases = [
    {
        value: '0',
        expected: true
    },
    {
        value: '1',
        expected: true
    },
    {
        value: '1.54523532463463642352342354645363',
        expected: true
    },
    {
        value: '.52434234',
        expected: true
    },
    {
        value: '32412341234.543563463',
        expected: true
    },
    {
        value: '1,6',
        expected: false
    },
    {
        value: '1.6.7',
        expected: false
    },
    {
        value: '1.6,7',
        expected: false
    },
    {
        value: '1,6,7',
        expected: false
    },
    {
        value: '1,6.7',
        expected: false
    },
    {
        value: '1.6,7.8',
        expected: false
    },
    {
        value: '1.',
        expected: false
    },
    {
        value: '.',
        expected: false
    },
    {
        value: '1.6.',
        expected: false
    },
    {
        value: '1.6.7',
        expected: false
    },
    {
        value: '1.6.7.',
        expected: false
    },
    {
        value: '-1.5',
        expected: true
    },
    {
        value: '-1.5.6',
        expected: false
    },
    {
        value: 1,
        expected: false
    },
    {
        value: 0x152,
        expected: false
    },
    {
        value: {},
        expected: false
    }
];

export {
    validHexStrings,
    invalidHexStrings,
    validThorIDs,
    invalidThorIDs,
    prefixedAndUnprefixedStrings,
    isNumericTestCases
};
