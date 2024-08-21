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
        if (
            ArgsValidator.configurationFile(
                options.configurationFile as string
            ) !== null
        ) {
            return getConfigObjectFromFile(options.configurationFile as string);
        }
        return defaultConfiguration;
    },

    /**
     * Validate 'port' configuration field
     *
     * @param options Command line arguments options
     * @param currentConfiguration Default configuration to use if no field is provided
     * @throws {InvalidCommandLineArguments}
     */
    port: (options: OptionValues, currentConfiguration: Config): Config => {
        if (ArgsValidator.port(options.port as string) !== null) {
            return {
                ...currentConfiguration,
                port: Number(options.port as string)
            };
        }
        return currentConfiguration;
    },

    /**
     * Validate 'url' configuration field
     *
     * @param options Command line arguments options
     * @param currentConfiguration Default configuration to use if no field is provided
     * @throws {InvalidCommandLineArguments}
     */
    url: (options: OptionValues, currentConfiguration: Config): Config => {
        if (ArgsValidator.url(options.url as string) !== null) {
            return {
                ...currentConfiguration,
                url: options.url as string
            };
        }
        return currentConfiguration;
    }
};

export { ArgsValidatorAndGetter };
