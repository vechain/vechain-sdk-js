import { type Config } from '../../types';
import { type OptionValues } from 'commander';
import { getConfigObjectFromFile } from '../configuration-file';
import { ArgsValidator } from './args-validator';

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
            };
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
            };
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
            };
        }
        return currentConfiguration;
    }
};

export { ArgsValidatorAndGetter };
