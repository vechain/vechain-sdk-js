"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const nc_utils = __importStar(require("@noble/curves/abstract/utils"));
const src_1 = require("../../src");
const sdk_errors_1 = require("@vechain/sdk-errors");
const BloomFilterFixture = {
    emptySetBytes: Uint8Array.of(0, 0, 0, 0, 0, 0, 0, 0),
    setA: [
        src_1.Hex.of(src_1.Txt.of('key.a.0').bytes),
        src_1.Hex.of(src_1.Txt.of('key.a.1').bytes),
        src_1.Hex.of(src_1.Txt.of('key.a.2').bytes)
    ],
    setABytes: Uint8Array.of(5, 42, 16, 4, 130, 8, 41, 130),
    setB: [
        src_1.Hex.of(src_1.Txt.of('key.b.0').bytes),
        src_1.Hex.of(src_1.Txt.of('key.b.1').bytes),
        src_1.Hex.of(src_1.Txt.of('key.b.2').bytes)
    ],
    setK: [
        { actualK: 1, expectedK: 1, expectedM: 2 },
        { actualK: 2, expectedK: 1, expectedM: 2 },
        { actualK: 4, expectedK: 2, expectedM: 3 },
        { actualK: 8, expectedK: 5, expectedM: 8 },
        { actualK: 16, expectedK: 11, expectedM: 16 },
        { actualK: 20, expectedK: 13, expectedM: 19 },
        { actualK: 32, expectedK: 22, expectedM: 32 },
        { actualK: 64, expectedK: 30, expectedM: 44 },
        { actualK: 128, expectedK: 30, expectedM: 44 },
        { actualK: 256, expectedK: 30, expectedM: 44 },
        { actualK: 512, expectedK: 30, expectedM: 44 },
        { actualK: 1024, expectedK: 30, expectedM: 44 }
    ]
};
/**
 * Test BloomFilter class.
 * @group unit/vcdm
 */
