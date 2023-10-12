/**
 * K parameter of bloom with expected value
 */
const bloomKTestCases = [
    { calculateK: 1, estimatedK: 1 },
    { calculateK: 2, estimatedK: 1 },
    { calculateK: 4, estimatedK: 2 },
    { calculateK: 8, estimatedK: 5 },
    { calculateK: 16, estimatedK: 11 },
    { calculateK: 20, estimatedK: 13 },
    { calculateK: 32, estimatedK: 22 },
    { calculateK: 64, estimatedK: 30 },
    { calculateK: 128, estimatedK: 30 },
    { calculateK: 256, estimatedK: 30 },
    { calculateK: 512, estimatedK: 30 },
    { calculateK: 1024, estimatedK: 30 }
];

export { bloomKTestCases };
