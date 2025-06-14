import { describe, expect, test } from '@jest/globals';
import { TESTNET_URL, ThorClient } from '../../../src';
import { InvalidDataType } from '@vechain/sdk-errors';

/**
 * TransactionsModule.fillDefaultBodyOptions() unit tests.
 *
 * @group unit/clients/thor-client/transactions
 */
describe('fillDefaultBodyOptions() unit tests', () => {
    test('legacy tx <- gasPriceCoef is specified', async () => {
        const client = ThorClient.at(TESTNET_URL);
        const options = {
            gasPriceCoef: 1.5
        };
        const filledOptions =
            await client.transactions.fillDefaultBodyOptions(options);
        expect(filledOptions.gasPriceCoef).toEqual(1.5);
        expect(filledOptions.maxFeePerGas).toBeUndefined();
        expect(filledOptions.maxPriorityFeePerGas).toBeUndefined();
    });

    test('dynamic fee tx <- maxFeePerGas and maxPriorityFeePerGas are specified as number and fork happened', async () => {
        const client = ThorClient.at(TESTNET_URL);
        jest.spyOn(client.forkDetector, 'isGalacticaForked').mockResolvedValue(
            true
        );
        const options = {
            maxFeePerGas: 1000000000000000000,
            maxPriorityFeePerGas: 1000000000000000000
        };
        const filledOptions =
            await client.transactions.fillDefaultBodyOptions(options);
        expect(filledOptions.maxFeePerGas).toEqual(1000000000000000000);
        expect(filledOptions.maxPriorityFeePerGas).toEqual(1000000000000000000);
        expect(filledOptions.gasPriceCoef).toBeUndefined();
    });

    test('dynamic fee tx <- maxFeePerGas and maxPriorityFeePerGas are specified as hex string and fork happened', async () => {
        const client = ThorClient.at(TESTNET_URL);
        jest.spyOn(client.forkDetector, 'isGalacticaForked').mockResolvedValue(
            true
        );
        const options = {
            maxFeePerGas: '0x100',
            maxPriorityFeePerGas: '0x1'
        };
        const filledOptions =
            await client.transactions.fillDefaultBodyOptions(options);
        expect(filledOptions.maxFeePerGas).toEqual('0x100'); // stays the same
        expect(filledOptions.maxPriorityFeePerGas).toEqual('0x1'); // stays the same
        expect(filledOptions.gasPriceCoef).toBeUndefined();
    });

    test('exception <- maxFeePerGas and maxPriorityFeePerGas are specified and fork did not happen', async () => {
        const client = ThorClient.at(TESTNET_URL);
        jest.spyOn(client.forkDetector, 'isGalacticaForked').mockResolvedValue(
            false
        );
        const options = {
            maxFeePerGas: 1000000000000000000,
            maxPriorityFeePerGas: 1000000000000000000
        };
        await expect(
            client.transactions.fillDefaultBodyOptions(options)
        ).rejects.toThrow(InvalidDataType);
    });

    test('legacy tx <- all options are specified and fork did not happen', async () => {
        const client = ThorClient.at(TESTNET_URL);
        jest.spyOn(client.forkDetector, 'isGalacticaForked').mockResolvedValue(
            false
        );
        const options = {
            gasPriceCoef: 1.5,
            maxFeePerGas: 1000000000000000000,
            maxPriorityFeePerGas: 1000000000000000000
        };
        const filledOptions =
            await client.transactions.fillDefaultBodyOptions(options);
        expect(filledOptions.gasPriceCoef).toEqual(1.5);
        expect(filledOptions.maxFeePerGas).toBeUndefined();
        expect(filledOptions.maxPriorityFeePerGas).toBeUndefined();
    });

    test('legacy tx <- all options are specified and fork has happened', async () => {
        const client = ThorClient.at(TESTNET_URL);
        jest.spyOn(client.forkDetector, 'isGalacticaForked').mockResolvedValue(
            true
        );
        const options = {
            gasPriceCoef: 1.5,
            maxFeePerGas: 1000000000000000000,
            maxPriorityFeePerGas: 1000000000000000000
        };
        const filledOptions =
            await client.transactions.fillDefaultBodyOptions(options);
        expect(filledOptions.gasPriceCoef).toEqual(1.5);
        expect(filledOptions.maxFeePerGas).toBeUndefined();
        expect(filledOptions.maxPriorityFeePerGas).toBeUndefined();
    });

    test('dynamic fee tx <- only maxFeePerGas is specified and fork has happened', async () => {
        const client = ThorClient.at(TESTNET_URL);
        jest.spyOn(client.forkDetector, 'isGalacticaForked').mockResolvedValue(
            true
        );

        // Mock getFeeHistory to return a fee history with reward = 0x1
        jest.spyOn(client.gas, 'getFeeHistory').mockResolvedValue({
            oldestBlock: '0x1',
            baseFeePerGas: ['0x1', '0x2', '0x3'],
            gasUsedRatio: ['0.5', '0.6', '0.7'],
            reward: [
                ['0x0', '0x0', '0x1'],
                ['0x0', '0x0', '0x1'],
                ['0x0', '0x0', '0x1']
            ]
        });

        // Mock getMaxPriorityFeePerGas for fallback
        jest.spyOn(client.gas, 'getMaxPriorityFeePerGas').mockResolvedValue(
            '0x1'
        );

        jest.spyOn(
            client.blocks,
            'getBestBlockBaseFeePerGas'
        ).mockResolvedValue('0x99');

        const options = {
            maxFeePerGas: '0x10'
        };
        const filledOptions =
            await client.transactions.fillDefaultBodyOptions(options);
        expect(filledOptions.maxFeePerGas).toBe('0x10'); // stays the same
        expect(filledOptions.maxPriorityFeePerGas).toEqual('0x01'); // computed with leading zero
    });

    test('dynamic fee tx <- only maxPriorityFeePerGas is specified and fork has happened', async () => {
        const client = ThorClient.at(TESTNET_URL);
        jest.spyOn(client.forkDetector, 'isGalacticaForked').mockResolvedValue(
            true
        );

        // We don't need to mock getFeeHistory here because maxPriorityFeePerGas is already specified
        jest.spyOn(client.gas, 'getMaxPriorityFeePerGas').mockResolvedValue(
            '0x1'
        );

        jest.spyOn(
            client.blocks,
            'getBestBlockBaseFeePerGas'
        ).mockResolvedValue('0x30');

        const options = {
            maxPriorityFeePerGas: '0x20'
        };
        const filledOptions =
            await client.transactions.fillDefaultBodyOptions(options);
        expect(filledOptions.maxFeePerGas).toBe('0x50'); // computed
        expect(filledOptions.maxPriorityFeePerGas).toEqual('0x20'); // stays the same
    });
});

