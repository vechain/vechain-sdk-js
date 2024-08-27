import type { Config } from '../../types';
import path from 'path';
import fs from 'fs';
import {
    InvalidConfigurationFile,
    InvalidConfigurationFilePath
} from '@vechain/sdk-errors';
import { isValidPort, isValidUrl } from '../validators';

/**
 * Check of the configuration file exists.
 * @param filePath The path to the configuration file.
 * @throws {InvalidConfigurationFilePath}
 */
function _checkConfigurationFileExists(filePath: string): void {
    // Resolve the absolute path of the configuration file
    const absolutePath = path.resolve(filePath);

    // Throw an error if the configuration file does not exist
    if (!fs.existsSync(absolutePath)) {
        throw new InvalidConfigurationFilePath(
            '_checkConfigurationFileExists()',
            `Configuration file not found: ${absolutePath}`,
            {
                filePath
            }
        );
    }
}

/**
 * Check if the configuration file is a valid JSON.
 * @param filePath The path to the configuration file.
 * @throws {InvalidConfigurationFile}
 */
function _checkIfConfigurationFileIsAValidJSON(filePath: string): void {
    // Resolve the absolute path of the configuration file
    const absolutePath = path.resolve(filePath);

    // Read the configuration file
    const fileContent = fs.readFileSync(absolutePath, 'utf-8');

    // Try to parse the JSON configuration file
    try {
        JSON.parse(fileContent) as Config;
    } catch (e) {
        throw new InvalidConfigurationFile(
            '_readAndValidateConfigurationFile()',
            `Cannot parse configuration file: ${absolutePath}. It is not a valid JSON file`,
            {
                filePath
            },
            e
        );
    }
}

/**
 * Check if the configuration file is has the correct structure.
 * @param filePath The path to the configuration file.
 * @throws {InvalidConfigurationFile}
 */
function _checkIfConfigurationFileHasCorrectStructure(filePath: string): void {
    // Resolve the absolute path of the configuration file
    const absolutePath = path.resolve(filePath);

    // Read the configuration file
    const fileContent = fs.readFileSync(absolutePath, 'utf-8');

    // Try to parse the JSON configuration file
    const configFile = JSON.parse(fileContent) as Config;

    // Check the port
    if (configFile.port !== undefined && !isValidPort(configFile.port)) {
        throw new InvalidConfigurationFile(
            '_checkIfConfigurationFileHasCorrectStructure()',
            `Invalid port in configuration file: ${absolutePath}. Port must be a positive integer`,
            {
                filePath
            }
        );
    }

    // Check the url
    if (configFile.url === undefined && !isValidUrl(configFile.url)) {
        throw new InvalidConfigurationFile(
            '_checkIfConfigurationFileHasCorrectStructure()',
            `Invalid url in configuration file: ${absolutePath}. URL is required`,
            {
                filePath
            }
        );
    }

    // ********* START: TEMPORARY COMMENT *********
    // Finish all the checks for the configuration file
    // ********* END: TEMPORARY COMMENT ********
}

/**
 * Get the configuration object from the configuration file.
 *
 * @note: The configuration file is assumed to be valid.
 * Before calling this function, check the configuration file with
 * the checkValidConfigurationFile() function.
 *
 * @param filePath The path to the configuration file.
 * @returns The configuration object.
 */
function getConfigObjectFromFile(filePath: string): Config {
    // Resolve the absolute path of the configuration file
    const absolutePath = path.resolve(filePath);

    // Read the configuration file
    const fileContent = fs.readFileSync(absolutePath, 'utf-8');

    // Parse the JSON configuration file
    return JSON.parse(fileContent) as Config;
}

/**
 * Read and parse the configuration file.
 * Check if:
 * * The configuration file exists.
 * * The configuration file is a valid JSON.
 * * The configuration file has the correct structure.
 *
 * @param filePath The path to the configuration file.
 * @returns The configuration object.
 * @throws {InvalidConfigurationFilePath, InvalidConfigurationFile}
 */
function checkValidConfigurationFile(filePath: string): void {
    // Check if the configuration file exists
    _checkConfigurationFileExists(filePath);

    // Check if the configuration file is a valid JSON
    _checkIfConfigurationFileIsAValidJSON(filePath);

    // The configuration has a valid structure
    _checkIfConfigurationFileHasCorrectStructure(filePath);
}

export { checkValidConfigurationFile, getConfigObjectFromFile };
