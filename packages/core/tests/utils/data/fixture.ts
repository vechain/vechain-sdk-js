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

export { validHexStrings, invalidHexStrings, prefixedAndUnprefixedStrings };
