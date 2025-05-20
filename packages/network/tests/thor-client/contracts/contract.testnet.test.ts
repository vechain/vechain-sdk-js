import { beforeEach, describe, expect, test } from '@jest/globals';
import { TESTNET_URL, ThorClient } from '../../../src';

/**
 * Transactions module tests suite.
 *
 * @group integration/clients/thor-client/gas
 */
describe('ThorClient - Gas Module', () => {
    // ThorClient instance
    let thorClient: ThorClient;

    beforeEach(() => {
        thorClient = ThorClient.at(TESTNET_URL);
    });

    /**
     * Validates the base gas price of the Testnet.
     */
    test('Should return the base gas price of the Testnet', async () => {
        const baseGasPrice = await thorClient.contracts.getLegacyBaseGasPrice();
        const expected = {
            success: true,
            result: {
                plain: 10000000000000n,
                array: [10000000000000n]
            }
        };
        expect(baseGasPrice).toEqual(expected);
        expect(baseGasPrice).toEqual({
            ...expected,
            result: {
                plain: BigInt(10 ** 13),
                array: [BigInt(10 ** 13)]
            }
        }); // 10^13 wei
    });
});
