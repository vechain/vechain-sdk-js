"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const fixture_1 = require("./fixture");
const src_1 = require("../../../src");
const sdk_core_1 = require("@vechain/sdk-core");
const http_1 = require("../../../src/http");
const test_utils_1 = require("../../test-utils");
/**
 * Blocks Module integration tests
 *
 * @group integration/clients/thor-client/blocks
 */
(0, globals_1.describe)('ThorClient - Blocks Module', () => {
    // ThorClient instance
    let thorClient;
    (0, globals_1.beforeEach)(() => {
        thorClient = new src_1.ThorClient(new http_1.SimpleHttpClient(src_1.TESTNET_URL), {
            isPollingEnabled: true
        });
    });
    (0, globals_1.afterEach)(() => {
        thorClient.destroy();
    });
    /**
     * Test suite for waitForBlockCompressed method
     * The waitForBlockCompressed method is tested in parallel with different options, coming from the waitForBlockTestCases array
     */
    (0, globals_1.describe)('waitForBlockCompressed', () => {
        (0, globals_1.test)('parallel waitForBlockCompressed tests', async () => {
            // Map each test case to a promise
            const tests = fixture_1.waitForBlockTestCases.map(async ({ options }) => {
                const bestBlock = await thorClient.blocks.getBestBlockCompressed();
                if (bestBlock != null) {
                    const expectedBlock = await thorClient.blocks.waitForBlockCompressed(bestBlock?.number + 1, options);
                    // Incorporate the description into the assertion message for clarity
                    (0, globals_1.expect)(expectedBlock?.number).toBeGreaterThan(bestBlock?.number);
                }
            });
            // Wait for all tests to complete
            await Promise.all(tests);
        }, 12000 * fixture_1.waitForBlockTestCases.length);
    });
    /**
     * Test suite for waitForBlockExpanded method
     * The waitForBlockExpanded method is tested in parallel with different options, coming from the waitForBlockTestCases array
     */
    (0, globals_1.describe)('waitForBlockExpanded', () => {
        (0, globals_1.test)('parallel waitForBlockExpanded tests', async () => {
            // Map each test case to a promise
            const tests = fixture_1.waitForBlockTestCases.map(async ({ options }) => {
                const bestBlock = await thorClient.blocks.getBestBlockExpanded();
                if (bestBlock != null) {
                    const expectedBlock = await thorClient.blocks.waitForBlockExpanded(bestBlock?.number + 1, options);
                    // Incorporate the description into the assertion message for clarity
                    (0, globals_1.expect)(expectedBlock).not.toBeNull();
                    (0, globals_1.expect)(expectedBlock?.number).toBeDefined();
                    (0, globals_1.expect)(expectedBlock?.number).toBeGreaterThan(bestBlock?.number);
                }
            });
            // Wait for all tests to complete
            await Promise.all(tests);
        }, 12000 * fixture_1.waitForBlockTestCases.length);
    });
    (0, globals_1.describe)('getAllAddressesIntoABlock', () => {
        /**
         * Test for getAllAddressesIntoABlock function
         */
        (0, globals_1.test)('getAllAddressesIntoABlock', () => {
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
                .getAllAddressesIntoABlock(fixture_1.expandedBlockDetailFixture)
                .filter((address) => {
                return sdk_core_1.Address.isValid(address); // Remove empty addresses.
            })
                .forEach((actual) => {
                (0, globals_1.expect)(expected.includes(actual)).toBeTruthy();
            });
        });
        (0, globals_1.test)('getAllAddressesIntoABlock combined with boolUtils.filterOf - bit per key - default', () => {
            const addresses = thorClient.blocks
                .getAllAddressesIntoABlock(fixture_1.expandedBlockDetailFixture)
                .filter((address) => {
                return sdk_core_1.Address.isValid(address);
            });
            const filter = sdk_core_1.BloomFilter.of(...addresses.map((address) => sdk_core_1.Address.of(address))).build();
            addresses.forEach((address) => {
                (0, globals_1.expect)(filter.contains(sdk_core_1.Address.of(address))).toBeTruthy();
            });
        });
        (0, globals_1.test)('getAllAddressesIntoABlock combined with boolUtils.filterOf -  bit per key - set', () => {
            const k = 16;
            const addresses = thorClient.blocks
                .getAllAddressesIntoABlock(fixture_1.expandedBlockDetailFixture)
                .filter((address) => {
                return sdk_core_1.Address.isValid(address);
            });
            const filter = sdk_core_1.BloomFilter.of(...addresses.map((address) => sdk_core_1.Address.of(address))).build(k);
            addresses.forEach((address) => {
                (0, globals_1.expect)(filter.contains(sdk_core_1.Address.of(address))).toBeTruthy();
            });
        });
    });
    (0, globals_1.test)('waitForBlockCompressed - invalid blockNumber', async () => {
        await (0, globals_1.expect)(async () => await thorClient.blocks.waitForBlockCompressed(-2)).rejects.toThrowError('Invalid blockNumber. The blockNumber must be a number representing a block number.');
    }, 5000);
    (0, globals_1.test)('waitForBlockExpanded - invalid blockNumber', async () => {
        await (0, globals_1.expect)(async () => await thorClient.blocks.waitForBlockExpanded(-2)).rejects.toThrowError('Invalid blockNumber. The blockNumber must be a number representing a block number.');
    }, 5000);
    (0, globals_1.test)('waitForBlockCompressed - maximumWaitingTimeInMilliseconds', async () => {
        // Get best block
        const bestBlock = await thorClient.blocks.getBestBlockCompressed();
        if (bestBlock != null) {
            const block = await thorClient.blocks.waitForBlockCompressed(bestBlock?.number + 2, {
                timeoutMs: 1000
            });
            (0, globals_1.expect)(block).toBeNull(); // Not enough time to wait for the block (only 1 second was given)
        }
    }, 23000);
    /**
     * getBlockCompressed tests
     */
    (0, globals_1.describe)('getBlockCompressed', () => {
        /**
         * getBlockCompressed tests with revision block number or block id
         */
        fixture_1.validCompressedBlockRevisions.forEach(({ revision, expected }) => {
            (0, globals_1.test)(revision, async () => {
                const blockDetails = await thorClient.blocks.getBlockCompressed(revision);
                (0, globals_1.expect)(blockDetails).toEqual(expected);
            }, 5000);
        });
        /**
         * getBlockExpanded tests with revision block number or block id
         */
        fixture_1.validExpandedBlockRevisions.forEach(({ revision, expected }) => {
            (0, globals_1.test)(revision, async () => {
                const blockDetails = await thorClient.blocks.getBlockExpanded(revision);
                (0, globals_1.expect)(blockDetails).toEqual(expected);
            }, 5000);
        });
        /**
         * getBlockCompressed tests with invalid revision block number or block id
         */
        fixture_1.invalidBlockRevisions.forEach(({ description, revision, expectedError }) => {
            (0, globals_1.test)(description, async () => {
                await (0, globals_1.expect)(thorClient.blocks.getBlockCompressed(revision)).rejects.toThrowError(expectedError);
            }, 5000);
        });
        /**
         * getBlockCompressed tests with invalid revision block number or block id
         */
        fixture_1.invalidBlockRevisions.forEach(({ description, revision, expectedError }) => {
            (0, globals_1.test)(description, async () => {
                await (0, globals_1.expect)(thorClient.blocks.getBlockExpanded(revision)).rejects.toThrowError(expectedError);
            }, 5000);
        });
        /**
         * getBestBlockCompressed test
         */
        (0, globals_1.test)('getBestBlockCompressed', async () => {
            const blockDetails = await (0, test_utils_1.retryOperation)(async () => {
                return await thorClient.blocks.getBestBlockCompressed();
            });
            if (blockDetails != null) {
                const block = await thorClient.blocks.getBlockCompressed(blockDetails.number);
                (0, globals_1.expect)(block?.number).toBe(blockDetails.number);
            }
            (0, globals_1.expect)(blockDetails).not.toBeNull();
            (0, globals_1.expect)(blockDetails).toBeDefined();
        }, 15000);
        /**
         * getBestBlockExpanded test
         */
        (0, globals_1.test)('getBestBlockExpanded', async () => {
            const blockDetails = await (0, test_utils_1.retryOperation)(async () => {
                return await thorClient.blocks.getBestBlockExpanded();
            });
            if (blockDetails != null) {
                const block = await thorClient.blocks.getBlockExpanded(blockDetails.number);
                (0, globals_1.expect)(block?.number).toBe(blockDetails.number);
            }
            (0, globals_1.expect)(blockDetails).not.toBeNull();
            (0, globals_1.expect)(blockDetails).toBeDefined();
        }, 15000);
        /**
         * getBestBlockRef test
         */
        (0, globals_1.test)('getBestBlockRef', async () => {
            const bestBlockRef = await (0, test_utils_1.retryOperation)(async () => {
                return await thorClient.blocks.getBestBlockRef();
            });
            (0, globals_1.expect)(bestBlockRef).not.toBeNull();
            (0, globals_1.expect)(bestBlockRef).toBeDefined();
        }, 15000);
        /**
         * getFinalBlockCompressed test
         */
        (0, globals_1.test)('getFinalBlockCompressed', async () => {
            const blockDetails = await (0, test_utils_1.retryOperation)(async () => {
                return await thorClient.blocks.getFinalBlockCompressed();
            });
            (0, globals_1.expect)(blockDetails).not.toBeNull();
            (0, globals_1.expect)(blockDetails).toBeDefined();
        }, 15000);
        /**
         * getFinalBlockExpanded test
         */
        (0, globals_1.test)('getFinalBlockExpanded', async () => {
            const blockDetails = await (0, test_utils_1.retryOperation)(async () => {
                return await thorClient.blocks.getFinalBlockExpanded();
            });
            (0, globals_1.expect)(blockDetails).not.toBeNull();
            (0, globals_1.expect)(blockDetails).toBeDefined();
        }, 15000);
        /**
         * getHeadBlock test
         */
        (0, globals_1.test)('getHeadBlock', async () => {
            const headBlockFirst = await src_1.Poll.SyncPoll(() => thorClient.blocks.getHeadBlock()).waitUntil((result) => {
                return result !== null;
            });
            (0, globals_1.expect)(headBlockFirst).toBeDefined();
            // Wait for the next block
            const headBlockSecond = await src_1.Poll.SyncPoll(() => thorClient.blocks.getHeadBlock()).waitUntil((result) => {
                return result !== headBlockFirst;
            });
            (0, globals_1.expect)(headBlockSecond).toBeDefined();
            (0, globals_1.expect)(headBlockFirst).not.toBe(headBlockSecond);
        }, 23000);
        /**
         * getGenesisBlock test
         */
        (0, globals_1.test)('getGenesisBlock', async () => {
            const blockDetails = await thorClient.blocks.getGenesisBlock();
            (0, globals_1.expect)(blockDetails).toBeDefined();
            (0, globals_1.expect)(blockDetails?.number).toBe(0);
            (0, globals_1.expect)(blockDetails?.id).toStrictEqual(sdk_core_1.networkInfo.testnet.genesisBlock.id);
        });
    });
});
