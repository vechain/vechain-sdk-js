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
         * Should be able to parse the account option (as a list of private keys)
         */
        test('Should be able to parse the account option', () => {
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
                const accountOption = getOptionsFromCommandLine('1.0.0', args);

                expect(accountOption).toBeDefined();
                expect(accountOption.accounts).toEqual(
                    '8f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158 7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158'
                );
            });
        });

        /**
         * Should be able to parse the mnemonic options
         * (mnemonic, mnemonicIndex, mnemonicCount)
         */
        test('Should be able to parse the mnemonic options', () => {
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
                const mnemonicOption = getOptionsFromCommandLine('1.0.0', args);

                expect(mnemonicOption).toBeDefined();
                expect(mnemonicOption.mnemonic).toBe(
                    'expire pair material agent north ostrich fortune level cousin snow mixture nurse'
                );
                expect(mnemonicOption.mnemonicInitialIndex).toBe('1');
                expect(mnemonicOption.mnemonicCount).toBe('2');
            });
        });

        /**
         * Should be able to parse the enable delegation option
         */
        test('Should be able to parse the enable delegation option', () => {
            [
                // Normal syntax
                ['path', 'program', '--enableDelegation'],
                // Short syntax
                ['path', 'program', '-e']
            ].forEach((args) => {
                const enableDelegationOption = getOptionsFromCommandLine(
                    '1.0.0',
                    args
                );

                expect(enableDelegationOption).toBeDefined();
                expect(enableDelegationOption.enableDelegation).toBe(true);
            });
        });

        /**
         * Should be able to parse the gasPayer private key option
         */
        test('Should be able to parse the gasPayer private key option', () => {
            [
                // Normal syntax
                [
                    'path',
                    'program',
                    '--delegatorPrivateKey',
                    '8f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158'
                ],
                // Short syntax
                [
                    'path',
                    'program',
                    '-dp',
                    '8f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158'
                ]
            ].forEach((args) => {
                const delegatorPrivateKeyOption = getOptionsFromCommandLine(
                    '1.0.0',
                    args
                );

                expect(delegatorPrivateKeyOption).toBeDefined();
                expect(delegatorPrivateKeyOption.delegatorPrivateKey).toBe(
                    '8f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158'
                );
            });
        });

        /**
         * Should be able to parse the gasPayer URL option
         */
        test('Should be able to parse the gasPayer URL option', () => {
            [
                // Normal syntax
                ['path', 'program', '--delegatorUrl', 'http://localhost:8080'],
                // Short syntax
                ['path', 'program', '-du', 'http://localhost:8080']
            ].forEach((args) => {
                const delegatorUrlOption = getOptionsFromCommandLine(
                    '1.0.0',
                    args
                );

                expect(delegatorUrlOption).toBeDefined();
                expect(delegatorUrlOption.delegatorUrl).toBe(
                    'http://localhost:8080'
                );
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
