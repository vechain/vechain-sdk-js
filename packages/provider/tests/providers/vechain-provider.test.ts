import { describe, expect, test } from '@jest/globals';
import { VechainProvider } from '../../src';
import { zeroBlock } from '../rpc-mapper/blocks/fixture';
import { InvalidDataTypeError } from '@vechainfoundation/vechain-sdk-errors';
import { ThorClient } from '@vechainfoundation/vechain-sdk-network';
import { testNetwork } from '../fixture';

/**
 * Vechain provider tests
 *
 * @group integration/providers/vechain-provider
 */
describe('Vechain provider tests', () => {
    /**
     * Call RPC function tests
     */
    test('Should be able to call an RPC function', async () => {
        // Init provider
        const provider = new VechainProvider(new ThorClient(testNetwork));
        expect(provider).toBeDefined();

        // Call RPC function
        const rpcCallZeroBlock = await provider.request({
            method: 'eth_getBlockByNumber',
            params: [0]
        });
        expect(rpcCallZeroBlock).toStrictEqual(zeroBlock);
    });

    /**
     * Invalid RPC method tests
     */
    test('Should throw an error when calling an invalid RPC method', async () => {
        // Init provider
        const provider = new VechainProvider(new ThorClient(testNetwork));
        expect(provider).toBeDefined();

        // Call RPC function
        await expect(
            async () =>
                await provider.request({
                    method: 'INVALID_METHOD',
                    params: [-1]
                })
        ).rejects.toThrowError(InvalidDataTypeError);
    });
});
