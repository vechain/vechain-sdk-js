import {
    InvalidConfigurationFile,
    InvalidConfigurationFilePath
} from '@vechain/sdk-errors';
import fs from 'fs';
import path from 'path';
import type { Config } from '../../types';
import {
    isValidAccountsAsListOfPrivateKeys,
    isValidAccountsAsMnemonic,
    isValidGasPayerPrivateKey,
    isValidGasPayerServiceUrl,
    isValidPort,
    isValidUrl
} from '../validators';

/**
 * Check of the configuration file exists.
 * @param filePath The path to the configuration file.
 * @throws {InvalidConfigurationFilePath}
 */
function _checkConfigurationFileExists(filePath: string): void {
    // Resolve the absolute path of the configuration file
    const absolutePath = path.resolve(filePath);

    // Throw an error if the configuration file does not exist
    if (!fs.existsSync(absolutePath) || filePath === '') {
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
    if (configFile.url !== undefined && !isValidUrl(configFile.url)) {
        throw new InvalidConfigurationFile(
            '_checkIfConfigurationFileHasCorrectStructure()',
            `Invalid url in configuration file: ${absolutePath}. URL is required`,
            {
                filePath
            }
        );
    }

    // Check the accounts (as an array or private keys)
    if (Array.isArray(configFile.accounts)) {
        if (!isValidAccountsAsListOfPrivateKeys(configFile.accounts))
            throw new InvalidConfigurationFile(
                '_checkIfConfigurationFileHasCorrectStructure()',
                `Invalid accounts in configuration file: ${absolutePath}. Accounts must be an array of valid private keys`,
                {
                    filePath
                }
            );
    } else if (!isValidAccountsAsMnemonic(configFile.accounts)) {
        throw new InvalidConfigurationFile(
            '_checkIfConfigurationFileHasCorrectStructure()',
            `Invalid accounts in configuration file: ${absolutePath}. Accounts must contain a valid mnemonic, count, and initialIndex`,
            {
                filePath
            }
        );
    }

    // Check the gasPayer
    if (configFile.gasPayer !== undefined) {
        // Both gasPayer private key and url are given
        if (
            configFile.gasPayer.gasPayerPrivateKey !== undefined &&
            configFile.gasPayer.gasPayerServiceUrl !== undefined
        ) {
            throw new InvalidConfigurationFile(
                '_checkIfConfigurationFileHasCorrectStructure()',
                `Invalid gasPayer configuration in configuration file: ${absolutePath}. The gasPayer configuration must contain either a private key or a URL, not both`,
                {
                    filePath
                }
            );
        }

        // Invalid gasPayer private key
        if (
            configFile.gasPayer.gasPayerPrivateKey !== undefined &&
            !isValidGasPayerPrivateKey(configFile.gasPayer.gasPayerPrivateKey)
        ) {
            throw new InvalidConfigurationFile(
                '_checkIfConfigurationFileHasCorrectStructure()',
                `Invalid gasPayer private key in configuration file: ${absolutePath}. The gasPayer private key must be a valid private key`,
                {
                    filePath
                }
            );
        }

        // Invalid gasPayer url
        if (
            configFile.gasPayer.gasPayerServiceUrl !== undefined &&
            !isValidGasPayerServiceUrl(configFile.gasPayer.gasPayerServiceUrl)
        ) {
            throw new InvalidConfigurationFile(
                '_checkIfConfigurationFileHasCorrectStructure()',
                `Invalid gasPayer service url in configuration file: ${absolutePath}. DThe gasPayer service url must be a valid URL`,
                {
                    filePath
                }
            );
        }
    }

    // Check the verbose flag
    if (
        configFile.verbose !== undefined &&
        typeof configFile.verbose !== 'boolean'
    ) {
        throw new InvalidConfigurationFile(
            '_checkIfConfigurationFileHasCorrectStructure()',
            `Invalid verbose flag in configuration file: ${absolutePath}. Verbose flag must be a boolean`,
            {
                filePath
            }
        );
    }

    // Check the enableDelegation flag
    if (
        configFile.enableDelegation !== undefined &&
        typeof configFile.enableDelegation !== 'boolean'
    ) {
        throw new InvalidConfigurationFile(
            '_checkIfConfigurationFileHasCorrectStructure()',
            `Invalid enableDelegation flag in configuration file: ${absolutePath}. enableDelegation flag must be a boolean`,
            {
                filePath
            }
        );
    }

    // NOTE: Here we know all the fields are valid. So we can check the semantics of the fields.

    // Delegation cannot be enabled without a gasPayer
    if (
        (configFile.enableDelegation as boolean) &&
        configFile.gasPayer === undefined
    ) {
        throw new InvalidConfigurationFile(
            '_checkIfConfigurationFileHasCorrectStructure()',
            `Invalid configuration file: ${absolutePath}. The gasPayer configuration must be removed when enableDelegation is false`,
            {
                filePath
            }
        );
    }
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
