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
                ['path', 'program', '-p', 'INVALID']
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
         * Should be able to parse the url option from command line arguments
         */
        test('Should be NOT able to parse an invalid url from command line arguments', () => {
            [
                // Normal syntax
                ['path', 'program', '--url', 'INVALID'],
                // Short syntax
                ['path', 'program', '-u', 'INVALID']
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
         * Should be able to parse the configuration file option from command line arguments
         */
        test('Should be NOT able to parse an invalid configuration file from command line arguments', () => {
            [
                // Normal syntax
                ['path', 'program', '--configurationFile', `INVALID`],
                // Short syntax
                ['path', 'program', '-c', `INVALID`]
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
