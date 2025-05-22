import { describe, expect, test, beforeEach } from '@jest/globals';
import { TESTNET_URL, ThorClient } from '../../../src';
import { InvalidDataType } from '@vechain/sdk-errors';

/**
 * TransactionsModule unit tests
 *
 * @group unit/clients/thor-client/transactions
 */
describe('TransactionsModule', () => {
    let client: ThorClient;

    beforeEach(() => {
        client = ThorClient.at(TESTNET_URL);
    });

    describe('fillDefaultBodyOptions', () => {
        test('fills default values for EIP-1559 transaction after fork', async () => {
            // Mock fork detection
            jest.spyOn(
                client.forkDetector,
                'isGalacticaForked'
            ).mockResolvedValue(true);

            // Mock base fee endpoint
            jest.spyOn(
                client.blocks,
                'getBestBlockBaseFeePerGas'
            ).mockResolvedValue('0x30');

            // Mock max priority fee endpoint
            jest.spyOn(client.gas, 'getMaxPriorityFeePerGas').mockResolvedValue(
                '0x1'
            );

            const options = {};
            const filledOptions =
                await client.transactions.fillDefaultBodyOptions(options);

            expect(filledOptions.maxFeePerGas).toBe('0x31'); // base fee (0x30) + priority fee (0x1)
            expect(filledOptions.maxPriorityFeePerGas).toBe('0x1');
            expect(filledOptions.gasPriceCoef).toBeUndefined();
        });

        test('fills default values for legacy transaction before fork', async () => {
            // Mock fork detection
            jest.spyOn(
                client.forkDetector,
                'isGalacticaForked'
            ).mockResolvedValue(false);

            const options = {};
            const filledOptions =
                await client.transactions.fillDefaultBodyOptions(options);

            expect(filledOptions.gasPriceCoef).toBe(0);
            expect(filledOptions.maxFeePerGas).toBeUndefined();
            expect(filledOptions.maxPriorityFeePerGas).toBeUndefined();
        });

        test('throws when trying to use EIP-1559 before fork', async () => {
            // Mock fork detection
            jest.spyOn(
                client.forkDetector,
                'isGalacticaForked'
            ).mockResolvedValue(false);

            const options = {
                maxFeePerGas: '0x100',
                maxPriorityFeePerGas: '0x1'
            };

            await expect(
                client.transactions.fillDefaultBodyOptions(options)
            ).rejects.toThrow(InvalidDataType);
        });

        test('throws when mixing legacy and EIP-1559 fee parameters', async () => {
            const options = {
                gasPriceCoef: 128,
                maxFeePerGas: '0x100',
                maxPriorityFeePerGas: '0x1'
            };

            await expect(
                client.transactions.fillDefaultBodyOptions(options)
            ).rejects.toThrow(InvalidDataType);
        });
    });
});
