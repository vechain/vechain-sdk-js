import { describe, test } from '@jest/globals';
import {
    checkValidConfigurationFile,
    getConfigObjectFromFile
} from '../../../src/utils';
import {
    defaultConfigurationFilePathFixture,
    invalidJSONConfigurationFilePathFixture,
    invalidParametersConfigurationFilePathFixture
} from '../../fixture';
import {
    InvalidConfigurationFile,
    InvalidConfigurationFilePath
} from '@vechain/sdk-errors';

/**
 * Config validator tests
 * @group unit/utils/config-validator
 */
describe('Configuration file validator', () => {
    /**
     * Validation of configuration file positive cases
     */
    describe('configurationFile - correct cases', () => {
        /**
         * Should be able to parse a valid configuration file
         */
        test('Should be able to parse a valid configuration file', () => {
            expect(() => {
                checkValidConfigurationFile(
                    defaultConfigurationFilePathFixture
                );
            }).not.toThrow();
        });
        /**
         * Should be able to load the configuration file
         */
        test('Should be able to load the configuration file', () => {
            const config = getConfigObjectFromFile(
                defaultConfigurationFilePathFixture
            );
            expect(config).toBeDefined();

            // Check the properties
            expect(config.url).toBeDefined();
            expect(config.port).toBeDefined();
            expect(config.accounts).toBeDefined();
        });
    });

    /**
     * Validation of configuration file negative cases
     */
    describe('configurationFile - negative cases', () => {
        /**
         * Should not be able to parse a file that does not exist
         */
        test('Should not be able to parse a file that does not exist', () => {
            expect(() => {
                checkValidConfigurationFile('INVALID');
            }).toThrowError(InvalidConfigurationFilePath);
        });

        /**
         * Should not be able to parse an invalid JSON file
         */
        test('Should not be able to parse an invalid JSON file', () => {
            expect(() => {
                checkValidConfigurationFile(
                    invalidJSONConfigurationFilePathFixture
                );
            }).toThrowError(InvalidConfigurationFile);
        });

        /**
         * Invalid configuration parameters
         */
        describe('Invalid configuration parameters', () => {
            /**
             * Should not be able to parse a configuration file with an invalid port
             */
            test('Should not be able to parse a configuration file with an invalid port', () => {
                invalidParametersConfigurationFilePathFixture[
                    'invalid-port'
                ].forEach((filePath) => {
                    expect(() => {
                        checkValidConfigurationFile(filePath);
                    }).toThrowError(InvalidConfigurationFile);
                });
            });

            /**
             * Should not be able to parse a configuration file with an invalid URL
             */
            test('Should not be able to parse a configuration file with an invalid URL', () => {
                invalidParametersConfigurationFilePathFixture[
                    'invalid-url'
                ].forEach((filePath) => {
                    expect(() => {
                        checkValidConfigurationFile(filePath);
                    }).toThrowError(InvalidConfigurationFile);
                });
            });
        });
    });
});
