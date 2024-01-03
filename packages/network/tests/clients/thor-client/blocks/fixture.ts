/**
 * waitForBlock test cases
 */
const waitForBlockTestCases = [
    {
        description:
            'Should wait for block without timeoutMs and intervalMs and return BlockDetail',
        options: {
            timeoutMs: undefined,
            intervalMs: undefined
        }
    },
    {
        description:
            'Should wait for block with timeoutMs and return BlockDetail',
        options: {
            timeoutMs: 10000,
            intervalMs: undefined
        }
    },
    {
        description:
            'Should wait for transaction with intervalMs and return BlockDetail',
        options: {
            timeoutMs: undefined,
            intervalMs: 1000
        }
    },
    {
        description:
            'Should wait for transaction with intervalMs & timeoutMs and return BlockDetail',
        options: {
            timeoutMs: 11000,
            intervalMs: 1000
        }
    }
];

export { waitForBlockTestCases };
