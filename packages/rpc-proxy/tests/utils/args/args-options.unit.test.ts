import { describe, test } from '@jest/globals';
import { getOptionsFromCommandLine } from '../../../src/utils';

/**
 * Args options tests
 * @group unit/utils/args-options
 */
describe('Args options tests', () => {
    /**
     * Parse command line arguments
     */
    describe('Get options with command line arguments', () => {
        /**
         * Should be able to parse the port option
         */
        test('Should be able to parse the port option', () => {
            [
                // Normal syntax
                ['path', 'program', '--port', '10'],
                // Short syntax
                ['path', 'program', '-p', '10']
            ].forEach((args) => {
                const portOption = getOptionsFromCommandLine('1.0.0', args);

                expect(portOption).toBeDefined();
                expect(portOption.port).toBe('10');
            });
        });

        /**
         * Should be able to parse the url option
         */
        test('Should be able to parse the url option', () => {
            [
                // Normal syntax
                ['path', 'program', '--url', 'http://localhost:8080'],
                // Short syntax
                ['path', 'program', '-u', 'http://localhost:8080']
            ].forEach((args) => {
                const urlOption = getOptionsFromCommandLine('1.0.0', args);

                expect(urlOption).toBeDefined();
                expect(urlOption.url).toBe('http://localhost:8080');
            });
        });

        /**
         * Should be able to parse the verbose option
         */
        test('Should be able to parse the verbose option', () => {
            [
                // Normal syntax
                ['path', 'program', '--verbose'],
                // Short syntax
                ['path', 'program', '-v']
            ].forEach((args) => {
                const verboseOption = getOptionsFromCommandLine('1.0.0', args);

                expect(verboseOption).toBeDefined();
                expect(verboseOption.verbose).toBe(true);
            });
        });

        /**
         * Should be able to parse the configuration file option
         */
        test('Should be able to parse the configuration file option', () => {
            [
                // Normal syntax
                ['path', 'program', '--configurationFile', 'config.json'],
                // Short syntax
                ['path', 'program', '-c', 'config.json']
            ].forEach((args) => {
                const configFileOption = getOptionsFromCommandLine(
                    '1.0.0',
                    args
                );

                expect(configFileOption).toBeDefined();
                expect(configFileOption.configurationFile).toBe('config.json');
            });
        });
    });
});
