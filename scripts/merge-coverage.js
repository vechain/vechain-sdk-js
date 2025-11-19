"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const fs = __importStar(require("fs-extra"));
const glob_1 = require("glob");
/**
 * Default directory paths for coverage reports.
 */
const COVERAGE_DIRS = glob_1.glob
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
const run = (commands) => {
    for (const command of commands) {
        try {
            (0, child_process_1.execSync)(command, { stdio: 'inherit' });
        }
        catch (error) {
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
const copyIfExists = (src, dest) => {
    if (fs.existsSync(src)) {
        try {
            fs.copyFileSync(src, dest);
            console.log(`Copied ${src} to ${dest}`);
        }
        catch (error) {
            console.error(`Error copying file from ${src} to ${dest}:`, error);
        }
    }
    else {
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
const mergeCoverage = () => {
    fs.emptyDirSync(FINAL_DIR);
    for (const dir of COVERAGE_DIRS) {
        const fileName = dir.split('/')[1];
        copyIfExists(`${dir}/coverage-final.json`, `${FINAL_DIR}/${fileName}-report.json`);
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
