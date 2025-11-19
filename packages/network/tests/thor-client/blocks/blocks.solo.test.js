"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../src");
const sdk_core_1 = require("@vechain/sdk-core");
const test_utils_1 = require("../../test-utils");
/**
 * Blocks Module integration tests
 *
 * @group galactica/integration/clients/thor-client/blocks
 */
(0, globals_1.describe)('ThorClient - Blocks Module tests', () => {
    let thorClient;
    (0, globals_1.beforeEach)(() => {
        thorClient = new src_1.ThorClient(new src_1.SimpleHttpClient(src_1.THOR_SOLO_URL), {
            isPollingEnabled: true
        });
    });
    (0, globals_1.afterEach)(() => {
        thorClient.destroy();
    });
    (0, globals_1.describe)('GALACTICA - baseFeePerGas', () => {
        test('OK <- getBlockCompressed(1)', async () => {
            const block = await thorClient.blocks.getBlockCompressed(1); // Block 1 has transactions.
            (0, globals_1.expect)(block).toBeDefined();
            (0, globals_1.expect)(block?.baseFeePerGas).not.toBeNull();
            (0, globals_1.expect)(sdk_core_1.HexUInt.isValid0x(block?.baseFeePerGas)).toBeTruthy();
            (0, globals_1.expect)(sdk_core_1.HexUInt.of(block?.baseFeePerGas).bi).toBeGreaterThan(0n);
        });
        test('OK <- getBlockExpanded(1)', async () => {
            const block = await thorClient.blocks.getBlockExpanded(1); // Block 1 has transactions.
            (0, globals_1.expect)(block).toBeDefined();
            (0, globals_1.expect)(block?.baseFeePerGas).not.toBeNull();
            (0, globals_1.expect)(sdk_core_1.HexUInt.isValid0x(block?.baseFeePerGas)).toBeTruthy();
            (0, globals_1.expect)(sdk_core_1.HexUInt.of(block?.baseFeePerGas).bi).toBeGreaterThan(0n);
        });
        test('getBestBlockCompressed', async () => {
            const blockDetails = await (0, test_utils_1.retryOperation)(async () => {
                return await thorClient.blocks.getBestBlockCompressed();
            });
            (0, globals_1.expect)(blockDetails).toBeDefined();
        }, 15000);
    });
});
