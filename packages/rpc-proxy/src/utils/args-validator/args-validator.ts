import { InvalidCommandLineArguments } from '@vechain/sdk-errors';
import { checkValidConfigurationFile } from '../config-validator';
import {
    isValidAccountsAsListOfPrivateKeys,
    isValidCount,
    isValidDelegatorPrivateKey,
    isValidDelegatorUrl,
    isValidMnemonic,
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
                '[rpc-proxy]: No url provided with command line arguments. Default url will be used.'
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
                '[rpc-proxy]: No accounts provided with command line arguments. Default accounts will be used.'
            );
        }
        return null;
    },

    /*
     * Validate mnemonic configuration fields
     *
     * @param mnemonic The mnemonic to validate
     * @param mnemonicCount Mnemonic count to validate
     * @param mnemonicIndex Mnemonic index to validate
     * @returns Mnemonic, mnemonic count, and mnemonic index if provided AND valid, null otherwise
     * @throws {InvalidCommandLineArguments}
     */
    mnemonicFields: (
        mnemonic?: string | null,
        mnemonicCount?: string | null,
        mnemonicInitialIndex?: string | null
    ): {
        mnemonic: string;
        count: number;
        initialIndex: number;
    } | null => {
        // Check the fields (valid or not)
        const isMnemonicValid =
            mnemonic !== undefined && mnemonic !== null
                ? isValidMnemonic(mnemonic)
                : false;

        const isMnemonicCountValid =
            mnemonicCount !== undefined && mnemonicCount !== null
                ? isValidCount(Number(mnemonicCount)) && mnemonicCount !== ''
                : false;

        const isMnemonicInitialIndexValid =
            mnemonicInitialIndex !== undefined && mnemonicInitialIndex !== null
                ? isValidCount(Number(mnemonicInitialIndex)) &&
                  mnemonicInitialIndex !== ''
                : false;

        // Check if at least one field is valid
        const isAtLeastOneFieldValid =
            isMnemonicCountValid ||
            isMnemonicInitialIndexValid ||
            isMnemonicValid;

        // Check if all fields are valid
        const areAllFieldsValid =
            isMnemonicValid &&
            isMnemonicCountValid &&
            isMnemonicInitialIndexValid;

        // If there is at least one field valid, ALL fields must be valid
        if (isAtLeastOneFieldValid) {
            // All fields are valid, we can return the configuration
            if (areAllFieldsValid) {
                return {
                    mnemonic: mnemonic as string,
                    count: Number(mnemonicCount),
                    initialIndex: Number(mnemonicInitialIndex)
                };
            }

            // Some field is missing/invalid. Check which one is invalid and throw an error
            if (!isMnemonicValid) {
                throw new InvalidCommandLineArguments(
                    'ArgsValidator.mnemonicFields()',
                    'Invalid mnemonic provided. The parameter must be a valid mnemonic',
                    {
                        flag: '-m , --mnemonic',
                        value: 'Value will not be shown for security reasons'
                    }
                );
            }
            if (!isMnemonicCountValid) {
                throw new InvalidCommandLineArguments(
                    'ArgsValidator.mnemonicFields()',
                    'Invalid count provided. The parameter must be an integer',
                    {
                        flag: '--mnemonicCount',
                        value: String(mnemonicCount)
                    }
                );
            }
            if (!isMnemonicInitialIndexValid) {
                throw new InvalidCommandLineArguments(
                    'ArgsValidator.mnemonicFields()',
                    'Invalid initial index provided. The parameter must be an integer',
                    {
                        flag: '--mnemonicInitialIndex',
                        value: String(mnemonicInitialIndex)
                    }
                );
            }
        } else {
            console.log(
                '[rpc-proxy]: No mnemonic provided with command line arguments. Default mnemonic will be used.'
            );
        }

        return null;
    },

    /**
     * Delegate configuration
     * Validate 'delegatorPrivateKey' configuration field.
     *
     * @param delegatorPrivateKey Delegator private key to validate
     * @returns Delegator private key if provided AND valid, null otherwise
     */
    delegatorPrivateKey: (delegatorPrivateKey: string): string => {
        if (
            !isValidDelegatorPrivateKey(delegatorPrivateKey) ||
            delegatorPrivateKey === ''
        ) {
            throw new InvalidCommandLineArguments(
                'ArgsValidator.delegatorPrivateKey()',
                'An invalid gasPayer private key provided.',
                {
                    flag: '--delegatorPrivateKey',
                    value: 'Value will not be shown for security reasons'
                }
            );
        }
        console.log(
            `[rpc-proxy]: Delegator private key provided with command line options`
        );

        return delegatorPrivateKey;
    },

    /*
     * Validate 'delgatorUrl' configuration field
     *
     * @param delegatorUrl Delegator URL to validate
     * @returns Delegator URL if provided AND valid, null otherwise
     */
    delegatorUrl: (delegatorUrl: string): string => {
        if (!isValidDelegatorUrl(delegatorUrl) || delegatorUrl === '') {
            throw new InvalidCommandLineArguments(
                'ArgsValidator.delegatorUrl()',
                'Invalid gasPayer url provided. The parameter must be a valid url',
                {
                    flag: '-d , --delegatorUrl',
                    value: delegatorUrl
                }
            );
        }
        console.log(
            `[rpc-proxy]: Delegator url provided with command line options: ${delegatorUrl}`
        );

        return delegatorUrl;
    }
};

export { ArgsValidator };
