import { afterEach, beforeEach, describe, expect } from '@jest/globals';
import { SimpleHttpClient, THOR_SOLO_URL, ThorClient } from '../../../src';
import { HexUInt } from '@vechain/sdk-core';

/**
 * Blocks Module integration tests
 *
 * @group integration/clients/thor-client/blocks
 */
describe('ThorClient - Blocks Module tests', () => {
    let thorClient: ThorClient;

    beforeEach(() => {
        thorClient = new ThorClient(new SimpleHttpClient(THOR_SOLO_URL), {
            isPollingEnabled: true
        });
    });

    afterEach(() => {
        thorClient.destroy();
    });

    describe('GALACTICA - baseFeePerGas', () => {
        test('OK <- getBlockCompressed(1)', async () => {
            const block = await thorClient.blocks.getBlockCompressed(1); // Block 1 has transactions.
            expect(block).toBeDefined();
            expect(block?.baseFeePerGas).not.toBeNull();
            expect(
                HexUInt.isValid0x(block?.baseFeePerGas as string)
            ).toBeTruthy();
            expect(
                HexUInt.of(block?.baseFeePerGas as string).bi
            ).toBeGreaterThan(0n);
        });

        test('OK <- getBlockExpanded(1)', async () => {
            const block = await thorClient.blocks.getBlockExpanded(1); // Block 1 has transactions.
            expect(block).toBeDefined();
            expect(block?.baseFeePerGas).not.toBeNull();
            expect(
                HexUInt.isValid0x(block?.baseFeePerGas as string)
            ).toBeTruthy();
            expect(
                HexUInt.of(block?.baseFeePerGas as string).bi
            ).toBeGreaterThan(0n);
        });
    });
});
