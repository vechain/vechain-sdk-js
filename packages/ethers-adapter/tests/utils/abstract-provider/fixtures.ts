/**
 * Fixtures for isPromise
 */
const isPromiseFixtures = [
    {
        value: Promise.resolve(),
        expected: true
    },
    { value: undefined, expected: false },
    { value: null, expected: false },
    { value: 0, expected: false },
    { value: '', expected: false },
    { value: {}, expected: false },
    { value: setTimeout, expected: false },
    { value: Promise, expected: false }
];

/**
 * Fixtures for concisify
 */
const concisifyFixtures = [
    {
        value: ['a', 'b', 'c', 'a', 'b', 'c'],
        expected: ['a', 'b', 'c']
    },
    {
        value: ['a', 'b'],
        expected: ['a', 'b']
    },
    {
        value: ['a', 'b', 'c', 'a', 'b', 'c', 'a', 'b', 'c'],
        expected: ['a', 'b', 'c']
    }
];

/**
 * Fixtures for isTransactionHash
 */
const isTransactionHashFixtures = [
    {
        value: '0x000',
        expected: false
    },
    {
        value: '0x',
        expected: false
    },
    {
        value: 'invalid',
        expected: false
    },
    {
        value: '0x271f7db20141001975f71deb8fca90d6b22b8d6610dfb5a3e0bbeaf78b5a4891',
        expected: true
    }
];

/**
 * Fixtures for isEventFilter
 */
const isEventFilterFixtures = [
    {
        value: '0x000',
        expected: false
    },
    {
        value: ['invalid'],
        expected: false
    },
    {
        value: { orphan: true },
        expected: false
    },
    {
        value: { address: '0x000' },
        expected: true
    },
    {
        value: { topics: ['0x000'] },
        expected: true
    },
    {
        value: { address: '0x000', topics: ['0x000'] },
        expected: true
    }
];

export {
    isPromiseFixtures,
    concisifyFixtures,
    isTransactionHashFixtures,
    isEventFilterFixtures
};
