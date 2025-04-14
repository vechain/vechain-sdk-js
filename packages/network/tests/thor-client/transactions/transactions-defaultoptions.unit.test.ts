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
        expect(filledOptions.maxFeePerGas).toEqual('0x100');
        expect(filledOptions.maxPriorityFeePerGas).toEqual('0x1');
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
        jest.spyOn(client.gas, 'getMaxPriorityFeePerGas').mockResolvedValue(
            '0x1'
        );
        jest.spyOn(
            client.blocks,
            'getBestBlockBaseFeePerGas'
        ).mockResolvedValue('0x99');
        const options = {
            maxFeePerGas: 1000000000000000000
        };
        const filledOptions =
            await client.transactions.fillDefaultBodyOptions(options);
        expect(filledOptions.maxFeePerGas).toBe('0x9a');
        expect(filledOptions.maxPriorityFeePerGas).toEqual('0x1');
    });
});
