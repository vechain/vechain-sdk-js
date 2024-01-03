import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { testNetwork } from '../../fixture';
import { ThorClient } from '../../../src';

/**
 * Transcations module tests suite.
 *
 * @group integration/clients/thor-client/gas
 */
describe('ThorClient - Gas Module', () => {
    // ThorClient instance
    let thorClient: ThorClient;

    beforeEach(() => {
        thorClient = new ThorClient(testNetwork);
    });

    afterEach(() => {
        thorClient.destroy();
    });
    /**
     * Validates the base gas price of the Testnet.
     */
    test('Should return the base gas price of the Testnet', async () => {
        const baseGasPrice = await thorClient.contracts.getBaseGasPrice();
        expect(baseGasPrice).toBe(
            '0x000000000000000000000000000000000000000000000000000009184e72a000'
        );
        expect(Number(baseGasPrice)).toBe(10 ** 13); // 10^13 wei
    }, 3000);
});
