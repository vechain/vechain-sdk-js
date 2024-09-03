import { InvalidCommandLineArguments } from '@vechain/sdk-errors';
import { checkValidConfigurationFile } from '../config-validator';
import {
    isValidAccountsAsListOfPrivateKeys,
    isValidPort,
    isValidUrl
} from '../validators';

/**
 * Main args validator.
 *
 * It validates the command line arguments.
 *
 * ArgsValidator is used to validate every single field of the configuration.
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
            if (configurationFilePath === '')
                // Check if the configuration file is valid: It exists and is a valid JSON
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

            if (!isValidPort(portAsNumber) || port === '') {
                throw new InvalidCommandLineArguments(
                    'ArgsValidator.port()',
                    'Invalid port provided. The parameter must be an integer',
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
            if (!isValidUrl(url) || url === '') {
                throw new InvalidCommandLineArguments(
                    'ArgsValidator.url()',
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

            if (Array.isArray(accountsList)) {
                if (
                    !isValidAccountsAsListOfPrivateKeys(accountsList) ||
                    accounts === ''
                ) {
                    throw new InvalidCommandLineArguments(
                        'ArgsValidator.accounts()',
                        'Invalid accounts provided. The parameter must be an array of valid private keys',
                        {
                            flag: '-a , --accounts',
                            value: 'Value will not be shown for security reasons (check your command line arguments)'
                        }
                    );
                }

                return accountsList;
            }
        } else {
            console.log(
                '[rpc-proxy]: No accounts provided with command line arguments. Default port will be used.'
            );
        }
        return null;
    }

    /*
     * ********* START: TEMPORARY COMMENT *********
     * This method will be implemented in the future.
     * ********* END: TEMPORARY COMMENT ********
     *
     * Validate 'mnemonic' configuration field
     *
     * @param mnemonic Mnemonic to validate
     * @returns Mnemonic if provided AND valid, null otherwise
     * @throws {InvalidCommandLineArguments}
     */
    // mnemonic: (mnemonic?: string | null): string | null => {
    //     if (mnemonic !== undefined && mnemonic !== null) {
    //         try {
    //             HDNode.fromMnemonic(mnemonic.split(' '));
    //         } catch (e) {
    //             throw new InvalidCommandLineArguments(
    //                 'ArgsValidator.mnemonic()',
    //                 'An invalid account mnemonic is present in the configuration file',
    //                 {
    //                     flag: '-m , --mnemonic',
    //                     value: 'Value will not be shown for security reasons'
    //                 }
    //             );
    //         }
    //         return mnemonic;
    //     } else {
    //         console.log(
    //             '[rpc-proxy]: No mnemonic provided with command line arguments. Default port will be used.'
    //         );
    //     }
    //
    //     return null;
    // }

    /**
     * ********* START: TEMPORARY COMMENT *********
     * This method will be implemented in the future.
     * ********* END: TEMPORARY COMMENT ********
     *
     * Validate 'mnemonicCount' configuration field
     *
     * @param mnemonicCount Mnemonic count to validate
     * @returns Mnemonic count if provided AND valid, null otherwise
     * @throws {InvalidCommandLineArguments}
     */
    // mnemonicCount: (mnemonicCount: string): number => {
    //     const mnemonicCountAsNumber = Number(mnemonicCount.toString());
    //
    //     if (
    //         isNaN(mnemonicCountAsNumber) ||
    //         !Number.isInteger(mnemonicCountAsNumber) ||
    //         mnemonicCountAsNumber < 0
    //     ) {
    //         throw new InvalidCommandLineArguments(
    //             'ArgsValidator.mnemonicCount()',
    //             'Invalid mnemonicCount provided. A port must be an integer',
    //             {
    //                 flag: '-mc , --mnemonicCount',
    //                 value: mnemonicCount
    //             }
    //         );
    //     }
    //
    //     return mnemonicCountAsNumber;
    // }

    /**
     * ********* START: TEMPORARY COMMENT *********
     * This method will be implemented in the future.
     * ********* END: TEMPORARY COMMENT ********
     *
     * Validate 'mnemonicInitialIndex' configuration field
     *
     * @param mnemonicInitialIndex Mnemonic initial index to validate
     * @returns Mnemonic initial index if provided AND valid, null otherwise
     * @throws {InvalidCommandLineArguments}
     */
    // mnemonicInitialIndex: (mnemonicInitialIndex: string): number => {
    //     const mnemonicInitialIndexAsNumber = Number(
    //         mnemonicInitialIndex.toString()
    //     );
    //
    //     if (
    //         isNaN(mnemonicInitialIndexAsNumber) ||
    //         !Number.isInteger(mnemonicInitialIndexAsNumber) ||
    //         mnemonicInitialIndexAsNumber < 0
    //     ) {
    //         throw new InvalidCommandLineArguments(
    //             'ArgsValidator.mnemonicInitialIndex()',
    //             'Invalid mnemonicInitialIndex provided. A port must be an integer',
    //             {
    //                 flag: '-mi , --mnemonicInitialIndex',
    //                 value: mnemonicInitialIndex
    //             }
    //         );
    //     }
    //
    //     return mnemonicInitialIndexAsNumber;
    // }

    /**
     * ********* START: TEMPORARY COMMENT *********
     * This method will be implemented in the future.
     * ********* END: TEMPORARY COMMENT ********
     *
     * Delegate configuration
     * Validate 'delegatorPrivateKey' configuration field.
     *
     * @param delegatorPrivateKey Delegator private key to validate
     * @returns Delegator private key if provided AND valid, null otherwise
     */
    // delegatorPrivateKey: (delegatorPrivateKey: string): string | null => {
    //     if (delegatorPrivateKey !== undefined && delegatorPrivateKey !== null) {
    //         if (
    //             !secp256k1.isValidPrivateKey(Hex.of(delegatorPrivateKey).bytes)
    //         ) {
    //             throw new InvalidCommandLineArguments(
    //                 'ArgsValidator.delegatorPrivateKey()',
    //                 'An invalid delegator private key provided.',
    //                 {
    //                     flag: '-dp , --delegatorPrivateKey',
    //                     value: 'Value will not be shown for security reasons'
    //                 }
    //             );
    //         }
    //         console.log(
    //             `[rpc-proxy]: Delegator private key provided with command line options`
    //         );
    //
    //         return delegatorPrivateKey;
    //     } else {
    //         console.log(
    //             '[rpc-proxy]: No url provided with command line arguments. Default port will be used.'
    //         );
    //     }
    //     return null;
    // }

    /*
     * ********* START: TEMPORARY COMMENT *********
     * This method will be implemented in the future.
     * ********* END: TEMPORARY COMMENT ********
     *
     * Validate 'delgatorUrl' configuration field
     *
     * @param delegatorUrl Delegator URL to validate
     * @returns Delegator URL if provided AND valid, null otherwise
     */
    // delegatorUrl: (delegatorUrl: string): string | null => {
    //     if (delegatorUrl !== undefined && delegatorUrl !== null) {
    //         if (!isValidUrl(delegatorUrl)) {
    //             throw new InvalidCommandLineArguments(
    //                 'ArgsValidator.delegatorUrl()',
    //                 'Invalid delegator url provided. The parameter must be a valid url',
    //                 {
    //                     flag: '-du , --delegatorUrl',
    //                     value: delegatorUrl
    //                 }
    //             );
    //         }
    //         console.log(
    //             `[rpc-proxy]: Delegator url provided with command line options: ${delegatorUrl}`
    //         );
    //
    //         return delegatorUrl;
    //     } else {
    //         console.log(
    //             '[rpc-proxy]: No delegator url provided with command line arguments. Default port will be used.'
    //         );
    //     }
    //     return null;
    // }
};

export { ArgsValidator };
