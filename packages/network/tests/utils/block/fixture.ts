import { testAccount } from '../../fixture';

/**
 * Test cases for the `isBlockRevision` function.
 */
const blockRevisions = [
    {
        revision: 'invalid-address',
        expected: false
    },
    {
        revision: testAccount,
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

export { blockRevisions };
