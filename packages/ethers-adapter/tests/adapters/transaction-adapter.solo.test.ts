import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import {
    HardhatVeChainProvider,
    ProviderInternalBaseWallet,
    THOR_SOLO_URL
} from '@vechain/sdk-network';
import type { TransactionRequest } from 'ethers';
import { adaptTransaction } from '../../src/adapters/transaction-adapter';

describe('Transaction adapter tests', () => {
    let provider: HardhatVeChainProvider;

    beforeEach(() => {
        provider = new HardhatVeChainProvider(
            new ProviderInternalBaseWallet([]),
            THOR_SOLO_URL,
            (message: string, parent?: Error) => new Error(message, parent)
        );

        // Mock the fork detector and gas-related methods
        jest.spyOn(
            provider.thorClient.forkDetector,
            'isGalacticaForked'
        ).mockImplementation(async () => await Promise.resolve(false));
        jest.spyOn(
            provider.thorClient.blocks,
            'getBestBlockBaseFeePerGas'
        ).mockImplementation(async () => await Promise.resolve('100'));
        jest.spyOn(
            provider.thorClient.gas,
            'getMaxPriorityFeePerGas'
        ).mockImplementation(async () => await Promise.resolve('50'));
    });

    test('Should use gasPriceCoef for pre-Galactica transactions', async () => {
        jest.spyOn(
            provider.thorClient.forkDetector,
            'isGalacticaForked'
        ).mockResolvedValueOnce(false);

        const tx: TransactionRequest = {
            to: '0x123',
            gasPrice: 100
        };

        const adaptedTx = await adaptTransaction(tx, provider);

        expect(adaptedTx).toEqual({
            to: '0x123',
            gasPriceCoef: 100,
            gasPrice: undefined
        });
    });

    test('Should use default gasPriceCoef 0 for pre-Galactica transactions without gasPrice', async () => {
        jest.spyOn(
            provider.thorClient.forkDetector,
            'isGalacticaForked'
        ).mockResolvedValueOnce(false);

        const tx: TransactionRequest = {
            to: '0x123'
        };

        const adaptedTx = await adaptTransaction(tx, provider);

        expect(adaptedTx).toEqual({
            to: '0x123',
            gasPriceCoef: 0
        });
    });

    test('Should reject dynamic fee transaction before Galactica fork', async () => {
        jest.spyOn(
            provider.thorClient.forkDetector,
            'isGalacticaForked'
        ).mockResolvedValueOnce(false);

        const tx: TransactionRequest = {
            to: '0x123',
            maxFeePerGas: 200n,
            maxPriorityFeePerGas: 100n
        };

        await expect(adaptTransaction(tx, provider)).rejects.toThrow(
            'Dynamic fee transaction (maxFeePerGas/maxPriorityFeePerGas) is not allowed before Galactica fork'
        );
    });

    test('Should calculate dynamic fees for post-Galactica transactions', async () => {
        jest.spyOn(
            provider.thorClient.forkDetector,
            'isGalacticaForked'
        ).mockResolvedValueOnce(true);
        jest.spyOn(
            provider.thorClient.blocks,
            'getBestBlockBaseFeePerGas'
        ).mockResolvedValueOnce('100');
        jest.spyOn(
            provider.thorClient.gas,
            'getMaxPriorityFeePerGas'
        ).mockResolvedValueOnce('50');

        const tx: TransactionRequest = {
            to: '0x123'
        };

        const adaptedTx = await adaptTransaction(tx, provider);

        expect(adaptedTx).toEqual({
            to: '0x123',
            maxFeePerGas: 150n, // baseFee (100) + maxPriorityFeePerGas (50)
            maxPriorityFeePerGas: 50n,
            gasPriceCoef: undefined
        });
    });

    test('Should use provided dynamic fees for post-Galactica transactions', async () => {
        jest.spyOn(
            provider.thorClient.forkDetector,
            'isGalacticaForked'
        ).mockResolvedValueOnce(true);

        const tx: TransactionRequest = {
            to: '0x123',
            maxFeePerGas: 200n,
            maxPriorityFeePerGas: 100n
        };

        const adaptedTx = await adaptTransaction(tx, provider);

        expect(adaptedTx).toEqual({
            to: '0x123',
            maxFeePerGas: 200n,
            maxPriorityFeePerGas: 100n,
            gasPriceCoef: undefined,
            gasPrice: undefined
        });
    });

    test('Should reject incomplete dynamic fee settings', async () => {
        jest.spyOn(
            provider.thorClient.forkDetector,
            'isGalacticaForked'
        ).mockResolvedValueOnce(true);

        const tx: TransactionRequest = {
            to: '0x123',
            maxFeePerGas: 200n // Missing maxPriorityFeePerGas
        };

        await expect(adaptTransaction(tx, provider)).rejects.toThrow(
            'Both maxFeePerGas and maxPriorityFeePerGas must be set for dynamic fee transactions'
        );
    });

    test('Should handle missing base fee gracefully', async () => {
        jest.spyOn(
            provider.thorClient.forkDetector,
            'isGalacticaForked'
        ).mockResolvedValueOnce(true);
        jest.spyOn(
            provider.thorClient.blocks,
            'getBestBlockBaseFeePerGas'
        ).mockResolvedValueOnce(null);

        const tx: TransactionRequest = {
            to: '0x123'
        };

        await expect(adaptTransaction(tx, provider)).rejects.toThrow(
            'Unable to get best block base fee per gas'
        );
    });
});