(0, globals_1.describe)('BloomFilter class tests.', () => {
    (0, globals_1.describe)('VeChain Data Model tests', () => {
        (0, globals_1.test)('Return a bi value', () => {
            const bf = src_1.BloomFilter.of(...BloomFilterFixture.setA).build();
            (0, globals_1.expect)(bf.bi).toEqual(nc_utils.bytesToNumberBE(BloomFilterFixture.setABytes));
        });
        (0, globals_1.test)('Return a n value', () => {
            const expected = Uint8Array.of(0, 0, 0, 32, 0, 0, 64, 0);
            const bf = src_1.BloomFilter.of(src_1.Hex.of('0xff')).build(2, 2);
            (0, globals_1.expect)(bf.n).toEqual(Number(nc_utils.bytesToNumberBE(expected)));
        });
        (0, globals_1.test)('Throw an exception if the filter cannot cast to n', () => {
            (0, globals_1.expect)(() => {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                src_1.BloomFilter.of(...BloomFilterFixture.setA).build().n;
            }).toThrow(sdk_errors_1.InvalidDataType);
        });
        (0, globals_1.describe)('compareTo method tests', () => {
            (0, globals_1.test)('compareTo method for different k', () => {
                const bf1 = src_1.BloomFilter.of(...BloomFilterFixture.setA).build(2);
                const bf2 = src_1.BloomFilter.of(...BloomFilterFixture.setA).build(5);
                (0, globals_1.expect)(bf1.compareTo(bf2)).toBe(-1);
            });
            (0, globals_1.test)('compareTo method for same k', () => {
                const bf1 = src_1.BloomFilter.of(...BloomFilterFixture.setA).build();
                const bf2 = src_1.BloomFilter.of(...BloomFilterFixture.setB).build();
                (0, globals_1.expect)(bf1.k).toBe(bf2.k);
                (0, globals_1.expect)(bf1.compareTo(bf2)).toBe(-1);
            });
        });
        (0, globals_1.describe)('isEqual method tests', () => {
            (0, globals_1.test)('Return false', () => {
                const bf1 = src_1.BloomFilter.of(...BloomFilterFixture.setA).build();
                const bf2 = src_1.BloomFilter.of(...BloomFilterFixture.setB).build();
                (0, globals_1.expect)(bf1.isEqual(bf2)).toBe(false);
            });
            (0, globals_1.test)('Return false for same k', () => {
                const bf1 = src_1.BloomFilter.of(...BloomFilterFixture.setA).build(2);
                const bf2 = src_1.BloomFilter.of(...BloomFilterFixture.setA).build();
                (0, globals_1.expect)(bf1.isEqual(bf2)).toBe(false);
            });
            (0, globals_1.test)('Return true', () => {
                const bf1 = src_1.BloomFilter.of(...BloomFilterFixture.setA).build();
                const bf2 = src_1.BloomFilter.of(...BloomFilterFixture.setA).build();
                (0, globals_1.expect)(bf1.isEqual(bf2)).toBe(true);
            });
        });
    });
    (0, globals_1.describe)('Construction tests', () => {
        (0, globals_1.test)('Return an empty filter', () => {
            const bf = src_1.BloomFilter.of().build();
            (0, globals_1.expect)(bf).toBeInstanceOf(src_1.BloomFilter);
            (0, globals_1.expect)(bf.bytes).toEqual(BloomFilterFixture.emptySetBytes);
        });
        (0, globals_1.test)('Return a not empty filter from bytes', () => {
            const bf = src_1.BloomFilter.of(...BloomFilterFixture.setA.map((e) => e.bytes)).build();
            (0, globals_1.expect)(bf).toBeInstanceOf(src_1.BloomFilter);
            (0, globals_1.expect)(bf.bytes).toEqual(BloomFilterFixture.setABytes);
        });
        (0, globals_1.test)('Return a not empty filter from Hex', () => {
            const bf = src_1.BloomFilter.of(...BloomFilterFixture.setA).build();
            (0, globals_1.expect)(bf).toBeInstanceOf(src_1.BloomFilter);
            (0, globals_1.expect)(bf.bytes).toEqual(BloomFilterFixture.setABytes);
        });
        (0, globals_1.test)('Return a not empty filter with custom k and m', () => {
            const m = 32; // Bits per key.
            const k = src_1.BloomFilter.computeBestHashFunctionsQuantity(m);
            const keys = [];
            for (let i = 0; i < 255; i++) {
                keys.push(src_1.HexUInt.of(i));
            }
            const bf = src_1.BloomFilter.of(...keys).build(k, m);
            (0, globals_1.expect)(bf).toBeInstanceOf(src_1.BloomFilter);
            (0, globals_1.expect)(bf.k).toBe(k);
            (0, globals_1.expect)(bf.bytes.byteLength).toEqual(1020);
        });
    });
    (0, globals_1.describe)('contains method test', () => {
        (0, globals_1.test)('Return false for not set members as bytes', () => {
            const bf = src_1.BloomFilter.of(...BloomFilterFixture.setA).build();
            BloomFilterFixture.setB
                .map((e) => e.bytes)
                .forEach((key) => {
                (0, globals_1.expect)(bf.contains(key)).toBe(false);
            });
        });
        (0, globals_1.test)('Return false for not set members as Hex', () => {
            const bf = src_1.BloomFilter.of(...BloomFilterFixture.setA).build();
            BloomFilterFixture.setB.forEach((key) => {
                (0, globals_1.expect)(bf.contains(key)).toBe(false);
            });
        });
        (0, globals_1.test)('Return true for set members as bytes', () => {
            const bf = src_1.BloomFilter.of(...BloomFilterFixture.setA).build();
            BloomFilterFixture.setA
                .map((e) => e.bytes)
                .forEach((key) => {
                (0, globals_1.expect)(bf.contains(key)).toBe(true);
            });
        });
        (0, globals_1.test)('Return true for set members as Hex', () => {
            const bf = src_1.BloomFilter.of(...BloomFilterFixture.setA).build();
            BloomFilterFixture.setA.forEach((key) => {
                (0, globals_1.expect)(bf.contains(key)).toBe(true);
            });
        });
        (0, globals_1.test)('Return true for members of a set built with custom k and m', () => {
            const m = 16; // Bits per key.
            const k = src_1.BloomFilter.computeBestHashFunctionsQuantity(m);
            const keys = [];
            for (let i = 0; i < 255; i++) {
                keys.push(src_1.HexUInt.of(i));
            }
            const bf = src_1.BloomFilter.of(...keys).build(k, m);
            keys.forEach((key) => {
                (0, globals_1.expect)(bf.contains(key)).toBe(true);
            });
        });
        (0, globals_1.test)('Should maintain a reasonable false positive rate', () => {
            const m = 16; // Bits per key.
            const k = src_1.BloomFilter.computeBestHashFunctionsQuantity(m);
            const size = 1024;
            const aliens = [];
            const members = [];
            for (let i = 0; i < size; i++) {
                members.push(src_1.HexUInt.of(i));
                aliens.push(src_1.HexUInt.of(size * i)); // Aliens most be values far enough from members' value.
            }
            const bf = src_1.BloomFilter.of(...members).build(k, m);
            let falsePositives = 0;
            for (let i = 0; i < size; i++) {
                if (bf.contains(aliens[i])) {
                    falsePositives++;
                }
            }
            const falsePositiveRate = falsePositives / size;
            // Uncomment for false positive rate percentage.
            // console.debug(`False positive rate: ${falsePositiveRate * 100}%`);
            (0, globals_1.expect)(falsePositiveRate).toBeLessThan(0.01);
        });
    });
    (0, globals_1.describe)('isJoinable method test', () => {
        (0, globals_1.test)('Return false for different k values', () => {
            const bf1 = src_1.BloomFilter.of(...BloomFilterFixture.setA).build();
            const bf2 = src_1.BloomFilter.of(...BloomFilterFixture.setA).build(16);
            (0, globals_1.expect)(bf1.isJoinable(bf2)).toBeFalsy();
        });
        (0, globals_1.test)('Return false for different length values', () => {
            const k = 8;
            const m1 = 32; // Number of hash functions for the first set.
            const m2 = 32 ** 2; // The number of hash functions for second set must be very different to result in different sets' sizes when k is the same.
            const bf1 = src_1.BloomFilter.of(...BloomFilterFixture.setA).build(k, m1);
            const bf2 = src_1.BloomFilter.of(...BloomFilterFixture.setA).build(k, m2);
            (0, globals_1.expect)(bf1.isJoinable(bf2)).toBeFalsy();
        });
        (0, globals_1.test)('Return true for same length and k values', () => {
            const bfA = src_1.BloomFilter.of(...BloomFilterFixture.setA).build();
            const bfB = src_1.BloomFilter.of(...BloomFilterFixture.setB).build();
            (0, globals_1.expect)(bfA.isJoinable(bfB)).toBeTruthy();
        });
    });
    (0, globals_1.describe)('join method test', () => {
        (0, globals_1.test)('Return the join set', () => {
            const bfA = src_1.BloomFilter.of(...BloomFilterFixture.setA).build();
            const bfB = src_1.BloomFilter.of(...BloomFilterFixture.setB).build();
            const bfJ = bfA.join(bfB);
            BloomFilterFixture.setA.forEach((key) => {
                (0, globals_1.expect)(bfJ.contains(key)).toBe(true);
            });
            BloomFilterFixture.setB.forEach((key) => {
                (0, globals_1.expect)(bfJ.contains(key)).toBe(true);
            });
        });
        (0, globals_1.test)('Throw an exception when k values are different', () => {
            const bf1 = src_1.BloomFilter.of(...BloomFilterFixture.setA).build();
            const bf2 = src_1.BloomFilter.of(...BloomFilterFixture.setA).build(16);
            (0, globals_1.expect)(() => {
                bf1.join(bf2);
            }).toThrow(sdk_errors_1.InvalidOperation);
        });
        (0, globals_1.test)('Throw an exception when length values are different', () => {
            const k = 8;
            const m1 = 32; // Number of hash functions for the first set.
            const m2 = 32 ** 2; // The number of hash functions for second set must be very different to result in different sets' sizes when k is the same.
            const bf1 = src_1.BloomFilter.of(...BloomFilterFixture.setA).build(k, m1);
            const bf2 = src_1.BloomFilter.of(...BloomFilterFixture.setA).build(k, m2);
            (0, globals_1.expect)(() => {
                bf1.join(bf2);
            }).toThrow(sdk_errors_1.InvalidOperation);
        });
    });
    (0, globals_1.test)('computeBestBitsPerKey (m) method test', () => {
        BloomFilterFixture.setK.forEach((testCase) => {
            (0, globals_1.expect)(src_1.BloomFilter.computeBestBitsPerKey(src_1.BloomFilter.computeBestHashFunctionsQuantity(testCase.actualK))).toBe(testCase.expectedM);
        });
    });
    (0, globals_1.test)('computeBestHashFunctionsQuantity (k) method test', () => {
        BloomFilterFixture.setK.forEach((testCase) => {
            (0, globals_1.expect)(src_1.BloomFilter.computeBestHashFunctionsQuantity(testCase.actualK)).toBe(testCase.expectedK);
        });
    });
});
