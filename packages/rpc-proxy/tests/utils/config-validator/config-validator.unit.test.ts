import { describe, test } from '@jest/globals';
import {
    checkValidConfigurationFile,
    getConfigObjectFromFile
} from '../../../src/utils';
import {
    correctConfigurationFilePathFixture,
    invalidJSONConfigurationFilePathFixture,
    invalidParametersConfigurationFilePathFixture,
    invalidSemanticConfigurationFilePathFixture
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
         * Should be able to parse valid configuration files
         */
        test('Should be able to parse valid configuration files', () => {
            correctConfigurationFilePathFixture.forEach((filePath) => {
                expect(() => {
                    checkValidConfigurationFile(filePath);
                }).not.toThrow();
            });
        });

        /**
         * Should be able to load configuration files
         */
        test('Should be able to load configuration files', () => {
            correctConfigurationFilePathFixture.forEach((filePath) => {
                const config = getConfigObjectFromFile(filePath);
                expect(config).toBeDefined();

                // Check the properties
                expect(config.url).toBeDefined();
                expect(config.port).toBeDefined();
                expect(config.accounts).toBeDefined();
            });
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
            }).toThrow(InvalidConfigurationFilePath);
        });

        /**
         * Should not be able to parse an invalid JSON file
         */
        test('Should not be able to parse an invalid JSON file', () => {
            expect(() => {
                checkValidConfigurationFile(
                    invalidJSONConfigurationFilePathFixture
                );
            }).toThrow(InvalidConfigurationFile);
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
                    }).toThrow(InvalidConfigurationFile);
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
                    }).toThrow(InvalidConfigurationFile);
                });
            });

            /**
             * Should not be able to parse a configuration file with invalid accounts
             */
            test('Should not be able to parse a configuration file with invalid accounts', () => {
                invalidParametersConfigurationFilePathFixture[
                    'invalid-accounts'
                ].forEach((filePath) => {
                    expect(() => {
                        checkValidConfigurationFile(filePath);
                    }).toThrow(InvalidConfigurationFile);
                });
            });

            /**
             * Should not be able to parse a configuration file with invalid delegator
             */
            test('Should not be able to parse a configuration file with invalid delegator', () => {
                invalidParametersConfigurationFilePathFixture[
                    'invalid-delegator'
                ].forEach((filePath) => {
                    expect(() => {
                        checkValidConfigurationFile(filePath);
                    }).toThrow(InvalidConfigurationFile);
                });
            });

            /**
             * Should not be able to parse a configuration file with invalid verbose
             */
            test('Should not be able to parse a configuration file with invalid verbose', () => {
                invalidParametersConfigurationFilePathFixture[
                    'invalid-verbose'
                ].forEach((filePath) => {
                    expect(() => {
                        checkValidConfigurationFile(filePath);
                    }).toThrow(InvalidConfigurationFile);
                });
            });

            /**
             * Should not be able to parse a configuration file with invalid enableDelegation
             */
            test('Should not be able to parse a configuration file with invalid enableDelegation', () => {
                invalidParametersConfigurationFilePathFixture[
                    'invalid-enable-delegation'
                ].forEach((filePath) => {
                    expect(() => {
                        checkValidConfigurationFile(filePath);
                    }).toThrow(InvalidConfigurationFile);
                });
            });
        });

        /**
         * Should not be able to parse a configuration file with invalid semantic
         */
        test('Should not be able to parse a configuration file with invalid semantic', () => {
            invalidSemanticConfigurationFilePathFixture.forEach((filePath) => {
                expect(() => {
                    checkValidConfigurationFile(filePath);
                }).toThrow(InvalidConfigurationFile);
            });
        });
    });
});
