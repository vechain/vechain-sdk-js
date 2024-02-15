// Define the glob pattern
import { glob } from 'glob';

/**
 * Pattern to match all test files starting from the root of the project
 */
const test_pattern = './packages/**/**/*.test.ts';

/**
 * Allowed names for test files
 */
const allowed_names = [
    // Unit tests
    '.unit.test.ts',

    // Integration tests
    '.testnet.test.ts',
    '.mainnet.test.ts',
    '.solo.test.ts',

    // Mocks
    '.mock.testnet.ts',
    '.mock.mainnet.ts',
    '.mock.solo.ts'
];

/**
 * Exit with error code 1 if any test file is not named correctly.
 * The Default exit code is 0.
 * As good programmers, we assume we're naming tests correctly :D
 */
let exit_code = 0;

/**
 * Get all test files
 */
glob(test_pattern, { ignore: 'node_modules/**' }).then((test_files) => {
    /**
     * Iterate over all test files to check if they are named correctly
     */
    test_files.forEach((file) => {
        // File naming is not ok by default
        let file_naming_ok = false;

        /**
         * Iterate over all allowed names to check if the file is named correctly
         */
        allowed_names.forEach((allowed_name) => {
            if (file.endsWith(allowed_name)) {
                file_naming_ok = true;
            }
        });

        if (!file_naming_ok) {
            console.error(`Test file ${file} is not named correctly`);
            exit_code = 1;
        }
    });
});

process.exit(exit_code);
