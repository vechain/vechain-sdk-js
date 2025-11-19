"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../src");
const http_1 = require("../../../src/http");
const test_utils_1 = require("../../test-utils");
/**
 * Blocks module tests with mocks.
 *
 * @group integration/clients/thor-client/blocks
 */
(0, globals_1.describe)('ThorClient - Blocks Module mock tests', () => {
    (0, globals_1.test)('getBlockCompressed should return null if null is returned from the api', async () => {
        const thorSoloClient = src_1.ThorClient.at(src_1.THOR_SOLO_URL);
        // Mock the getBlockCompressed method to return null
        globals_1.jest.spyOn(http_1.SimpleHttpClient.prototype, 'http').mockResolvedValueOnce(null);
        await (0, globals_1.expect)(thorSoloClient.blocks.getBlockCompressed('best')).resolves.toBeNull();
    });
    (0, globals_1.test)('getBlockExpanded should return null if null is returned from the api', async () => {
        const thorSoloClient = src_1.ThorClient.at(src_1.THOR_SOLO_URL);
        // Mock the getBlockExpanded method to return null
        globals_1.jest.spyOn(http_1.SimpleHttpClient.prototype, 'http').mockResolvedValueOnce(null);
        await (0, globals_1.expect)(thorSoloClient.blocks.getBlockExpanded('best')).resolves.toBeNull();
    });
    (0, globals_1.test)('getBlockCompressed', async () => {
        const thorSoloClient = src_1.ThorClient.at(src_1.THOR_SOLO_URL);
        const block = await (0, test_utils_1.retryOperation)(async () => {
            return await thorSoloClient.blocks.getBlockCompressed('best');
        });
        (0, globals_1.expect)(block).toBeDefined();
    }, 15000);
});
