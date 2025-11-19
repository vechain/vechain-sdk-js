import { InvalidDataType } from '@vechain/sdk-errors';
/**
 * Valid hex strings.
 */
declare const validHexStrings: string[];
/**
 * Invalid hex strings.
 */
declare const invalidHexStrings: string[];
/**
 * Valid thor IDs.
 */
declare const validThorIDs: {
    value: string;
    checkPrefix: boolean;
}[];
/**
 * Invalid thor IDs.
 */
declare const invalidThorIDs: {
    value: string;
    checkPrefix: boolean;
}[];
/**
 * Prefixed and unprefixed strings
 */
declare const prefixedAndUnprefixedStrings: Array<{
    prefixed: string;
    unprefixed: string;
}>;
/**
 * Test cases for encodeBytes32String function.
 */
declare const encodeBytes32StringTestCases: Array<{
    value: string;
    zeroPadding?: 'left' | 'right';
    expected: string;
}>;
/**
 * Test cases for invalid encodeBytes32String function.
 */
declare const invalidEncodeBytes32StringTestCases: Array<{
    value: string;
    zeroPadding?: 'left' | 'right';
    expectedError: typeof InvalidDataType;
}>;
/**
 * Test cases for decodeBytes32String function.
 */
declare const decodeBytes32StringTestCases: {
    value: string;
    expected: string;
}[];
/**
 * Test cases for invalid decodeBytes32String function.
 */
declare const invalidDecodeBytes32StringTestCases: {
    value: string;
    expectedError: typeof InvalidDataType;
}[];
export { validHexStrings, invalidHexStrings, validThorIDs, invalidThorIDs, prefixedAndUnprefixedStrings, encodeBytes32StringTestCases, invalidEncodeBytes32StringTestCases, decodeBytes32StringTestCases, invalidDecodeBytes32StringTestCases };
//# sourceMappingURL=fixture.d.ts.map