describe('buildTransactionBody() unit tests', () => {
    test('legacy tx <- gasPriceCoef is specified', async () => {
        // Vet transfer clause
        const clauses = [
            {
                to: '0x0000000000000000000000000000000000000000',
                value: 1,
                data: '0x'
            }
        ];
        const client = ThorClient.at(TESTNET_URL);
        const options = {
            gasPriceCoef: 1.5
        };
        const txBody = await client.transactions.buildTransactionBody(
            clauses,
            1000,
            options
        );
        expect(txBody.gasPriceCoef).toEqual(1.5);
        expect(txBody.maxFeePerGas).toBeUndefined();
        expect(txBody.maxPriorityFeePerGas).toBeUndefined();
    });
    test('dynamic fee tx <- maxFeePerGas and maxPriorityFeePerGas are specified', async () => {
        // Vet transfer clause
        const clauses = [
            {
                to: '0x0000000000000000000000000000000000000000',
                value: 1,
                data: '0x'
            }
        ];
        const client = ThorClient.at(TESTNET_URL);
        jest.spyOn(client.forkDetector, 'isGalacticaForked').mockResolvedValue(
            true
        );
        const options = {
            maxFeePerGas: 1000000000000000000,
            maxPriorityFeePerGas: 10000
        };
        const txBody = await client.transactions.buildTransactionBody(
            clauses,
            1000,
            options
        );
        expect(txBody.maxFeePerGas).toBe(1000000000000000000);
        expect(txBody.maxPriorityFeePerGas).toBe(10000);
    });
    test('dynamic fee tx <- only maxFeePerGas is specified', async () => {
        // Vet transfer clause
        const clauses = [
            {
                to: '0x0000000000000000000000000000000000000000',
                value: 1,
                data: '0x'
            }
        ];
        const client = ThorClient.at(TESTNET_URL);
        jest.spyOn(client.forkDetector, 'isGalacticaForked').mockResolvedValue(
            true
        );

        // Mock getFeeHistory to return a fee history with reward = 0x1
        jest.spyOn(client.gas, 'getFeeHistory').mockResolvedValue({
            oldestBlock: '0x1',
            baseFeePerGas: ['0x1', '0x2', '0x3'],
            gasUsedRatio: ['0.5', '0.6', '0.7'],
            reward: [
                ['0x0', '0x0', '0x1'],
                ['0x0', '0x0', '0x1'],
                ['0x0', '0x0', '0x1']
            ]
        });

        // Mock getMaxPriorityFeePerGas for fallback
        jest.spyOn(client.gas, 'getMaxPriorityFeePerGas').mockResolvedValue(
            '0x1'
        );

        // Mock getBestBlockBaseFeePerGas to ensure the 75th percentile (0x1) is lower than 4.6% of base fee
        jest.spyOn(
            client.blocks,
            'getBestBlockBaseFeePerGas'
        ).mockResolvedValue('0x99');

        const options = {
            maxFeePerGas: 1000000000000000000
        };
        const txBody = await client.transactions.buildTransactionBody(
            clauses,
            1000,
            options
        );
        expect(txBody.maxFeePerGas).toBe(1000000000000000000);
        expect(txBody.maxPriorityFeePerGas).toBe('0x01'); // with leading zero
    });
});
