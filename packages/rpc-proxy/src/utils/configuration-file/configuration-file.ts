import type { Config } from '../../types';
import path from 'path';
import fs from 'fs';
import {
    InvalidConfigurationFile,
    InvalidConfigurationFilePath
} from '@vechain/sdk-errors';

// /**
//  * Parse a valid JSON of a configuration file.
//  * Configuration file is found AND it is a valid JSON.
//  * We need only to check if all fields are present AND valid.
//  * @param configuration Configuration object
//  * @param filePath Path to the configuration file
//  * @throws {InvalidConfigurationFile}
//  */
// function _parseConfiguration(configuration: Config, filePath?: string): void {
//     // Check accounts
//     if (
//         configuration.accounts !== undefined &&
//         configuration.accounts !== null
//     ) {
//         // Array of accounts - Check all private keys
//         if (Array.isArray(configuration.accounts)) {
//             configuration.accounts.forEach((account) => {
//                 if (!secp256k1.isValidPrivateKey(Hex.of(account).bytes)) {
//                     throw new InvalidConfigurationFile(
//                         '_parseConfiguration()',
//                         'An invalid account private key is present in the configuration file',
//                         {
//                             filePath,
//                             wrongField: 'accounts'
//                         }
//                     );
//                 }
//             });
//         }
//
//         // Mnemonic - Check the mnemonic
//         else {
//             try {
//                 HDNode.fromMnemonic(configuration.accounts.mnemonic.split(' '));
//             } catch (e) {
//                 throw new InvalidConfigurationFile(
//                     '_parseConfiguration()',
//                     'An invalid mnemonic is present in the configuration file',
//                     {
//                         filePath,
//                         wrongField: 'accounts.mnemonic'
//                     },
//                     e
//                 );
//             }
//         }
//     }
// }

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
 * * The configuration file exists
 * * The configuration file is a valid JSON
 *
 * @param filePath The path to the configuration file.
 * @returns The configuration object.
 * @throws {InvalidConfigurationFilePath, InvalidConfigurationFile}
 */
function checkValidConfigurationFile(filePath: string): void {
    // Resolve the absolute path of the configuration file
    _checkConfigurationFileExists(filePath);

    // Read the configuration file
    _checkIfConfigurationFileIsAValidJSON(filePath);
}

/**
 * Init configuration from command line arguments options.
 *
 * @note: The arguments and file are assumed to be valid.
 * It because we have already called the parseArgsOptions() function.
 * @param options - Command line arguments options
 * @returns Configuration object
 */
// function initConfiguration(
//     options: OptionValues,
//     defaultConfiguration: Config
// ): Config {
//     // Configuration file is provided with --configurationFile OR -c
//     if (
//         options.configurationFile !== undefined &&
//         options.configurationFile !== null
//     ) {
//         return _readAndValidateConfigurationFile(
//             options.configurationFile as string
//         );
//     }
//
//     // Configuration file is NOT provided.
//     // Init the default configuration AND override with command line arguments
//     const configuration: Config = defaultConfiguration;
//
//     // URL provided
//     if (options.url !== undefined && options.url !== null)
//         configuration.url = options.url as string;
//
//     // Port provided
//     if (options.port !== undefined && options.port !== null)
//         configuration.port = Number.parseInt(options.port as string);
//
//     // Configuration from command line arguments
//     return configuration;
// }

export {
    // initConfiguration,
    checkValidConfigurationFile,
    getConfigObjectFromFile
};
