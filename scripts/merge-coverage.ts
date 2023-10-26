import { execSync } from 'child_process';
import * as fs from 'fs-extra';

/**
 * Default directory paths for coverage reports.
 */
const DEFAULT_DIRS = {
    unit: 'coverageUnit',
    integration: 'coverageIntegration',
    final: 'coverage'
};

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
 * Merges coverage reports from unit and integration tests into a final coverage report.
 *
 * @param dirs - (Optional) Directory paths for coverage reports. Defaults to DEFAULT_DIRS.
 */
const mergeCoverage = (dirs = DEFAULT_DIRS): void => {
    fs.emptyDirSync(dirs.final);

    copyIfExists(
        `${dirs.unit}/coverage-final.json`,
        `${dirs.final}/unit-report.json`
    );
    copyIfExists(
        `${dirs.integration}/coverage-final.json`,
        `${dirs.final}/integration-report.json`
    );

    fs.emptyDirSync('.nyc_output');

    run([
        `nyc merge ${dirs.final} && mv coverage.json .nyc_output/out.json`, // Merge coverage reports and move to .nyc_output
        `nyc report --reporter lcov --report-dir ${dirs.final}` // Generate Merged LCOV report
    ]);
};

/**
 * Usage: Call the mergeCoverage function to merge coverage reports and generate a final LCOV report.
 */
mergeCoverage();
