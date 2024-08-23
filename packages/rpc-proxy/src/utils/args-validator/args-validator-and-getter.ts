import { type Config } from '../../types';
import { type OptionValues } from 'commander';
import { getConfigObjectFromFile } from '../configuration-file';
import { ArgsValidator } from './args-validator';
import { InvalidCommandLineArguments } from '@vechain/sdk-errors';

/**
 * Main args validator AND getter object.
 *
 * It validates the command line arguments.
 * AND then it gets a fresh configuration with the validated arguments.
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
        const field = ArgsValidator.configurationFile(
            options.configurationFile as string
        );
        if (field !== null) {
            return getConfigObjectFromFile(field);
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
        const field = ArgsValidator.port(options.port as string);
        if (field !== null) {
            return {
                ...currentConfiguration,
                port: field
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
        const field = ArgsValidator.url(options.url as string);
        if (field !== null) {
            return {
                ...currentConfiguration,
                url: field
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
        const field = ArgsValidator.accounts(options.accounts as string);
        if (field !== null) {
            return {
                ...currentConfiguration,
                accounts: field
            } satisfies Config;
        }
        return currentConfiguration;
    },

    /**
     * Validate 'mnemonic' configuration field
     *
     * @param options Command line arguments options
     * @param currentConfiguration Default configuration to use if no field is provided
     * @returns Configuration object
     * @throws {InvalidCommandLineArguments}
     */
    mnemonic: (options: OptionValues, currentConfiguration: Config): Config => {
        const field = ArgsValidator.mnemonic(options.mnemonic as string);

        // Mnemonic count must be provided if mnemonic is provided
        if (
            (field !== null && options.mnemonicCount === undefined) ||
            options.mnemonicCount === null
        ) {
            throw new InvalidCommandLineArguments(
                'ArgsValidatorAndGetter.mnemonic()',
                'No mnemonic count provided. A mnemonic count must be provided',
                {
                    flag: '-mc , --mnemonicCount',
                    value: 'not provided'
                }
            );
        }

        // Mnemonic initial index must be provided if mnemonic is provided
        if (
            (field !== null && options.mnemonicInitialIndex === undefined) ||
            options.mnemonicInitialIndex === null
        ) {
            throw new InvalidCommandLineArguments(
                'ArgsValidatorAndGetter.mnemonic()',
                'No mnemonic initial index provided. A mnemonic initial index must be provided',
                {
                    flag: '-mi , --mnemonicInitialIndex',
                    value: 'not provided'
                }
            );
        }

        // @note: This field must be provided otherwise previous validation fails!
        const field2 = ArgsValidator.mnemonicCount(
            options.mnemonicCount as string
        );

        // @note: This field must be provided otherwise previous validation fails!
        const field3 = ArgsValidator.mnemonicInitialIndex(
            options.mnemonicInitialIndex as string
        );

        if (field !== null) {
            return {
                ...currentConfiguration,
                accounts: {
                    mnemonic: field,
                    count: field2,
                    initialIndex: field3
                }
            } satisfies Config;
        }
        return currentConfiguration;
    }
};

export { ArgsValidatorAndGetter };
