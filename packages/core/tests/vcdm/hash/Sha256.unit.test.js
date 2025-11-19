"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const sdk_errors_1 = require("@vechain/sdk-errors");
const src_1 = require("../../../src");
const fixture_1 = require("./fixture");
// Hex on purpose because it must be equal to the returned HexUInt hash.
const CONTENT_SHA256 = src_1.Hex.of('0xdb484f1fdd0c7ae9268a04a876ee4d1b1c40f801e80e56ff718b198aa2f1166f');
// Hex on purpose because it must be equal to the returned HexUInt hash.
const NO_CONTENT_SHA256 = src_1.Hex.of('0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
/**
 * Test Sha256 class.
 * @group unit/hash
 */
(0, globals_1.describe)('Sha256 class tests', () => {
    (0, globals_1.describe)('Polymorphism equivalence', () => {
        (0, globals_1.test)('Equal for bigint, bytes, hex expression, number', () => {
            const ofBi = src_1.Sha256.of(255n);
            const ofBytes = src_1.Sha256.of(Uint8Array.of(255));
            const ofHex = src_1.Sha256.of('0xff');
            const ofN = src_1.Sha256.of(255);
            (0, globals_1.expect)(ofBi.isEqual(ofBytes)).toBeTruthy();
            (0, globals_1.expect)(ofBytes.isEqual(ofHex)).toBeTruthy();
            (0, globals_1.expect)(ofHex.isEqual(ofN)).toBeTruthy();
        });
    });
    (0, globals_1.test)('Return hash for content', () => {
        const hash = src_1.Sha256.of(fixture_1.CONTENT.bytes);
        (0, globals_1.expect)(hash.isEqual(CONTENT_SHA256)).toBe(true);
    });
    (0, globals_1.test)('Return hash for no content', () => {
        const hash = src_1.Sha256.of(fixture_1.NO_CONTENT.bytes);
        (0, globals_1.expect)(hash.isEqual(NO_CONTENT_SHA256)).toBe(true);
    });
    (0, globals_1.test)('Throw an exception for illegal content', () => {
        (0, globals_1.expect)(() => src_1.Sha256.of('0xfoe')).toThrow(sdk_errors_1.InvalidOperation);
    });
});
