import { beforeEach, describe, expect, test } from '@jest/globals';
import {
    getAccountWithRevisionTestCases,
    getBytecodeTestCases,
    invalidGetAccountTests,
    invalidGetBytecodeTests,
    invalidGetStorageAtTests,
    NULL_STORAGE_SLOT,
    testSmartContract,
    testStoragePositionKey
} from './fixture';
import { testAccount } from '../../fixture';
import { TESTNET_URL, ThorClient } from '../../../src';
import { Address, Revision, ThorId } from '@vechain/sdk-core';

/**
 * ThorClient class tests
 *
 * @group integration/clients/thor-client/accounts
 */
describe('ThorClient - Accounts Module', () => {
    // ThorClient instance
    let thorClient: ThorClient;

    beforeEach(() => {
        thorClient = ThorClient.at(TESTNET_URL);
    });

    /**
     * getAccount tests
     */
    describe('getAccount', () => {
        /**
         * getAccount tests with revision block number or block id
         */
        getAccountWithRevisionTestCases.forEach(
            ({ description, account, revision, expected }) => {
                test(
                    description,
                    async () => {
                        const accountDetails =
                            await thorClient.accounts.getAccount(
                                Address.of(account),
                                {
                                    revision: Revision.of(revision)
                                }
                            );
                        expect(accountDetails).toEqual(expected);
                    },
                    3000
                );
            }
        );

        /**
         * getAccount without revision (latest block)
         */
        test('get account without revision', async () => {
            const accountDetails = await thorClient.accounts.getAccount(
                Address.of(testAccount)
            );
            expect(accountDetails).toBeDefined();
            expect(accountDetails.balance).toBeDefined();
            expect(accountDetails.energy).toBeDefined();
            expect(accountDetails.hasCode).toBeDefined();
            expect(accountDetails.hasCode).toEqual(false);
        }, 3000);

        /**
         * getAccount with invalid revision & address
         */
        invalidGetAccountTests.forEach(
            ({ description, address, revision, expectedError }) => {
                test(
                    description,
                    async () => {
                        await expect(
                            thorClient.accounts.getAccount(
                                Address.of(address),
                                { revision: Revision.of(revision) }
                            )
                        ).rejects.toThrowError(expectedError);
                    },
                    3000
                );
            }
        );
    });

    /**
     * getBytecode tests
     */
    describe('getBytecode', () => {
        /**
         * Tests VTHO contract bytecode and revision
         */
        getBytecodeTestCases.forEach(
            ({ description, address, revision, expected }) => {
                test(
                    description,
                    async () => {
                        const bytecode = await thorClient.accounts.getBytecode(
                            Address.of(address),
                            { revision: Revision.of(revision as string) }
                        );
                        expect(bytecode).toEqual(expected);
                    },
                    3000
                );
            }
        );

        /**
         * Tests invalid revision & address
         */
        invalidGetBytecodeTests.forEach(
            ({ description, address, revision, expectedError }) => {
                test(
                    description,
                    async () => {
                        await expect(
                            thorClient.accounts.getBytecode(
                                Address.of(address),
                                {
                                    revision: Revision.of(revision)
                                }
                            )
                        ).rejects.toThrowError(expectedError);
                    },
                    3000
                );
            }
        );
    });

    /**
     * getStorageAt tests
     */
    describe('getStorageAt', () => {
        /**
         * Tests storage data at the specified position of the smart contract
         */
        test('Should get the storage data at the specified position of the smart contract', async () => {
            const storageData = await thorClient.accounts.getStorageAt(
                Address.of(testSmartContract),
                ThorId.of(testStoragePositionKey)
            );

            expect(storageData).toBeDefined();
            expect(storageData).not.toEqual(NULL_STORAGE_SLOT);
        }, 3000);

        /**
         * Tests storage data at the specified position of the smart contract with revision
         */
        test('Should get the storage data at the specified position of the smart contract with revision', async () => {
            const storageData = await thorClient.accounts.getStorageAt(
                Address.of(testSmartContract),
                ThorId.of(testStoragePositionKey),
                { revision: Revision.of('1') }
            );

            expect(storageData).toBeDefined();
            expect(storageData).toEqual(NULL_STORAGE_SLOT);
        }, 3000);

        /**
         * Tests invalid position & revisions
         */
        invalidGetStorageAtTests.forEach(
            ({ description, address, position, revision, expectedError }) => {
                test(
                    description,
                    async () => {
                        await expect(
                            thorClient.accounts.getStorageAt(
                                Address.of(address),
                                ThorId.of(position),
                                {
                                    revision: Revision.of(revision)
                                }
                            )
                        ).rejects.toThrowError(expectedError);
                    },
                    3000
                );
            }
        );
    });
});
