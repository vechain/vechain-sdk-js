"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const sdk_errors_1 = require("@vechain/sdk-errors");
const src_1 = require("../../../src");
const fixture_1 = require("./fixture");
// Hex on purpose because it must be equal to the returned HexUInt hash.
const CONTENT_BLAKE2B256 = src_1.Hex.of('0x6a908bb80109908919c0bf5d0594c890700dd46acc097f9f28bfc85a0a2e6c0c');
// Hex on purpose because it must be equal to the returned HexUInt hash.
const NO_CONTENT_BLAKE2B256 = src_1.Hex.of('0x0e5751c026e543b2e8ab2eb06099daa1d1e5df47778f7787faab45cdf12fe3a8');
/**
 * Test Blake2b256 class.
 * @group unit/hash
 */
(0, globals_1.describe)('Blake2b256 class tests', () => {
    (0, globals_1.describe)('Polymorphism equivalence', () => {
        (0, globals_1.test)('Equal for bigint, bytes, hex expression, number', () => {
            const ofBi = src_1.Blake2b256.of(255n);
            const ofBytes = src_1.Blake2b256.of(Uint8Array.of(255));
            const ofHex = src_1.Blake2b256.of('0xff');
            const ofN = src_1.Blake2b256.of(255);
            (0, globals_1.expect)(ofBi.isEqual(ofBytes)).toBeTruthy();
            (0, globals_1.expect)(ofBytes.isEqual(ofHex)).toBeTruthy();
            (0, globals_1.expect)(ofHex.isEqual(ofN)).toBeTruthy();
        });
    });
    (0, globals_1.test)('Return hash for content', () => {
        const hash = src_1.Blake2b256.of(fixture_1.CONTENT);
        (0, globals_1.expect)(hash.isEqual(CONTENT_BLAKE2B256)).toBe(true);
    });
    (0, globals_1.test)('Return hash for no content', () => {
        const hash = src_1.Blake2b256.of(fixture_1.NO_CONTENT);
        (0, globals_1.expect)(hash.isEqual(NO_CONTENT_BLAKE2B256)).toBe(true);
    });
    (0, globals_1.test)('Throw an exception for illegal content', () => {
        (0, globals_1.expect)(() => src_1.Blake2b256.of('0xfoe')).toThrow(sdk_errors_1.InvalidOperation);
    });
});
