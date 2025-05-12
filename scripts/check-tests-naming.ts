// Define the glob pattern
import { glob } from 'glob';

/**
 * Pattern to match all test files starting from the root of the project
 */
const testPattern = './**/tests/**/*.test.ts';

/**
 * Allowed names for test files
 */
const allowedNames = [
    // Unit tests
    '.unit.test.ts',

    // Integration tests
    '.testnet.test.ts',
    '.mainnet.test.ts',
    '.solo.test.ts',

    // Mocks
    '.mock.testnet.test.ts',
    '.mock.mainnet.test.ts',
    '.mock.solo.test.ts',
    '.mock.unit.test.ts',
    '.mock.test.ts'
];

/**
 * Exit with error code 1 if any test file is not named correctly.
 * The Default exit code is 0.
 * As good programmers, we assume we're naming tests correctly :D
 */
let exitCode = 0;

/**
 * Get all test files
 */
void glob(testPattern, { ignore: 'node_modules/**' }).then((testFiles) => {
    /**
     * Iterate over all test files to check if they are named correctly
     */
    testFiles.forEach((file) => {
        // File naming is not ok by default
        let fileNamingOk = false;

        /**
         * Iterate over all allowed names to check if the file is named correctly
         */
        allowedNames.forEach((allowedName) => {
            if (file.endsWith(allowedName)) {
                fileNamingOk = true;
            }
        });

        if (!fileNamingOk) {
            console.error(`Test file \`${file}\` is not named correctly`);
            exitCode = 1;
        }
    });

    // Exit with the correct code
    process.exit(exitCode);
});
