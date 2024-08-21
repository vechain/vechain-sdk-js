import { checkValidConfigurationFile } from '../configuration-file';
import { InvalidCommandLineArguments } from '@vechain/sdk-errors';
import { Hex, secp256k1 } from '@vechain/sdk-core';

/**
 * Check if the url is valid function
 * @param url - URL to check
 * @returns True if the url is valid, false otherwise
 */
const isValidUrl = (url: string): boolean => {
    try {
        // eslint-disable-next-line no-new
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

/**
 * Main args validator.
 *
 * It validates the command line arguments.
 */
const ArgsValidator = {
    /**
     * Validate configuration fields and get the configuration.
     * If a configuration file is provided, validate it and get the configuration.
     *
     * @param configurationFilePath The path to the configuration file.
     * @returns Configuration file path if provided AND valid, null otherwise
     * @throws {InvalidConfigurationFilePath, InvalidConfigurationFile}
     */
    configurationFile: (
        configurationFilePath?: string | null
    ): string | null => {
        if (
            configurationFilePath !== undefined &&
            configurationFilePath !== null
        ) {
            // Check if the configuration file exists AND is a valid JSON
            checkValidConfigurationFile(configurationFilePath);

            console.log(
                `[rpc-proxy]: Configuration file provided ${configurationFilePath}`
            );

            return configurationFilePath;
        } else {
            console.log(
                '[rpc-proxy]: No configuration file. Default configuration will be used with command line args overrides.'
            );
        }
        return null;
    },

    /**
     * Validate 'port' configuration field
     *
     * @param port Port to validate
     * @returns Port if provided AND valid, null otherwise
     * @throws {InvalidCommandLineArguments}
     */
    port: (port?: string | null): number | null => {
        if (port !== undefined && port !== null) {
            const portAsNumber = Number(port.toString());

            if (isNaN(portAsNumber) || !Number.isInteger(portAsNumber)) {
                throw new InvalidCommandLineArguments(
                    'validatePortFieldAndGetConfig()',
                    'Invalid port provided. A port must be an integer',
                    {
                        flag: '-p , --port',
                        value: port
                    }
                );
            }
            console.log(
                `[rpc-proxy]: Port provided with command line options: ${port}`
            );

            return portAsNumber;
        } else {
            console.log(
                '[rpc-proxy]: No port provided with command line arguments. Default port will be used.'
            );
        }
        return null;
    },

    /**
     * Validate 'url' configuration field
     *
     * @param url URL to validate
     * @returns URL if provided AND valid, null otherwise
     * @throws {InvalidCommandLineArguments}
     */
    url: (url?: string | null): string | null => {
        if (url !== undefined && url !== null) {
            if (!isValidUrl(url)) {
                throw new InvalidCommandLineArguments(
                    'validateUrlFieldAndGetConfig()',
                    'Invalid url provided. The parameter must be a valid url',
                    {
                        flag: '-u , --url',
                        value: url
                    }
                );
            }
            console.log(
                `[rpc-proxy]: Url provided with command line options: ${url}`
            );

            return url;
        } else {
            console.log(
                '[rpc-proxy]: No url provided with command line arguments. Default port will be used.'
            );
        }
        return null;
    },

    /**
     * Validate 'accounts' configuration field
     *
     * @param accounts Accounts to validate
     * @returns Accounts as a list of private keys, if provided AND valid, null otherwise
     * @throws {InvalidCommandLineArguments}
     */
    accounts: (accounts?: string | null): string[] | null => {
        if (accounts !== undefined && accounts !== null) {
            const accountsList: string[] = accounts.split(' ');

            accountsList
                .map(
                    (accountPrivateKeyAsString) =>
                        Hex.of(accountPrivateKeyAsString).bytes
                )
                .forEach((privateKey: Uint8Array) => {
                    if (
                        !secp256k1.isValidPrivateKey(Hex.of(privateKey).bytes)
                    ) {
                        throw new InvalidCommandLineArguments(
                            '_parseConfiguration()',
                            'An invalid account private key is present in the configuration file',
                            {
                                flag: '-a , --accounts',
                                value: 'Value will not be shown for security reasons'
                            }
                        );
                    }
                });

            return accountsList;
        } else {
            console.log(
                '[rpc-proxy]: No accounts provided with command line arguments. Default port will be used.'
            );
        }
        return null;
    }
};

export { ArgsValidator };
