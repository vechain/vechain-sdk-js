import { execSync } from 'child_process';
import * as fs from 'fs-extra';
import { glob } from 'glob';

/**
 * Default directory paths for coverage reports.
 */
const COVERAGE_DIRS = glob
    .sync('*/', { cwd: './packages' })
    .map((dir) => `packages/${dir}/coverage`);

/**
 * Default directory path for final merged  coverage report.
 */
const FINAL_DIR = 'coverage';

/**
 * Executes an array of shell commands.
 *
 * @param commands - Array of commands to execute.
 */
const run = (commands: string[]): void => {
    for (const command of commands) {
        try {
            execSync(command, { stdio: 'inherit' });
        } catch (error) {
            console.error(`Error executing command ${command}:`, error);
        }
    }
};

/**
 * Copies a file from source to destination if the source file exists.
 *
 * @param src - Path of the source file.
 * @param dest - Path of the destination file.
 */
const copyIfExists = (src: string, dest: string): void => {
    if (fs.existsSync(src)) {
        try {
            fs.copyFileSync(src, dest);
            console.log(`Copied ${src} to ${dest}`);
        } catch (error) {
            console.error(`Error copying file from ${src} to ${dest}:`, error);
        }
    } else {
        console.log(`File ${src} does not exist`);
    }
};

/**
 * Merges coverage reports from specified packages into a final coverage report.
 *
 * @remarks
 * This script iterates through the coverage directories of the specified packages,
 * copies the coverage-final.json file from each package to a common directory,
 * and then generates a merged LCOV report.
 *
 * Usage: Just run this script to merge coverage reports and generate a final LCOV report.
 */
const mergeCoverage = (): void => {
    fs.emptyDirSync(FINAL_DIR);

    for (const dir of COVERAGE_DIRS) {
        const fileName = dir.split('/')[1];
        copyIfExists(
            `${dir}/coverage-final.json`,
            `${FINAL_DIR}/${fileName}-report.json`
        );
    }

    fs.emptyDirSync('.nyc_output');

    run([
        `nyc merge ${FINAL_DIR} && mv coverage.json .nyc_output/out.json`,
        `nyc report --reporter lcov --reporter json-summary --report-dir ${FINAL_DIR}`,
        'rm -rf .nyc_output'
    ]);
};

/**
 * Usage: Call the mergeCoverage function to merge coverage reports and generate a final LCOV report.
 */
mergeCoverage();
