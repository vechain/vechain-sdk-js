"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../src");
/**
 * Transactions module tests suite.
 *
 * @group integration/clients/thor-client/gas
 */
(0, globals_1.describe)('ThorClient - Gas Module', () => {
    // ThorClient instance
    let thorClient;
    (0, globals_1.beforeEach)(() => {
        thorClient = src_1.ThorClient.at(src_1.TESTNET_URL);
    });
    /**
     * Validates the base gas price of the Testnet.
     */
    (0, globals_1.test)('Should return the base gas price of the Testnet', async () => {
        const baseGasPrice = await thorClient.contracts.getLegacyBaseGasPrice();
        const expected = {
            success: true,
            result: {
                plain: 10000000000000n,
                array: [10000000000000n]
            }
        };
        (0, globals_1.expect)(baseGasPrice).toEqual(expected);
        (0, globals_1.expect)(baseGasPrice).toEqual({
            ...expected,
            result: {
                plain: BigInt(10 ** 13),
                array: [BigInt(10 ** 13)]
            }
        }); // 10^13 wei
    });
});
