import { describe, test } from '@jest/globals';
import {
    getConfigObjectFromFile,
    getOptionsFromCommandLine,
    parseAndGetFinalConfig
} from '../../../src/utils';
import {
    InvalidCommandLineArguments,
    InvalidConfigurationFilePath
} from '@vechain/sdk-errors';
import { correctConfigurationFilePathFixture } from '../../fixture';

/**
 * Args options tests
 * @group unit/utils/args-parser
 */
describe('Args parser tests', () => {
    /**
     * Default configuration
     */
    const defaultConfiguration = getConfigObjectFromFile(
        correctConfigurationFilePathFixture[0]
    );

    /**
     * Parse command line arguments AND get the configuration - positive test cases
     */
    describe('Parse command line arguments AND get the configuration - positive cases', () => {
        /**
         * Should be able to parse empty command line arguments (default configuration) AND get the configuration
         */
        test('Should be able to parse empty command line arguments AND get the configuration', () => {
            const options = getOptionsFromCommandLine('1.0.0', [
                'path',
                'program'
            ]);

            const configuration = parseAndGetFinalConfig(
                options,
                defaultConfiguration
            );
            expect(configuration).toEqual(defaultConfiguration);
        });

        /**
         * Should be able to parse the port option from command line arguments AND get the configuration
         */
        test('Should be able to get the port from command lime arguments AND get the configuration', () => {
            [
                // Normal syntax
                ['path', 'program', '--port', '10'],
                // Short syntax
                ['path', 'program', '-p', '10']
            ].forEach((args) => {
                // Get options
                const options = getOptionsFromCommandLine('1.0.0', args);

                // Get the configuration
                const configuration = parseAndGetFinalConfig(
                    options,
                    defaultConfiguration
                );
                expect(configuration.port).toBe(10);
            });
        });

        /**
         * Should be able to parse the url option from command line arguments AND get the configuration
         */
        test('Should be able to get the url from command line arguments AND get the configuration', () => {
            [
                // Normal syntax
                ['path', 'program', '--url', 'http://localhost:8080'],
                // Short syntax
                ['path', 'program', '-u', 'http://localhost:8080']
            ].forEach((args) => {
                // Get options
                const options = getOptionsFromCommandLine('1.0.0', args);

                // Get the configuration
                const configuration = parseAndGetFinalConfig(
                    options,
                    defaultConfiguration
                );
                expect(configuration.url).toBe('http://localhost:8080');
            });
        });

        /**
         * Should be able to parse the verbose option from command line arguments AND get the configuration
         */
        test('Should be able to get the verbose option from command line arguments AND get the configuration', () => {
            [
                // Normal syntax
                ['path', 'program', '--verbose'],
                // Short syntax
                ['path', 'program', '-v']
            ].forEach((args) => {
                // Get options
                const options = getOptionsFromCommandLine('1.0.0', args);

                // Get the configuration
                const configuration = parseAndGetFinalConfig(
                    options,
                    defaultConfiguration
                );
                expect(configuration.verbose).toBe(true);
            });
        });

        /**
         * Should be able to parse the accounts (as a list of private keys) option from command line arguments AND get the configuration
         */
        test('Should be able to get the accounts from command line arguments AND get the configuration', () => {
            [
                // Normal syntax
                [
                    'path',
                    'program',
                    '--accounts',
                    '8f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158 7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158'
                ],
                // Short syntax
                [
                    'path',
                    'program',
                    '-a',
                    '8f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158 7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158'
                ]
            ].forEach((args) => {
                // Get options
                const options = getOptionsFromCommandLine('1.0.0', args);

                // // Get the configuration
                const configuration = parseAndGetFinalConfig(
                    options,
                    defaultConfiguration
                );

                expect(configuration.accounts).toEqual([
                    '8f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158',
                    '7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158'
                ]);
            });
        });

        /**
         * Should be able to parse the mnemonic field from command line arguments AND get the configuration
         */
        test('Should be able to get the mnemonic field from command line arguments AND get the configuration', () => {
            [
                // Normal syntax
                [
                    'path',
                    'program',
                    '--mnemonic',
                    'expire pair material agent north ostrich fortune level cousin snow mixture nurse',
                    '--mnemonicInitialIndex',
                    '1',
                    '--mnemonicCount',
                    '2'
                ],
                // Short syntax
                [
                    'path',
                    'program',
                    '-m',
                    'expire pair material agent north ostrich fortune level cousin snow mixture nurse',
                    '-mi',
                    '1',
                    '-mc',
                    '2'
                ]
            ].forEach((args) => {
                // Get options
                const options = getOptionsFromCommandLine('1.0.0', args);

                // Get the configuration
                const configuration = parseAndGetFinalConfig(
                    options,
                    defaultConfiguration
                );

                console.log(configuration);
            });
        });

        /**
         * Should be able to parse the enableDelegation option from command line arguments AND get the configuration
         */
        test('Should be able to get the enableDelegation option from command line arguments AND get the configuration', () => {
            [
                // Normal syntax
                [
                    'path',
                    'program',
                    '--enableDelegation',
                    '--gasPayerPrivateKey',
                    '8f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158'
                ],
                // Short syntax
                [
                    'path',
                    'program',
                    '-e',
                    '--gasPayerPrivateKey',
                    '8f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158'
                ]
            ].forEach((args) => {
                // Get options
                const options = getOptionsFromCommandLine('1.0.0', args);

                // Get the configuration
                const configuration = parseAndGetFinalConfig(
                    options,
                    defaultConfiguration
                );
                expect(configuration.enableDelegation).toBe(true);
            });
        });

        /**
         * Should be able to delegation options from command line arguments (gasPayerPrivateKey and gasPayerServiceUrl fields) AND get the configuration
         */
        test('Should be able to get the delegation options from command line arguments AND get the configuration', () => {
            [
                // The gasPayer private key

                // Normal syntax
                [
                    'path',
                    'program',
                    '--gasPayerPrivateKey',
                    '8f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158'
                ],

                // The gasPayer service URL

                // Normal syntax
                [
                    'path',
                    'program',
                    '--gasPayerServiceUrl',
                    'http://localhost:8080'
                ],
                // Short syntax
                ['path', 'program', '-s', 'http://localhost:8080']
            ].forEach((args) => {
                // Get options
                const options = getOptionsFromCommandLine('1.0.0', args);

                // Get the configuration
                const configuration = parseAndGetFinalConfig(
                    options,
                    defaultConfiguration
                );
                expect(configuration).toBeDefined();
            });
        });

        /**
         * Should be able to parse the configuration file option from command line arguments AND get the configuration
         */
        test('Should be able to get the configuration file from command line arguments AND get the configuration', () => {
            [
                // Normal syntax
                [
                    'path',
                    'program',
                    '--configurationFile',
                    `${correctConfigurationFilePathFixture[0]}`
                ],
                // Short syntax
                [
                    'path',
                    'program',
                    '-c',
                    `${correctConfigurationFilePathFixture[0]}`
                ]
            ].forEach((args) => {
                // Get options
                const options = getOptionsFromCommandLine('1.0.0', args);

                // // Get the configuration
                const configuration = parseAndGetFinalConfig(
                    options,
                    defaultConfiguration
                );
                expect(configuration).toEqual(
                    getConfigObjectFromFile(
                        correctConfigurationFilePathFixture[0]
                    )
                );
            });
        });
    });

    /**
     * Parse command line arguments AND get the configuration - negative test cases
     */
    describe('Parse command line arguments AND get the configuration - negative cases', () => {
        /**
         * Should NOT be able to parse an invalid port option from command line arguments AND get the configuration
         */
        test('Should NOT be able to parse an invalid port option from command line arguments AND get the configuration', () => {
            [
                // Normal syntax
                ['path', 'program', '--port', '-1'],
                // Short syntax
                ['path', 'program', '-p', '-1'],
                // Normal syntax
                ['path', 'program', '--port', 'INVALID'],
                // Short syntax
                ['path', 'program', '-p', 'INVALID'],
                // Normal syntax
                ['path', 'program', '--port', ''],
                // Short syntax
                ['path', 'program', '-p', '']
            ].forEach((args) => {
                // Get options
                const options = getOptionsFromCommandLine('1.0.0', args);

                // Throw the error
                expect(() =>
                    parseAndGetFinalConfig(options, defaultConfiguration)
                ).toThrow(InvalidCommandLineArguments);
            });
        });

        /**
         * Should NOT be able to parse the url option from command line arguments AND get the configuration
         */
        test('Should be NOT able to parse an invalid url from command line arguments AND get the configuration', () => {
            [
                // Normal syntax
                ['path', 'program', '--url', 'INVALID'],
                // Short syntax
                ['path', 'program', '-u', 'INVALID'],
                // Normal syntax
                ['path', 'program', '--url', ''],
                // Short syntax
                ['path', 'program', '-u', '']
            ].forEach((args) => {
                // Get options
                const options = getOptionsFromCommandLine('1.0.0', args);

                // Throw the error
                expect(() =>
                    parseAndGetFinalConfig(options, defaultConfiguration)
                ).toThrow(InvalidCommandLineArguments);
            });
        });

        /**
         * Should NOT be able to parse the accounts (as a list of private keys) option from command line arguments AND get the configuration
         */
        test('Should be NOT able to parse an invalid accounts from command line arguments AND get the configuration', () => {
            [
                // Normal syntax
                ['path', 'program', '--accounts', `INVALID`],
                // Short syntax
                ['path', 'program', '-a', `INVALID`],
                // Normal syntax
                [
                    'path',
                    'program',
                    '--accounts',
                    `8f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158 INVALID`
                ],
                // Short syntax
                [
                    'path',
                    'program',
                    '-a',
                    `8f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158 INVALID`
                ],
                // Normal syntax
                ['path', 'program', '--accounts', ''],
                // Short syntax
                ['path', 'program', '-a', '']
            ].forEach((args) => {
                // Get options
                const options = getOptionsFromCommandLine('1.0.0', args);

                // Throw the error
                expect(() =>
                    parseAndGetFinalConfig(options, defaultConfiguration)
                ).toThrow(InvalidCommandLineArguments);
            });
        });

        /**
         * Should NOT be able to parse mnemonic fields from command line arguments AND get the configuration
         * All edge cases (invalid mnemonic, invalid initial index, invalid count OR missing mnemonic, missing initial index, missing count)
         */
        test('Should be NOT able to parse invalid mnemonic fields from command line arguments AND get the configuration', () => {
            [
                // Missing fields

                // Normal syntax
                [
                    'path',
                    'program',
                    '--mnemonic',
                    'expire pair material agent north ostrich fortune level cousin snow mixture nurse',
                    '--mnemonicInitialIndex',
                    '1'
                ],
                // Short syntax
                [
                    'path',
                    'program',
                    '-m',
                    'expire pair material agent north ostrich fortune level cousin snow mixture nurse',
                    '-mi',
                    '1'
                ],

                // Normal syntax
                [
                    'path',
                    'program',
                    '--mnemonic',
                    'expire pair material agent north ostrich fortune level cousin snow mixture nurse',
                    '--mnemonicInitialIndex',
                    '1'
                ],
                // Short syntax
                [
                    'path',
                    'program',
                    '-m',
                    'expire pair material agent north ostrich fortune level cousin snow mixture nurse',
                    '-mi',
                    '1'
                ],

                // Normal syntax
                [
                    'path',
                    'program',
                    '--mnemonic',
                    'expire pair material agent north ostrich fortune level cousin snow mixture nurse'
                ],
                // Short syntax
                [
                    'path',
                    'program',
                    '-m',
                    'expire pair material agent north ostrich fortune level cousin snow mixture nurse'
                ],

                // Normal syntax
                ['path', 'program', '--mnemonicInitialIndex', '1'],
                // Short syntax
                ['path', 'program', '-mi', '1'],

                // Wrong format

                // Normal syntax
                [
                    'path',
                    'program',
                    '--mnemonic',
                    'INVALID',
                    '--mnemonicInitialIndex',
                    '1',
                    '--mnemonicCount',
                    '2'
                ],
                // Short syntax
                ['path', 'program', '-m', 'INVALID', '-mi', '1', '-mc', '2'],

                // Normal syntax
                [
                    'path',
                    'program',
                    '--mnemonic',
                    'expire pair material agent north ostrich fortune level cousin snow mixture nurse',
                    '--mnemonicInitialIndex',
                    '-1',
                    '--mnemonicCount',
                    '2'
                ],
                // Short syntax
                [
                    'path',
                    'program',
                    '-m',
                    'expire pair material agent north ostrich fortune level cousin snow mixture nurse',
                    '-mi',
                    '-1',
                    '-mc',
                    '2'
                ],

                // Normal syntax
                [
                    'path',
                    'program',
                    '--mnemonic',
                    'expire pair material agent north ostrich fortune level cousin snow mixture nurse',
                    '--mnemonicInitialIndex',
                    '1',
                    '--mnemonicCount',
                    '-2'
                ],
                // Short syntax
                [
                    'path',
                    'program',
                    '-m',
                    'expire pair material agent north ostrich fortune level cousin snow mixture nurse',
                    '-mi',
                    '1',
                    '-mc',
                    '-2'
                ],

                // Empty fields

                // Normal syntax
                [
                    'path',
                    'program',
                    '--mnemonic',
                    '',
                    '--mnemonicInitialIndex',
                    '1',
                    '--mnemonicCount',
                    '2'
                ],
                // Short syntax
                ['path', 'program', '-m', '', '-mi', '1', '-mc', '2'],

                // Normal syntax
                [
                    'path',
                    'program',
                    '--mnemonic',
                    'expire pair material agent north ostrich fortune level cousin snow mixture nurse',
                    '--mnemonicInitialIndex',
                    '',
                    '--mnemonicCount',
                    '2'
                ],
                // Short syntax
                [
                    'path',
                    'program',
                    '-m',
                    'expire pair material agent north ostrich fortune level cousin snow mixture nurse',
                    '-mi',
                    '',
                    '-mc',
                    '2'
                ],

                // Normal syntax
                [
                    'path',
                    'program',
                    '--mnemonic',
                    'expire pair material agent north ostrich fortune level cousin snow mixture nurse',
                    '--mnemonicInitialIndex',
                    '1',
                    '--mnemonicCount',
                    ''
                ],
                // Short syntax
                [
                    'path',
                    'program',
                    '-m',
                    'expire pair material agent north ostrich fortune level cousin snow mixture nurse',
                    '-mi',
                    '1',
                    '-mc',
                    ''
                ]
            ].forEach((args) => {
                // Get options
                const options = getOptionsFromCommandLine('1.0.0', args);

                // Throw the error
                expect(() =>
                    parseAndGetFinalConfig(options, defaultConfiguration)
                ).toThrow(InvalidCommandLineArguments);
            });
        });

        /**
         * Should NOT be able to parse delegation options from command line arguments (gasPayerPrivateKey and gasPayerServiceUrl fields) AND get the configuration
         */
        test('Should be NOT able to parse delegation options from command line arguments AND get the configuration', () => {
            [
                // Both delegation fields are provided

                // Normal syntax
                [
                    'path',
                    'program',
                    '--gasPayerPrivateKey',
                    '8f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158',
                    '--gasPayerServiceUrl',
                    'http://localhost:8080'
                ],
                // Short syntax
                [
                    'path',
                    'program',
                    '--gasPayerPrivateKey',
                    '8f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158',
                    '-s',
                    'http://localhost:8080'
                ],

                // Invalid fields

                // Normal syntax
                ['path', 'program', '--gasPayerPrivateKey', 'INVALID'],

                // Normal syntax
                ['path', 'program', '--gasPayerServiceUrl', 'INVALID'],
                // Short syntax
                ['path', 'program', '-s', 'INVALID'],

                // Empty fields

                // Normal syntax
                ['path', 'program', '--gasPayerPrivateKey', ''],

                // Normal syntax
                ['path', 'program', '--gasPayerServiceUrl', ''],
                // Short syntax
                ['path', 'program', '-s', ''],

                // Enable delegation without the gasPayer

                // Normal syntax
                ['path', 'program', '--enableDelegation']
            ].forEach((args) => {
                // Get options
                const options = getOptionsFromCommandLine('1.0.0', args);

                // Throw the error
                expect(() =>
                    parseAndGetFinalConfig(options, defaultConfiguration)
                ).toThrow(InvalidCommandLineArguments);
            });
        });

        /**
         * Should NOT be able to parse the configuration file option from command line arguments AND get the configuration
         */
        test('Should be NOT able to parse an invalid configuration file from command line arguments AND get the configuration', () => {
            [
                // Normal syntax
                ['path', 'program', '--configurationFile', `INVALID`],
                // Short syntax
                ['path', 'program', '-c', `INVALID`],
                // Normal syntax
                ['path', 'program', '--configurationFile', ''],
                // Short syntax
                ['path', 'program', '-c', '']
            ].forEach((args) => {
                // Get options
                const options = getOptionsFromCommandLine('1.0.0', args);

                // Throw the error
                expect(() =>
                    parseAndGetFinalConfig(options, defaultConfiguration)
                ).toThrow(InvalidConfigurationFilePath);
            });
        });
    });
});
