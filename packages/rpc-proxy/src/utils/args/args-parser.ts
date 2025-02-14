import { type OptionValues } from 'commander';
import { type Config } from '../../types';
import { ArgsValidatorAndGetter } from '../args-validator';
import { InvalidCommandLineArguments } from '@vechain/sdk-errors';

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

        // B.5 - Get and validate accounts field
        configuration = ArgsValidatorAndGetter.accounts(options, configuration);

        // B.6 - Get and validate mnemonic field
        configuration = ArgsValidatorAndGetter.mnemonicFields(
            options,
            configuration
        );

        // B.7 - Enable delegation
        if (options.enableDelegation !== undefined) {
            configuration.enableDelegation =
                options.enableDelegation as boolean;
        }

        // B.8 - Get and validate gasPayer private key field
        configuration = ArgsValidatorAndGetter.delegation(
            options,
            configuration
        );

        // C - Evaluate the semantic of the arguments.
        // NOTE: Here we know all the fields are valid. So we can check the semantics of the fields.

        // Delegation cannot be enabled without a gasPayer
        if (
            (configuration.enableDelegation as boolean) &&
            configuration.gasPayer === undefined
        ) {
            throw new InvalidCommandLineArguments(
                '_checkIfConfigurationFileHasCorrectStructure()',
                `Invalid configuration: Delegation cannot be enabled without a gasPayer`,
                {
                    flag: '--enableDelegation , --gasPayerPrivateKey, --gasPayerServiceUrl',
                    value: `${options.enableDelegation}, Not provided, Not provided`
                }
            );
        }
    }

    // Return the configuration
    return configuration;
}

export { parseAndGetFinalConfig };
