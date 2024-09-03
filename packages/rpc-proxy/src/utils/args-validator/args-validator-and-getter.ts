import { type Config } from '../../types';
import { type OptionValues } from 'commander';
import {
    checkValidConfigurationFile,
    getConfigObjectFromFile
} from '../config-validator';
import { ArgsValidator } from './args-validator';

/**
 * Main args validator AND getter object.
 *
 * It validates the command line arguments.
 * AND then it gets a fresh configuration with the validated arguments.
 *
 * ArgsValidatorAndGetter is used to validate and, then, get the configuration fields.
 */
const ArgsValidatorAndGetter = {
    /**
     * Validate configuration fields and get the configuration.
     * If a configuration file is provided, validate it and get the configuration.
     *
     * @param options Command line arguments options
     * @param defaultConfiguration Default configuration to use if no configuration file or arguments are provided
     * @returns Configuration object
     * @throws {InvalidConfigurationFilePath, InvalidConfigurationFile}
     */
    configurationFile: (
        options: OptionValues,
        defaultConfiguration: Config
    ): Config => {
        const configurationFile = ArgsValidator.configurationFile(
            options.configurationFile as string
        );
        if (configurationFile !== null) {
            // Check if the configuration file is valid JSON and if it exists
            checkValidConfigurationFile(configurationFile);

            // Return the configuration object from the configuration file
            return getConfigObjectFromFile(configurationFile);
        }
        return defaultConfiguration;
    },

    /**
     * Validate 'port' configuration field
     *
     * @param options Command line arguments options
     * @param currentConfiguration Default configuration to use if no field is provided
     * @returns Configuration object
     * @throws {InvalidCommandLineArguments}
     */
    port: (options: OptionValues, currentConfiguration: Config): Config => {
        const port = ArgsValidator.port(options.port as string);
        if (port !== null) {
            return {
                ...currentConfiguration,
                port
            } satisfies Config;
        }
        return currentConfiguration;
    },

    /**
     * Validate 'url' configuration field
     *
     * @param options Command line arguments options
     * @param currentConfiguration Default configuration to use if no field is provided
     * @returns Configuration object
     * @throws {InvalidCommandLineArguments}
     */
    url: (options: OptionValues, currentConfiguration: Config): Config => {
        const url = ArgsValidator.url(options.url as string);
        if (url !== null) {
            return {
                ...currentConfiguration,
                url
            } satisfies Config;
        }
        return currentConfiguration;
    },

    /**
     * Validate 'accounts' configuration field
     *
     * @param options Command line arguments options
     * @param currentConfiguration Default configuration to use if no field is provided
     * @returns Configuration object
     * @throws {InvalidCommandLineArguments}
     */
    accounts: (options: OptionValues, currentConfiguration: Config): Config => {
        const accounts = ArgsValidator.accounts(options.accounts as string);
        if (accounts !== null) {
            return {
                ...currentConfiguration,
                accounts
            } satisfies Config;
        }
        return currentConfiguration;
    }

    /**
     * ********* START: TEMPORARY COMMENT *********
     * This method will be implemented in the future.
     * ********* END: TEMPORARY COMMENT ********
     *
     * Validate 'mnemonic' configuration field
     *
     * @param options Command line arguments options
     * @param currentConfiguration Default configuration to use if no field is provided
     * @returns Configuration object
     * @throws {InvalidCommandLineArguments}
     */
    // mnemonic: (options: OptionValues, currentConfiguration: Config): Config => {
    //     const mnemonicToUse = ArgsValidator.mnemonic(
    //         options.mnemonic as string
    //     );
    //
    //     // Mnemonic count must be provided if mnemonic is provided
    //     if (
    //         mnemonicToUse !== null &&
    //         (options.mnemonicCount === undefined ||
    //             options.mnemonicCount === null)
    //     ) {
    //         throw new InvalidCommandLineArguments(
    //             'ArgsValidatorAndGetter.mnemonic()',
    //             'No mnemonic count provided. A mnemonic count must be provided',
    //             {
    //                 flag: '-mc , --mnemonicCount',
    //                 value: 'not provided'
    //             }
    //         );
    //     }
    //
    //     // Mnemonic initial index must be provided if mnemonic is provided
    //     if (
    //         mnemonicToUse !== null &&
    //         (options.mnemonicInitialIndex === undefined ||
    //             options.mnemonicInitialIndex === null)
    //     ) {
    //         throw new InvalidCommandLineArguments(
    //             'ArgsValidatorAndGetter.mnemonic()',
    //             'No mnemonic initial index provided. A mnemonic initial index must be provided',
    //             {
    //                 flag: '-mi , --mnemonicInitialIndex',
    //                 value: 'not provided'
    //             }
    //         );
    //     }
    //
    //     // @note: This field must be provided otherwise previous validation fails!
    //     if (
    //         options.mnemonicCount !== undefined &&
    //         options.mnemonicCount !== null &&
    //         options.mnemonicInitialIndex !== undefined &&
    //         options.mnemonicInitialIndex !== null
    //     ) {
    //         const field2 = ArgsValidator.mnemonicCount(
    //             options.mnemonicCount as string
    //         );
    //
    //         // @note: This field must be provided otherwise previous validation fails!
    //         const field3 = ArgsValidator.mnemonicInitialIndex(
    //             options.mnemonicInitialIndex as string
    //         );
    //
    //         if (mnemonicToUse !== null) {
    //             return {
    //                 ...currentConfiguration,
    //                 accounts: {
    //                     mnemonic: mnemonicToUse,
    //                     count: field2,
    //                     initialIndex: field3
    //                 }
    //             } satisfies Config;
    //         }
    //     }
    //     return currentConfiguration;
    // }

    /**
     * ********* START: TEMPORARY COMMENT *********
     * This method will be implemented in the future.
     * ********* END: TEMPORARY COMMENT ********
     *
     * Validate 'delegation' configuration fields
     *
     * @param options Command line arguments options
     * @param currentConfiguration Default configuration to use if no field is provided
     * @returns Configuration object
     * @throws {InvalidCommandLineArguments}
     */
    // delegation: (
    //     options: OptionValues,
    //     currentConfiguration: Config
    // ): Config => {
    //     // Both delegation fields are provided - throw an error
    //     if (
    //         options.delegatorPrivateKey !== undefined &&
    //         options.delegatorUrl !== undefined &&
    //         options.delegatorPrivateKey !== null &&
    //         options.delegatorUrl !== null
    //     ) {
    //         throw new InvalidCommandLineArguments(
    //             'ArgsValidatorAndGetter.delegation()',
    //             'Both delegator private key and delegator URL are provided. Only one can be provided',
    //             {
    //                 flag: '{-dp , --delegatorPrivateKey}, {-du , --delegatorUrl}',
    //                 value: `{value not provided for security reason} , {${options.delegatorUrl as string}}`
    //             }
    //         );
    //     }
    //
    //     // Delegation is made with a private key
    //     if (
    //         options.delegatePrivateKey !== undefined &&
    //         options.delegatePrivateKey !== null
    //     ) {
    //     }
    //
    //     // Delegation is made with a delegator URL
    //     if (
    //         options.delegatorUrl !== undefined &&
    //         options.delegatorUrl !== null
    //     ) {
    //     }
    //
    //     return currentConfiguration;
    // }
};

export { ArgsValidatorAndGetter };
