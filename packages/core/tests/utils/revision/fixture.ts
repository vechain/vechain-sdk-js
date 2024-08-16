/**
 * Test cases for the `isRevisionAccount` function.
 */
const accountRevisions = [
    {
        revision: 'invalid-address',
        expected: false
    },
    {
        revision: 'finalized',
        expected: true
    },
    {
        revision: '0x34123',
        expected: true
    },
    {
        revision: '100',
        expected: true
    },
    {
        revision: 100,
        expected: true
    },
    {
        revision: '0xG8656c6c6f',
        expected: false
    },
    {
        revision: 'best',
        expected: true
    }
];

/**
 * Test cases for the `isRevisionBlock` function.
 */
const blockRevisions = [
    {
        revision: 'invalid-address',
        expected: false
    },
    {
        revision: '0x542fd',
        expected: true
    },
    {
        revision: '100',
        expected: true
    },
    {
        revision: 100,
        expected: true
    },
    {
        revision: '0xG8656c6c6f',
        expected: false
    },
    {
        revision: 'best',
        expected: true
    },
    {
        revision: 'finalized',
        expected: true
    }
];

export { accountRevisions, blockRevisions };
