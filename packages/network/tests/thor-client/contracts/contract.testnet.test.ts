import { describe, expect, test } from '@jest/globals';
import { thorClient } from '../../fixture';

/**
 * Transcations module tests suite.
 *
 * @group integration/clients/thor-client/gas
 */
describe('Gas Module', () => {
    /**
     * Validates the base gas price of the Testnet.
     */
    test('Should return the base gas price of the Testnet', async () => {
        const baseGasPrice = await thorClient.contracts.getBaseGasPrice();
        expect(baseGasPrice).toEqual([10000000000000n]);
        expect(baseGasPrice).toEqual([BigInt(10 ** 13)]); // 10^13 wei
    });
});
