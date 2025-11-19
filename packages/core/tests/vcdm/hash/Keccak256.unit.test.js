"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const sdk_errors_1 = require("@vechain/sdk-errors");
const src_1 = require("../../../src");
const fixture_1 = require("./fixture");
// Hex on purpose because it must be equal to the returned HexUInt hash.
const CONTENT_KECCAK256 = src_1.Hex.of('0x1e86a83a4fcab1b47b8c961f7ab6c5d32927eefa8af20af81f6eab0bc3be582a');
// Hex on purpose because it must be equal to the returned HexUInt hash.
const NO_CONTENT_KECCAK256 = src_1.Hex.of('0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470');
/**
 * Test Keccak256 class.
 * @group unit/hash
 */
(0, globals_1.describe)('Keccak256 class tests', () => {
    (0, globals_1.describe)('Polymorphism equivalence', () => {
        (0, globals_1.test)('Equal for bigint, bytes, hex expression, number', () => {
            const ofBi = src_1.Keccak256.of(255n);
            const ofBytes = src_1.Keccak256.of(Uint8Array.of(255));
            const ofHex = src_1.Keccak256.of('0xff');
            const ofN = src_1.Keccak256.of(255);
            (0, globals_1.expect)(ofBi.isEqual(ofBytes)).toBeTruthy();
            (0, globals_1.expect)(ofBytes.isEqual(ofHex)).toBeTruthy();
            (0, globals_1.expect)(ofHex.isEqual(ofN)).toBeTruthy();
        });
    });
    (0, globals_1.test)('Return hash for content', () => {
        const hash = src_1.Keccak256.of(fixture_1.CONTENT);
        (0, globals_1.expect)(hash.isEqual(CONTENT_KECCAK256)).toBe(true);
    });
    (0, globals_1.test)('Return hash for no content', () => {
        const hash = src_1.Keccak256.of(fixture_1.NO_CONTENT);
        (0, globals_1.expect)(hash.isEqual(NO_CONTENT_KECCAK256)).toBe(true);
    });
    (0, globals_1.test)('Throw an exception for illegal content', () => {
        (0, globals_1.expect)(() => src_1.Keccak256.of('0xfoe')).toThrow(sdk_errors_1.InvalidOperation);
    });
});
