import { type Config } from '../../types';
import { type OptionValues } from 'commander';
import {
    checkValidConfigurationFile,
    getConfigObjectFromFile
} from '../config-validator';
import { ArgsValidator } from './args-validator';
import { InvalidCommandLineArguments } from '@vechain/sdk-errors';

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
        const port = ArgsValidator.port(
            options.port as string | null | undefined
        );
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
        const url = ArgsValidator.url(options.url as string | null | undefined);
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
        const accounts = ArgsValidator.accounts(
            options.accounts as string | null | undefined
        );
        if (accounts !== null) {
            return {
                ...currentConfiguration,
                accounts
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
    mnemonicFields: (
        options: OptionValues,
        currentConfiguration: Config
    ): Config => {
        const accounts = ArgsValidator.mnemonicFields(
            options.mnemonic as string | null | undefined,
            options.mnemonicCount as string | null | undefined,
            options.mnemonicInitialIndex as string | null | undefined
        );

        if (accounts !== null) {
            return {
                ...currentConfiguration,
                accounts
            } satisfies Config;
        }

        return currentConfiguration;
    },

    /**
     * Validate 'delegation' configuration fields
     *
     * @param options Command line arguments options
     * @param currentConfiguration Default configuration to use if no field is provided
     * @returns Configuration object
     * @throws {InvalidCommandLineArguments}
     */
    delegation: (
        options: OptionValues,
        currentConfiguration: Config
    ): Config => {
        // Both delegation fields are provided - throw an error
        if (
            options.gasPayerPrivateKey !== undefined &&
            options.gasPayerServiceUrl !== undefined &&
            options.gasPayerPrivateKey !== null &&
            options.gasPayerServiceUrl !== null
        ) {
            throw new InvalidCommandLineArguments(
                'ArgsValidatorAndGetter.delegation()',
                'Both gasPayer private key and gasPayer service URL are provided. Only one can be provided',
                {
                    flag: '{--gasPayerPrivateKey}, {-d , --gasPayerServiceUrl}',
                    value: `{value not provided for security reason} , {${options.gasPayerServiceUrl as string}}`
                }
            );
        }

        // Delegation is made with a private key
        if (
            options.gasPayerPrivateKey !== undefined &&
            options.gasPayerPrivateKey !== null
        ) {
            return {
                ...currentConfiguration,
                gasPayer: {
                    gasPayerPrivateKey: ArgsValidator.gasPayerPrivateKey(
                        options.gasPayerPrivateKey as string
                    )
                }
            };
        }

        // Delegation is made with a gasPayer URL
        if (
            options.gasPayerServiceUrl !== undefined &&
            options.gasPayerServiceUrl !== null
        ) {
            return {
                ...currentConfiguration,
                gasPayer: {
                    gasPayerServiceUrl: ArgsValidator.gasPayerServiceUrl(
                        options.gasPayerServiceUrl as string
                    )
                }
            };
        }

        return currentConfiguration;
    }
};

export { ArgsValidatorAndGetter };
