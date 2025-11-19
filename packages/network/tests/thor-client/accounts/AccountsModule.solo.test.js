"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../src");
const sdk_core_1 = require("@vechain/sdk-core");
const fixture_1 = require("../../fixture");
const test_utils_1 = require("../../test-utils");
const CONTRACT_ADDRESS = fixture_1.configData.TESTING_CONTRACT_ADDRESS;
/**
 * Prolong timeout due to block time which sometimes exceeds jest's default timeout of 5 seconds.
 */
const TIMEOUT = 20000;
/**
 * Test AccountsModule class.
 *
 * @group integration/network/thor-client
 */
(0, globals_1.describe)('AccountsModule solo tests', () => {
    const thorClient = src_1.ThorClient.at(src_1.THOR_SOLO_URL);
    (0, globals_1.test)('ok <- contract address', async () => {
        const expected = sdk_core_1.Hex.of(fixture_1.configData.TESTING_CONTRACT_BYTECODE);
        const actual = await (0, test_utils_1.retryOperation)(async () => {
            return await thorClient.accounts.getBytecode(sdk_core_1.Address.of(CONTRACT_ADDRESS));
        });
        (0, globals_1.expect)(actual).toEqual(expected);
    }, TIMEOUT);
});
