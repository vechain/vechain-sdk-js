import { describe, test } from '@jest/globals';
import {
    getConfigObjectFromFile,
    getOptionsFromCommandLine,
    parseAndGetFinalConfig
} from '../../../src/utils';
import { correctConfigurationFilePathFixture } from '../../fixture';
import {
    InvalidCommandLineArguments,
    InvalidConfigurationFilePath
} from '@vechain/sdk-errors';

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
     * Parse command line arguments - positive test cases
     */
    describe('Parse command line arguments - positive cases', () => {
        /**
         * Should be able to parse empty command line arguments (default configuration)
         */
        test('Should be able to parse empty command line arguments', () => {
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
         * Should be able to parse the port option from command line arguments
         */
        test('Should be able to get the port from command lime arguments', () => {
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
         * Should be able to parse the url option from command line arguments
         */
        test('Should be able to get the url from command line arguments', () => {
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
         * Should be able to parse the verbose option from command line arguments
         */
        test('Should be able to get the verbose option from command line arguments', () => {
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
         * Should be able to parse the accounts (as a list of private keys) option from command line arguments
         */
        test('Should be able to get the accounts from command line arguments', () => {
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
         * Should be able to parse the configuration file option from command line arguments
         */
        test('Should be able to get the configuration file from command line arguments', () => {
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
     * Parse command line arguments - negative test cases
     */
    describe('Parse command line arguments - negative cases', () => {
        /**
         * Should NOT be able to parse an invalid port option from command line arguments
         */
        test('Should NOT be able to parse an invalid port option from command line arguments', () => {
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
                ).toThrowError(InvalidCommandLineArguments);
            });
        });

        /**
         * Should NOT be able to parse the url option from command line arguments
         */
        test('Should be NOT able to parse an invalid url from command line arguments', () => {
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
                ).toThrowError(InvalidCommandLineArguments);
            });
        });

        /**
         * Should NOT be able to parse the accounts (as a list of private keys) option from command line arguments
         */
        test('Should be NOT able to parse an invalid accounts from command line arguments', () => {
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
                ).toThrowError(InvalidCommandLineArguments);
            });
        });

        /**
         * Should NOT be able to parse the configuration file option from command line arguments
         */
        test('Should be NOT able to parse an invalid configuration file from command line arguments', () => {
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
                ).toThrowError(InvalidConfigurationFilePath);
            });
        });
    });
});
