/**
 * K parameter of bloom with expected value
 */
const bloomKTestCases = [
    { calculateK: 1, estimatedK: 1, bitsPerKey: 2 },
    { calculateK: 2, estimatedK: 1, bitsPerKey: 2 },
    { calculateK: 4, estimatedK: 2, bitsPerKey: 3 },
    { calculateK: 8, estimatedK: 5, bitsPerKey: 8 },
    { calculateK: 16, estimatedK: 11, bitsPerKey: 16 },
    { calculateK: 20, estimatedK: 13, bitsPerKey: 19 },
    { calculateK: 32, estimatedK: 22, bitsPerKey: 32 },
    { calculateK: 64, estimatedK: 30, bitsPerKey: 44 },
    { calculateK: 128, estimatedK: 30, bitsPerKey: 44 },
    { calculateK: 256, estimatedK: 30, bitsPerKey: 44 },
    { calculateK: 512, estimatedK: 30, bitsPerKey: 44 },
    { calculateK: 1024, estimatedK: 30, bitsPerKey: 44 }
];

export { bloomKTestCases };
