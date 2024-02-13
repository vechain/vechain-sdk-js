import { beforeEach, describe, expect, test } from '@jest/globals';
import { testNetwork } from '../../fixture';
import { ThorClient } from '../../../src';

/**
 * Transactions module tests suite.
 *
 * @group integration/clients/thor-client/gas
 */
describe('ThorClient - Gas Module', () => {
    // ThorClient instance
    let thorClient: ThorClient;

    beforeEach(() => {
        thorClient = new ThorClient(testNetwork);
    });

    /**
     * Validates the base gas price of the Testnet.
     */
    test('Should return the base gas price of the Testnet', async () => {
        const baseGasPrice = await thorClient.contracts.getBaseGasPrice();
        expect(baseGasPrice).toEqual([10000000000000n]);
        expect(baseGasPrice).toEqual([BigInt(10 ** 13)]); // 10^13 wei
    });
});
