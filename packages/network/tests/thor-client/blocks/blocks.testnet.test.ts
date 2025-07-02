import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import {
    expandedBlockDetailFixture,
    invalidBlockRevisions,
    validCompressedBlockRevisions,
    validExpandedBlockRevisions,
    waitForBlockTestCases
} from './fixture';
import { Poll, TESTNET_URL, ThorClient } from '../../../src';
import { Address, BloomFilter, networkInfo } from '@vechain/sdk-core';
import { SimpleHttpClient } from '../../../src/http';
import { retryOperation } from '../../test-utils';

/**
 * Blocks Module integration tests
 *
 * @group integration/clients/thor-client/blocks
 */
describe('ThorClient - Blocks Module', () => {
    // ThorClient instance
    let thorClient: ThorClient;

    beforeEach(() => {
        thorClient = new ThorClient(new SimpleHttpClient(TESTNET_URL), {
            isPollingEnabled: true
        });
    });

    afterEach(() => {
        thorClient.destroy();
    });

    /**
     * Test suite for waitForBlockCompressed method
     * The waitForBlockCompressed method is tested in parallel with different options, coming from the waitForBlockTestCases array
     */
    describe('waitForBlockCompressed', () => {
        test(
            'parallel waitForBlockCompressed tests',
            async () => {
                // Map each test case to a promise
                const tests = waitForBlockTestCases.map(async ({ options }) => {
                    const bestBlock =
                        await thorClient.blocks.getBestBlockCompressed();
                    if (bestBlock != null) {
                        const expectedBlock =
                            await thorClient.blocks.waitForBlockCompressed(
                                bestBlock?.number + 1,
                                options
                            );

                        // Incorporate the description into the assertion message for clarity
                        expect(expectedBlock?.number).toBeGreaterThan(
                            bestBlock?.number
                        );
                    }
                });

                // Wait for all tests to complete
                await Promise.all(tests);
            },
            12000 * waitForBlockTestCases.length
        );
    });

    /**
     * Test suite for waitForBlockExpanded method
     * The waitForBlockExpanded method is tested in parallel with different options, coming from the waitForBlockTestCases array
     */
    describe('waitForBlockExpanded', () => {
        test(
            'parallel waitForBlockExpanded tests',
            async () => {
                // Map each test case to a promise
                const tests = waitForBlockTestCases.map(async ({ options }) => {
                    const bestBlock =
                        await thorClient.blocks.getBestBlockExpanded();
                    if (bestBlock != null) {
                        const expectedBlock =
                            await thorClient.blocks.waitForBlockExpanded(
                                bestBlock?.number + 1,
                                options
                            );

                        // Incorporate the description into the assertion message for clarity
                        expect(expectedBlock?.number).toBeGreaterThan(
                            bestBlock?.number
                        );
                    }
                });

                // Wait for all tests to complete
                await Promise.all(tests);
            },
            12000 * waitForBlockTestCases.length
        );
    });

    describe('getAllAddressesIntoABlock', () => {
        /**
         * Test for getAllAddressesIntoABlock function
         */
        test('getAllAddressesIntoABlock', () => {
            const expected = [
                '0x0000000000000000000000000000456e65726779',
                '0x1a8abd6d5627eb26ad71c0c7ae5224cdc640faf3',
                '0x1eef8963e1222417af4dac0d98553abddb4a76b5',
                '0x23a46368e4acc7bb2fe0afeb054def51ec56aa74',
                '0x45429a2255e7248e57fce99e7239aed3f84b7a53',
                '0x576da7124c7bb65a692d95848276367e5a844d95',
                '0x5db3c8a942333f6468176a870db36eef120a34dc',
                '0x6298c7a54720febdefd741d0899d287c70954c68',
                '0x95fe74d1ae072ee45bdb09879a157364e5341565',
                '0x9a107a75cff525b033a3e53cadafe3d193b570ec',
                '0xa416bdda32b00e218f08ace220bab512c863ff2f',
                '0xb2c20a6de401003a671659b10629eb82ff254fb8',
                '0xb7591602c0c9d525bc3a7cf3c729fd91b8bf5bf6',
                '0xbeae4bef0121f11d269aedf6adb227259d4314ad'
            ];
            thorClient.blocks
                .getAllAddressesIntoABlock(expandedBlockDetailFixture)
                .filter((address) => {
                    return Address.isValid(address); // Remove empty addresses.
                })
                .forEach((actual) => {
                    expect(expected.includes(actual)).toBeTruthy();
                });
        });

        test('getAllAddressesIntoABlock combined with boolUtils.filterOf - bit per key - default', () => {
            const addresses = thorClient.blocks
                .getAllAddressesIntoABlock(expandedBlockDetailFixture)
                .filter((address) => {
                    return Address.isValid(address);
                });
            const filter = BloomFilter.of(
                ...addresses.map((address) => Address.of(address))
            ).build();
            addresses.forEach((address) => {
                expect(filter.contains(Address.of(address))).toBeTruthy();
            });
        });

        test('getAllAddressesIntoABlock combined with boolUtils.filterOf -  bit per key - set', () => {
            const k = 16;
            const addresses = thorClient.blocks
                .getAllAddressesIntoABlock(expandedBlockDetailFixture)
                .filter((address) => {
                    return Address.isValid(address);
                });

            const filter = BloomFilter.of(
                ...addresses.map((address) => Address.of(address))
            ).build(k);
            addresses.forEach((address) => {
                expect(filter.contains(Address.of(address))).toBeTruthy();
            });
        });
    });

    test('waitForBlockCompressed - invalid blockNumber', async () => {
        await expect(
            async () => await thorClient.blocks.waitForBlockCompressed(-2)
        ).rejects.toThrowError(
            'Invalid blockNumber. The blockNumber must be a number representing a block number.'
        );
    }, 5000);

    test('waitForBlockExpanded - invalid blockNumber', async () => {
        await expect(
            async () => await thorClient.blocks.waitForBlockExpanded(-2)
        ).rejects.toThrowError(
            'Invalid blockNumber. The blockNumber must be a number representing a block number.'
        );
    }, 5000);

    test('waitForBlockCompressed - maximumWaitingTimeInMilliseconds', async () => {
        // Get best block
        const bestBlock = await thorClient.blocks.getBestBlockCompressed();
        if (bestBlock != null) {
            const block = await thorClient.blocks.waitForBlockCompressed(
                bestBlock?.number + 2,
                {
                    timeoutMs: 1000
                }
            );

            expect(block).toBeDefined();
            expect(block?.number).not.toBeGreaterThan(bestBlock?.number + 1); // Not enough time to wait for the block (only 1 second was given)
        }
    }, 23000);

    /**
     * getBlockCompressed tests
     */
    describe('getBlockCompressed', () => {
        /**
         * getBlockCompressed tests with revision block number or block id
         */
        validCompressedBlockRevisions.forEach(({ revision, expected }) => {
            test(
                revision,
                async () => {
                    const blockDetails =
                        await thorClient.blocks.getBlockCompressed(revision);
                    expect(blockDetails).toEqual(expected);
                },
                5000
            );
        });

        /**
         * getBlockExpanded tests with revision block number or block id
         */
        validExpandedBlockRevisions.forEach(({ revision, expected }) => {
            test(
                revision,
                async () => {
                    const blockDetails =
                        await thorClient.blocks.getBlockExpanded(revision);
                    expect(blockDetails).toEqual(expected);
                },
                5000
            );
        });

        /**
         * getBlockCompressed tests with invalid revision block number or block id
         */
        invalidBlockRevisions.forEach(
            ({ description, revision, expectedError }) => {
                test(
                    description,
                    async () => {
                        await expect(
                            thorClient.blocks.getBlockCompressed(revision)
                        ).rejects.toThrowError(expectedError);
                    },
                    5000
                );
            }
        );

        /**
         * getBlockCompressed tests with invalid revision block number or block id
         */
        invalidBlockRevisions.forEach(
            ({ description, revision, expectedError }) => {
                test(
                    description,
                    async () => {
                        await expect(
                            thorClient.blocks.getBlockExpanded(revision)
                        ).rejects.toThrowError(expectedError);
                    },
                    5000
                );
            }
        );

        /**
         * getBestBlockCompressed test
         */
        test('getBestBlockCompressed', async () => {
            const blockDetails = await retryOperation(async () => {
                return await thorClient.blocks.getBestBlockCompressed();
            });
            if (blockDetails != null) {
                const block = await thorClient.blocks.getBlockCompressed(
                    blockDetails.number
                );
                expect(block?.number).toBe(blockDetails.number);
            }
            expect(blockDetails).not.toBeNull();
            expect(blockDetails).toBeDefined();
        }, 15000);

        /**
         * getBestBlockExpanded test
         */
        test('getBestBlockExpanded', async () => {
            const blockDetails = await retryOperation(async () => {
                return await thorClient.blocks.getBestBlockExpanded();
            });
            if (blockDetails != null) {
                const block = await thorClient.blocks.getBlockExpanded(
                    blockDetails.number
                );
                expect(block?.number).toBe(blockDetails.number);
            }
            expect(blockDetails).not.toBeNull();
            expect(blockDetails).toBeDefined();
        }, 15000);

        /**
         * getBestBlockRef test
         */
        test('getBestBlockRef', async () => {
            const bestBlockRef = await retryOperation(async () => {
                return await thorClient.blocks.getBestBlockRef();
            });
            expect(bestBlockRef).not.toBeNull();
            expect(bestBlockRef).toBeDefined();
        }, 15000);

        /**
         * getFinalBlockCompressed test
         */
        test('getFinalBlockCompressed', async () => {
            const blockDetails = await retryOperation(async () => {
                return await thorClient.blocks.getFinalBlockCompressed();
            });
            expect(blockDetails).not.toBeNull();
            expect(blockDetails).toBeDefined();
        }, 15000);

        /**
         * getFinalBlockExpanded test
         */
        test('getFinalBlockExpanded', async () => {
            const blockDetails = await retryOperation(async () => {
                return await thorClient.blocks.getFinalBlockExpanded();
            });
            expect(blockDetails).not.toBeNull();
            expect(blockDetails).toBeDefined();
        }, 15000);

        /**
         * getHeadBlock test
         */
        test('getHeadBlock', async () => {
            const headBlockFirst = await Poll.SyncPoll(() =>
                thorClient.blocks.getHeadBlock()
            ).waitUntil((result) => {
                return result !== null;
            });

            expect(headBlockFirst).toBeDefined();

            // Wait for the next block
            const headBlockSecond = await Poll.SyncPoll(() =>
                thorClient.blocks.getHeadBlock()
            ).waitUntil((result) => {
                return result !== headBlockFirst;
            });

            expect(headBlockSecond).toBeDefined();
            expect(headBlockFirst).not.toBe(headBlockSecond);
        }, 23000);

        /**
         * getGenesisBlock test
         */
        test('getGenesisBlock', async () => {
            const blockDetails = await thorClient.blocks.getGenesisBlock();
            expect(blockDetails).toBeDefined();
            expect(blockDetails?.number).toBe(0);
            expect(blockDetails?.id).toStrictEqual(
                networkInfo.testnet.genesisBlock.id
            );
        });
    });
});
