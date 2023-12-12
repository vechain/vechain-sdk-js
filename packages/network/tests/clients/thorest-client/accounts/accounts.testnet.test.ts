import { describe, expect, test } from '@jest/globals';
import {
    NULL_STORAGE_SLOT,
    getAccountWithRevisionTestCases,
    getBytecodeTestCases,
    invalidGetAccountTests,
    invalidGetBytecodeTests,
    invalidGetStorageAtTests,
    testSmartContract,
    testStoragePositionKey
} from './fixture';
import { testAccount, thorestClient } from '../../../fixture';

/**
 * ThorestClient class tests
 *
 * @group integration/clients/thorest-client/accounts
 */
describe('ThorestClient - Accounts', () => {
    /**
     * getAccount tests
     */
    describe('getAccount', () => {
        /**
         * getAccount tests with revision block number or block id
         */
        getAccountWithRevisionTestCases.forEach(
            ({ description, account, revision, expected }) => {
                test(description, async () => {
                    const accountDetails =
                        await thorestClient.accounts.getAccount(account, {
                            revision
                        });
                    expect(accountDetails).toEqual(expected);
                });
            }
        );

        /**
         * getAccount without revision (latest block)
         */
        test('get account without revision', async () => {
            const accountDetails =
                await thorestClient.accounts.getAccount(testAccount);
            expect(accountDetails).toBeDefined();
            expect(accountDetails.balance).toBeDefined();
            expect(accountDetails.energy).toBeDefined();
            expect(accountDetails.hasCode).toBeDefined();
            expect(accountDetails.hasCode).toEqual(false);
        });

        /**
         * getAccount with invalid revision & address
         */
        invalidGetAccountTests.forEach(
            ({ description, address, revision, expectedError }) => {
                test(description, async () => {
                    await expect(
                        thorestClient.accounts.getAccount(address, { revision })
                    ).rejects.toThrowError(expectedError);
                });
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
                test(description, async () => {
                    const bytecode = await thorestClient.accounts.getBytecode(
                        address,
                        { revision }
                    );
                    expect(bytecode).toEqual(expected);
                });
            }
        );

        /**
         * Tests invalid revision & address
         */
        invalidGetBytecodeTests.forEach(
            ({ description, address, revision, expectedError }) => {
                test(description, async () => {
                    await expect(
                        thorestClient.accounts.getBytecode(address, {
                            revision
                        })
                    ).rejects.toThrowError(expectedError);
                });
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
            const storageData = await thorestClient.accounts.getStorageAt(
                testSmartContract,
                testStoragePositionKey
            );

            expect(storageData).toBeDefined();
            expect(storageData).not.toEqual(NULL_STORAGE_SLOT);
        });

        /**
         * Tests storage data at the specified position of the smart contract with revision
         */
        test('Should get the storage data at the specified position of the smart contract with revision', async () => {
            const storageData = await thorestClient.accounts.getStorageAt(
                testSmartContract,
                testStoragePositionKey,
                { revision: '1' }
            );

            expect(storageData).toBeDefined();
            expect(storageData).toEqual(NULL_STORAGE_SLOT);
        });

        /**
         * Tests invalid position & revisions
         */
        invalidGetStorageAtTests.forEach(
            ({ description, address, position, revision, expectedError }) => {
                test(description, async () => {
                    await expect(
                        thorestClient.accounts.getStorageAt(address, position, {
                            revision
                        })
                    ).rejects.toThrowError(expectedError);
                });
            }
        );
    });
});
