import { describe, expect, test } from '@jest/globals';
import { thorClient } from '../../../fixture';

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
        expect(baseGasPrice).toBe(
            '0x000000000000000000000000000000000000000000000000000009184e72a000'
        );
        expect(Number(baseGasPrice)).toBe(10 ** 13); // 10^13 wei
    });
});
