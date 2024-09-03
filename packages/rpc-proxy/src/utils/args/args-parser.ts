import { type OptionValues } from 'commander';
import { type Config } from '../../types';
import { ArgsValidatorAndGetter } from '../args-validator';

/**
 * Parse the semantic of the arguments.
 * This function is related to rules of the arguments.
 *
 * -e.g.- if we use accounts:,
 * * we need to use mnemonic, mnemonicCount and mnemonicInitialIndex
 * OR
 * * accounts as a list of private keys
 *
 * -e.g.- We need to check if the port is a number
 *
 * -e.g.- We need to check if the configuration file is valid
 *
 * ...
 *
 * @param options Arguments options to parse
 * @param defaultConfiguration Default configuration to use if no configuration file or arguments are provided
 * @throws {InvalidCommandLineArguments, InvalidConfigurationFilePath, InvalidConfigurationFile}
 */
function parseAndGetFinalConfig(
    options: OptionValues,
    defaultConfiguration: Config
): Config {
    // Initialize the configuration
    let configuration: Config = defaultConfiguration;

    // A - No configuration OR arguments provided
    if (Object.keys(options).length === 0) {
        console.log(
            '[rpc-proxy]: No configuration file or command line args provided. Default configuration will be used.'
        );
    }

    // B - Configuration OR arguments provided
    else {
        // B.1 - Get and validate configuration file
        configuration = ArgsValidatorAndGetter.configurationFile(
            options,
            defaultConfiguration
        );

        // B.2 - Get and validate port field
        configuration = ArgsValidatorAndGetter.port(options, configuration);

        // B.3 - Get and validate url field
        configuration = ArgsValidatorAndGetter.url(options, configuration);

        // B.4 - Verbosity
        if (options.verbose !== undefined) {
            configuration.verbose = options.verbose as boolean;
        }

        // // B.4 - Get and validate accounts field
        configuration = ArgsValidatorAndGetter.accounts(options, configuration);

        // // B.5 - Get and validate mnemonic field
        // configuration = ArgsValidatorAndGetter.mnemonic(options, configuration);
    }

    // Return the configuration
    return configuration;
}

export { parseAndGetFinalConfig };
