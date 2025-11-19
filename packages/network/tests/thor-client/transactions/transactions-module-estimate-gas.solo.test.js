"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../src");
const sdk_core_1 = require("@vechain/sdk-core");
/**
 * Tests for the executeCall method in transactions module
 *
 *  @group integration/clients/thor-client/transactions
 */
(0, globals_1.describe)('ThorClient - Transactions Module Execute Call', () => {
    let thorSoloClient;
    beforeAll(() => {
        thorSoloClient = src_1.ThorClient.at(src_1.THOR_SOLO_URL);
    });
    (0, globals_1.test)('ok <- Can estimate gas with ContractClause from transferVTHOToken', async () => {
        const vthoTransferClauses = [
            sdk_core_1.Clause.transferVTHOToken(sdk_core_1.Address.of(sdk_core_1.ZERO_ADDRESS), sdk_core_1.VTHO.of(100, sdk_core_1.Units.wei)),
            sdk_core_1.Clause.transferVTHOToken(sdk_core_1.Address.of(sdk_core_1.ZERO_ADDRESS), sdk_core_1.VTHO.of(200, sdk_core_1.Units.wei))
        ];
        const gas = await thorSoloClient.transactions.estimateGas(vthoTransferClauses);
        (0, globals_1.expect)(gas.totalGas).toBeGreaterThan(0);
    });
});
