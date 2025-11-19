"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const fixture_1 = require("./fixture");
const src_1 = require("../../../../../src");
/**
 * Unit test for ProviderInternalHDWallet class.
 *
 * @group unit/provider/helpers/provider-internal-hd-wallet
 */
(0, globals_1.describe)('ProviderInternalHDWallet wallet tests', () => {
    /**
     * Test the creation of the hd wallet
     */
    (0, globals_1.describe)('Test wallet creation', () => {
        /**
         * Test without blocking execution on steps
         */
        fixture_1.hdNodeFixtures.forEach((hdNodeFixture) => {
            /**
             * Test wallet creation and execution of wallet functions
             */
            (0, globals_1.test)('Should be able to create a wallet and execute functions', async () => {
                const hdWallet = new src_1.ProviderInternalHDWallet(hdNodeFixture.mnemonic.split(' '), hdNodeFixture.count, hdNodeFixture.initialIndex, hdNodeFixture.path, { gasPayer: hdNodeFixture.gasPayer });
                const addresses = await hdWallet.getAddresses();
                const gasPayer = await hdWallet.getGasPayer();
                (0, globals_1.expect)(addresses).toEqual(hdNodeFixture.expectedAddress);
                (0, globals_1.expect)(gasPayer).toEqual((0, src_1.DelegationHandler)(gasPayer).gasPayerOrNull());
            });
        });
    });
});
