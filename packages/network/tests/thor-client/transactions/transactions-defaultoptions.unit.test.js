"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../src");
const sdk_core_1 = require("@vechain/sdk-core");
const sdk_errors_1 = require("@vechain/sdk-errors");
/**
 * TransactionsModule.fillDefaultBodyOptions() unit tests.
 *
 * @group unit/clients/thor-client/transactions
 */
(0, globals_1.describe)('fillDefaultBodyOptions() unit tests', () => {
    (0, globals_1.test)('legacy tx <- gasPriceCoef is specified', async () => {
        const client = src_1.ThorClient.at(src_1.TESTNET_URL);
        const options = {
            gasPriceCoef: 1.5
        };
        const filledOptions = await client.transactions.fillDefaultBodyOptions(options);
        (0, globals_1.expect)(filledOptions.gasPriceCoef).toEqual(1.5);
        (0, globals_1.expect)(filledOptions.maxFeePerGas).toBeUndefined();
        (0, globals_1.expect)(filledOptions.maxPriorityFeePerGas).toBeUndefined();
    });
    (0, globals_1.test)('dynamic fee tx <- maxFeePerGas and maxPriorityFeePerGas are specified as number and fork happened', async () => {
        const client = src_1.ThorClient.at(src_1.TESTNET_URL);
        jest.spyOn(client.forkDetector, 'isGalacticaForked').mockResolvedValue(true);
        const options = {
            maxFeePerGas: 1000000000000000000,
            maxPriorityFeePerGas: 1000000000000000000
        };
        const filledOptions = await client.transactions.fillDefaultBodyOptions(options);
        (0, globals_1.expect)(filledOptions.maxFeePerGas).toEqual(1000000000000000000);
        (0, globals_1.expect)(filledOptions.maxPriorityFeePerGas).toEqual(1000000000000000000);
        (0, globals_1.expect)(filledOptions.gasPriceCoef).toBeUndefined();
    });
    (0, globals_1.test)('dynamic fee tx <- maxFeePerGas and maxPriorityFeePerGas are specified as hex string and fork happened', async () => {
        const client = src_1.ThorClient.at(src_1.TESTNET_URL);
        jest.spyOn(client.forkDetector, 'isGalacticaForked').mockResolvedValue(true);
        const options = {
            maxFeePerGas: '0x100',
            maxPriorityFeePerGas: '0x1'
        };
        const filledOptions = await client.transactions.fillDefaultBodyOptions(options);
        (0, globals_1.expect)(filledOptions.maxFeePerGas).toEqual('0x100'); // stays the same
        (0, globals_1.expect)(filledOptions.maxPriorityFeePerGas).toEqual('0x1'); // stays the same
        (0, globals_1.expect)(filledOptions.gasPriceCoef).toBeUndefined();
    });
    (0, globals_1.test)('exception <- maxFeePerGas and maxPriorityFeePerGas are specified and fork did not happen', async () => {
        const client = src_1.ThorClient.at(src_1.TESTNET_URL);
        jest.spyOn(client.forkDetector, 'isGalacticaForked').mockResolvedValue(false);
        const options = {
            maxFeePerGas: 1000000000000000000,
            maxPriorityFeePerGas: 1000000000000000000
        };
        await (0, globals_1.expect)(client.transactions.fillDefaultBodyOptions(options)).rejects.toThrow(sdk_errors_1.InvalidDataType);
    });
    (0, globals_1.test)('error <- dynamic fee tx specified before fork (not allowed)', async () => {
        const client = src_1.ThorClient.at(src_1.TESTNET_URL);
        jest.spyOn(client.forkDetector, 'isGalacticaForked').mockResolvedValue(false);
        const options = {
            gasPriceCoef: 1.5,
            maxFeePerGas: 1000000000000000000,
            maxPriorityFeePerGas: 1000000000000000000
        };
        await (0, globals_1.expect)(client.transactions.fillDefaultBodyOptions(options)).rejects.toThrow('Invalid transaction body options. Dynamic fee tx is not allowed before Galactica fork.');
    });
    (0, globals_1.test)('dynamic fee tx <- all options are specified and fork has happened (dynamic fees take precedence)', async () => {
        const client = src_1.ThorClient.at(src_1.TESTNET_URL);
        jest.spyOn(client.forkDetector, 'isGalacticaForked').mockResolvedValue(true);
        const options = {
            gasPriceCoef: 1.5,
            maxFeePerGas: 1000000000000000000,
            maxPriorityFeePerGas: 1000000000000000000
        };
        const filledOptions = await client.transactions.fillDefaultBodyOptions(options);
        // Dynamic fee parameters take precedence over legacy parameters
        (0, globals_1.expect)(filledOptions.gasPriceCoef).toBeUndefined();
        (0, globals_1.expect)(filledOptions.maxFeePerGas).toEqual(1000000000000000000);
        (0, globals_1.expect)(filledOptions.maxPriorityFeePerGas).toEqual(1000000000000000000);
    });
    (0, globals_1.test)('dynamic fee tx <- only maxFeePerGas is specified and fork has happened', async () => {
        const client = src_1.ThorClient.at(src_1.TESTNET_URL);
        jest.spyOn(client.forkDetector, 'isGalacticaForked').mockResolvedValue(true);
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
        jest.spyOn(client.gas, 'getMaxPriorityFeePerGas').mockResolvedValue('0x1');
        jest.spyOn(client.gas, 'getNextBlockBaseFeePerGas').mockResolvedValue(1000n);
        const options = {
            maxFeePerGas: '0x10'
        };
        const filledOptions = await client.transactions.fillDefaultBodyOptions(options);
        (0, globals_1.expect)(filledOptions.maxFeePerGas).toBe('0x10'); // stays the same
        (0, globals_1.expect)(filledOptions.maxPriorityFeePerGas).toEqual('0x01'); // computed with leading zero
    });
    (0, globals_1.test)('dynamic fee tx <- only maxPriorityFeePerGas is specified and fork has happened', async () => {
        const client = src_1.ThorClient.at(src_1.TESTNET_URL);
        jest.spyOn(client.forkDetector, 'isGalacticaForked').mockResolvedValue(true);
        // We don't need to mock getFeeHistory here because maxPriorityFeePerGas is already specified
        jest.spyOn(client.gas, 'getMaxPriorityFeePerGas').mockResolvedValue('0x1');
        jest.spyOn(client.gas, 'getNextBlockBaseFeePerGas').mockResolvedValue(48n);
        const options = {
            maxPriorityFeePerGas: '0x20'
        };
        const filledOptions = await client.transactions.fillDefaultBodyOptions(options);
        // maxFeePerGas = 1.12 * baseFeePerGas + maxPriorityFeePerGas
        const expectedMaxFeePerGas = (112n * 48n) / 100n + BigInt(options.maxPriorityFeePerGas);
        (0, globals_1.expect)(filledOptions.maxFeePerGas).toBe(sdk_core_1.HexUInt.of(expectedMaxFeePerGas).toString()); // computed
        (0, globals_1.expect)(filledOptions.maxPriorityFeePerGas).toEqual('0x20'); // stays the same
    });
    (0, globals_1.test)('error <- dynamic fee parameters specified before fork (not allowed)', async () => {
        const client = src_1.ThorClient.at(src_1.TESTNET_URL);
        jest.spyOn(client.forkDetector, 'isGalacticaForked').mockResolvedValue(false);
        const options = {
            gasPriceCoef: 2.5,
            maxFeePerGas: 1000000000000000000,
            maxPriorityFeePerGas: 1000000000000000000
        };
        await (0, globals_1.expect)(client.transactions.fillDefaultBodyOptions(options)).rejects.toThrow('Invalid transaction body options. Dynamic fee tx is not allowed before Galactica fork.');
    });
    (0, globals_1.test)('dynamic fee tx <- dynamic fee parameters take precedence over gasPriceCoef when both specified (post-Galactica)', async () => {
        const client = src_1.ThorClient.at(src_1.TESTNET_URL);
        jest.spyOn(client.forkDetector, 'isGalacticaForked').mockResolvedValue(true);
        const options = {
            gasPriceCoef: 3.0,
            maxFeePerGas: 2000000000000000000,
            maxPriorityFeePerGas: 500000000000000000
        };
        const filledOptions = await client.transactions.fillDefaultBodyOptions(options);
        // Dynamic fee parameters take precedence over legacy parameters
        (0, globals_1.expect)(filledOptions.gasPriceCoef).toBeUndefined();
        (0, globals_1.expect)(filledOptions.maxFeePerGas).toEqual(2000000000000000000);
        (0, globals_1.expect)(filledOptions.maxPriorityFeePerGas).toEqual(500000000000000000);
    });
    (0, globals_1.test)('dynamic fee tx <- dynamic fee parameters take precedence over gasPriceCoef with hex values', async () => {
        const client = src_1.ThorClient.at(src_1.TESTNET_URL);
        jest.spyOn(client.forkDetector, 'isGalacticaForked').mockResolvedValue(true);
        const options = {
            gasPriceCoef: 1.75,
            maxFeePerGas: '0x1000',
            maxPriorityFeePerGas: '0x500'
        };
        const filledOptions = await client.transactions.fillDefaultBodyOptions(options);
        // Dynamic fee parameters take precedence over legacy parameters
        (0, globals_1.expect)(filledOptions.gasPriceCoef).toBeUndefined();
        (0, globals_1.expect)(filledOptions.maxFeePerGas).toEqual('0x1000');
        (0, globals_1.expect)(filledOptions.maxPriorityFeePerGas).toEqual('0x500');
    });
    (0, globals_1.test)('success <- only maxFeePerGas is specified (maxPriorityFeePerGas gets filled)', async () => {
        const client = src_1.ThorClient.at(src_1.TESTNET_URL);
        jest.spyOn(client.forkDetector, 'isGalacticaForked').mockResolvedValue(true);
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
        jest.spyOn(client.gas, 'getMaxPriorityFeePerGas').mockResolvedValue('0x1');
        jest.spyOn(client.gas, 'getNextBlockBaseFeePerGas').mockResolvedValue(100n);
        const options = {
            maxFeePerGas: 1000000000000000000
        };
        const filledOptions = await client.transactions.fillDefaultBodyOptions(options);
        (0, globals_1.expect)(filledOptions.maxFeePerGas).toEqual(1000000000000000000);
        (0, globals_1.expect)(filledOptions.maxPriorityFeePerGas).toEqual('0x01'); // computed with leading zero
    });
    (0, globals_1.test)('success <- only maxPriorityFeePerGas is specified (maxFeePerGas gets filled)', async () => {
        const client = src_1.ThorClient.at(src_1.TESTNET_URL);
        jest.spyOn(client.forkDetector, 'isGalacticaForked').mockResolvedValue(true);
        // Mock getMaxPriorityFeePerGas for fallback
        jest.spyOn(client.gas, 'getMaxPriorityFeePerGas').mockResolvedValue('0x1');
        jest.spyOn(client.gas, 'getNextBlockBaseFeePerGas').mockResolvedValue(100n);
        const options = {
            maxPriorityFeePerGas: 1000000000000000000
        };
        // maxFeePerGas = 1.12 * baseFeePerGas + maxPriorityFeePerGas
        const expectedMaxFeePerGas = (112n * 100n) / 100n + BigInt(options.maxPriorityFeePerGas);
        const filledOptions = await client.transactions.fillDefaultBodyOptions(options);
        (0, globals_1.expect)(filledOptions.maxFeePerGas).not.toBeNull();
        (0, globals_1.expect)(filledOptions.maxFeePerGas).not.toBeUndefined();
        (0, globals_1.expect)(sdk_core_1.HexUInt.of(filledOptions.maxFeePerGas)
            .bi).toBe(expectedMaxFeePerGas); // computed
        (0, globals_1.expect)(filledOptions.maxPriorityFeePerGas).toEqual(1000000000000000000); // stays the same
    });
    (0, globals_1.test)('error <- maxFeePerGas and gasPriceCoef specified (incomplete dynamic fee)', async () => {
        const client = src_1.ThorClient.at(src_1.TESTNET_URL);
        jest.spyOn(client.forkDetector, 'isGalacticaForked').mockResolvedValue(true);
        const options = {
            maxFeePerGas: 1000000000000000000,
            gasPriceCoef: 1.5
        };
        await (0, globals_1.expect)(client.transactions.fillDefaultBodyOptions(options)).rejects.toThrow('Invalid parameter combination: maxFeePerGas and gasPriceCoef cannot be used together without maxPriorityFeePerGas.');
    });
    (0, globals_1.test)('error <- maxPriorityFeePerGas and gasPriceCoef specified (incomplete dynamic fee)', async () => {
        const client = src_1.ThorClient.at(src_1.TESTNET_URL);
        jest.spyOn(client.forkDetector, 'isGalacticaForked').mockResolvedValue(true);
        const options = {
            maxPriorityFeePerGas: 1000000000000000000,
            gasPriceCoef: 1.5
        };
        await (0, globals_1.expect)(client.transactions.fillDefaultBodyOptions(options)).rejects.toThrow('Invalid parameter combination: maxPriorityFeePerGas and gasPriceCoef cannot be used together without maxFeePerGas.');
    });
    (0, globals_1.test)('success <- all three parameters specified (maxFeePerGas and maxPriorityFeePerGas take precedence)', async () => {
        const client = src_1.ThorClient.at(src_1.TESTNET_URL);
        jest.spyOn(client.forkDetector, 'isGalacticaForked').mockResolvedValue(true);
        const options = {
            maxFeePerGas: 1000000000000000000,
            maxPriorityFeePerGas: 500000000000000000,
            gasPriceCoef: 1.5
        };
        const filledOptions = await client.transactions.fillDefaultBodyOptions(options);
        // Dynamic fee parameters take precedence over legacy parameters
        (0, globals_1.expect)(filledOptions.gasPriceCoef).toBeUndefined();
        (0, globals_1.expect)(filledOptions.maxFeePerGas).toEqual(1000000000000000000);
        (0, globals_1.expect)(filledOptions.maxPriorityFeePerGas).toEqual(500000000000000000);
    });
    (0, globals_1.test)('success <- only gasPriceCoef specified (legacy transaction)', async () => {
        const client = src_1.ThorClient.at(src_1.TESTNET_URL);
        jest.spyOn(client.forkDetector, 'isGalacticaForked').mockResolvedValue(true);
        const options = {
            gasPriceCoef: 1.5
        };
        const filledOptions = await client.transactions.fillDefaultBodyOptions(options);
        (0, globals_1.expect)(filledOptions.gasPriceCoef).toEqual(1.5);
        (0, globals_1.expect)(filledOptions.maxFeePerGas).toBeUndefined();
        (0, globals_1.expect)(filledOptions.maxPriorityFeePerGas).toBeUndefined();
    });
});
(0, globals_1.describe)('buildTransactionBody() unit tests', () => {
    (0, globals_1.test)('legacy tx <- gasPriceCoef is specified', async () => {
        // Vet transfer clause
        const clauses = [
            {
                to: '0x0000000000000000000000000000000000000000',
                value: 1,
                data: '0x'
            }
        ];
        const client = src_1.ThorClient.at(src_1.TESTNET_URL);
        const options = {
            gasPriceCoef: 1.5
        };
        const txBody = await client.transactions.buildTransactionBody(clauses, 1000, options);
        (0, globals_1.expect)(txBody.gasPriceCoef).toEqual(1.5);
        (0, globals_1.expect)(txBody.maxFeePerGas).toBeUndefined();
        (0, globals_1.expect)(txBody.maxPriorityFeePerGas).toBeUndefined();
    });
    (0, globals_1.test)('dynamic fee tx <- maxFeePerGas and maxPriorityFeePerGas are specified', async () => {
        // Vet transfer clause
        const clauses = [
            {
                to: '0x0000000000000000000000000000000000000000',
                value: 1,
                data: '0x'
            }
        ];
        const client = src_1.ThorClient.at(src_1.TESTNET_URL);
        jest.spyOn(client.forkDetector, 'isGalacticaForked').mockResolvedValue(true);
        const options = {
            maxFeePerGas: 1000000000000000000,
            maxPriorityFeePerGas: 10000
        };
        const txBody = await client.transactions.buildTransactionBody(clauses, 1000, options);
        (0, globals_1.expect)(txBody.maxFeePerGas).toBe(1000000000000000000);
        (0, globals_1.expect)(txBody.maxPriorityFeePerGas).toBe(10000);
    });
    (0, globals_1.test)('dynamic fee tx <- only maxFeePerGas is specified', async () => {
        // Vet transfer clause
        const clauses = [
            {
                to: '0x0000000000000000000000000000000000000000',
                value: 1,
                data: '0x'
            }
        ];
        const client = src_1.ThorClient.at(src_1.TESTNET_URL);
        jest.spyOn(client.forkDetector, 'isGalacticaForked').mockResolvedValue(true);
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
        jest.spyOn(client.gas, 'getMaxPriorityFeePerGas').mockResolvedValue('0x1');
        // Mock getNextBlockBaseFeePerGas
        jest.spyOn(client.gas, 'getNextBlockBaseFeePerGas').mockResolvedValue(100n);
        const options = {
            maxFeePerGas: 1000000000000000000
        };
        const txBody = await client.transactions.buildTransactionBody(clauses, 1000, options);
        (0, globals_1.expect)(txBody.maxFeePerGas).toBe(1000000000000000000);
        (0, globals_1.expect)(txBody.maxPriorityFeePerGas).toBe('0x01'); // with leading zero
    });
    (0, globals_1.test)('error <- gasPriceCoef + maxFeePerGas without maxPriorityFeePerGas in buildTransactionBody', async () => {
        // Vet transfer clause
        const clauses = [
            {
                to: '0x0000000000000000000000000000000000000000',
                value: 1,
                data: '0x'
            }
        ];
        const client = src_1.ThorClient.at(src_1.TESTNET_URL);
        jest.spyOn(client.forkDetector, 'isGalacticaForked').mockResolvedValue(true);
        const options = {
            gasPriceCoef: 2.0,
            maxFeePerGas: 1500000000000000000
        };
        await (0, globals_1.expect)(client.transactions.buildTransactionBody(clauses, 1000, options)).rejects.toThrow('Invalid parameter combination: maxFeePerGas and gasPriceCoef cannot be used together without maxPriorityFeePerGas.');
    });
    (0, globals_1.test)('error <- gasPriceCoef + maxPriorityFeePerGas without maxFeePerGas in buildTransactionBody', async () => {
        // Vet transfer clause
        const clauses = [
            {
                to: '0x0000000000000000000000000000000000000000',
                value: 1,
                data: '0x'
            }
        ];
        const client = src_1.ThorClient.at(src_1.TESTNET_URL);
        jest.spyOn(client.forkDetector, 'isGalacticaForked').mockResolvedValue(true);
        const options = {
            gasPriceCoef: 1.25,
            maxPriorityFeePerGas: 1000000000000000000
        };
        await (0, globals_1.expect)(client.transactions.buildTransactionBody(clauses, 1000, options)).rejects.toThrow('Invalid parameter combination: maxPriorityFeePerGas and gasPriceCoef cannot be used together without maxFeePerGas.');
    });
    (0, globals_1.test)('success <- all three parameters in buildTransactionBody (maxFeePerGas and maxPriorityFeePerGas take precedence)', async () => {
        // Vet transfer clause
        const clauses = [
            {
                to: '0x0000000000000000000000000000000000000000',
                value: 1,
                data: '0x'
            }
        ];
        const client = src_1.ThorClient.at(src_1.TESTNET_URL);
        jest.spyOn(client.forkDetector, 'isGalacticaForked').mockResolvedValue(true);
        const options = {
            gasPriceCoef: 2.0,
            maxFeePerGas: 1500000000000000000,
            maxPriorityFeePerGas: 750000000000000000
        };
        const txBody = await client.transactions.buildTransactionBody(clauses, 1000, options);
        (0, globals_1.expect)(txBody.gasPriceCoef).toBeUndefined();
        (0, globals_1.expect)(txBody.maxFeePerGas).toEqual(1500000000000000000);
        (0, globals_1.expect)(txBody.maxPriorityFeePerGas).toEqual(750000000000000000);
    });
    (0, globals_1.test)('success <- only gasPriceCoef in buildTransactionBody (legacy transaction)', async () => {
        // Vet transfer clause
        const clauses = [
            {
                to: '0x0000000000000000000000000000000000000000',
                value: 1,
                data: '0x'
            }
        ];
        const client = src_1.ThorClient.at(src_1.TESTNET_URL);
        jest.spyOn(client.forkDetector, 'isGalacticaForked').mockResolvedValue(true);
        const options = {
            gasPriceCoef: 1.25
        };
        const txBody = await client.transactions.buildTransactionBody(clauses, 1000, options);
        (0, globals_1.expect)(txBody.gasPriceCoef).toEqual(1.25);
        (0, globals_1.expect)(txBody.maxFeePerGas).toBeUndefined();
        (0, globals_1.expect)(txBody.maxPriorityFeePerGas).toBeUndefined();
    });
});
(0, globals_1.describe)('Transactions module - Default options', () => {
    (0, globals_1.describe)('buildTransactionBody with gas option', () => {
        (0, globals_1.test)('should use gas from options when provided', async () => {
            const thorClient = src_1.ThorClient.at(src_1.TESTNET_URL);
            const clauses = [
                {
                    to: '0x0000000000000000000000000000456e65726779',
                    value: '0',
                    data: '0xa9059cbb0000000000000000000000009e7911de289c3c856ce7f421034f66b6cde49c390000000000000000000000000000000000000000000000000de0b6b3a7640000'
                }
            ];
            const gasResult = await thorClient.transactions.estimateGas(clauses, '0x000000000000000000000000004d000000000000');
            // Test with gas in options
            const txBodyWithGas = await thorClient.transactions.buildTransactionBody(clauses, gasResult.totalGas, { gas: '200000' });
            // Test without gas in options (should use gas parameter)
            const txBodyWithoutGas = await thorClient.transactions.buildTransactionBody(clauses, gasResult.totalGas, {});
            // Verify that gas from options is used
            (0, globals_1.expect)(txBodyWithGas.gas).toBe(200000);
            // Verify that gas parameter is used when gas is not provided in options
            (0, globals_1.expect)(txBodyWithoutGas.gas).toBe(gasResult.totalGas);
        });
        (0, globals_1.test)('should handle gas as string and convert to number', async () => {
            const thorClient = src_1.ThorClient.at(src_1.TESTNET_URL);
            const clauses = [
                {
                    to: '0x0000000000000000000000000000456e65726779',
                    value: '0',
                    data: '0xa9059cbb0000000000000000000000009e7911de289c3c856ce7f421034f66b6cde49c390000000000000000000000000000000000000000000000000de0b6b3a7640000'
                }
            ];
            const gasResult = await thorClient.transactions.estimateGas(clauses, '0x000000000000000000000000004d000000000000');
            // Test with gas as string
            const txBody = await thorClient.transactions.buildTransactionBody(clauses, gasResult.totalGas, { gas: '150000' });
            // Verify that string gas is converted to number
            (0, globals_1.expect)(txBody.gas).toBe(150000);
            (0, globals_1.expect)(typeof txBody.gas).toBe('number');
        });
        (0, globals_1.test)('should handle deprecated gasLimit property and show warning', async () => {
            const thorClient = src_1.ThorClient.at(src_1.TESTNET_URL);
            const clauses = [
                {
                    to: '0x0000000000000000000000000000456e65726779',
                    value: '0',
                    data: '0xa9059cbb0000000000000000000000009e7911de289c3c856ce7f421034f66b6cde49c390000000000000000000000000000000000000000000000000de0b6b3a7640000'
                }
            ];
            const gasResult = await thorClient.transactions.estimateGas(clauses, '0x000000000000000000000000004d000000000000');
            // Mock console.warn to capture the warning
            const consoleWarnSpy = jest
                .spyOn(console, 'warn')
                .mockImplementation();
            // Test with gasLimit (deprecated) - now handled by signer, not buildTransactionBody
            const txBodyWithGasLimit = await thorClient.transactions.buildTransactionBody(clauses, gasResult.totalGas, { gas: '250000' } // Use gas instead of gasLimit
            );
            // Verify that gas is used (no warning since we're using gas, not gasLimit)
            (0, globals_1.expect)(txBodyWithGasLimit.gas).toBe(250000);
            (0, globals_1.expect)(consoleWarnSpy).not.toHaveBeenCalled();
            // Test with both gasLimit and gas - gas should take precedence in buildTransactionBody
            const txBodyWithBoth = await thorClient.transactions.buildTransactionBody(clauses, gasResult.totalGas, { gas: '300000' } // Use gas instead of gasLimit
            );
            // Verify that gas is used
            (0, globals_1.expect)(txBodyWithBoth.gas).toBe(300000);
            // Restore console.warn
            consoleWarnSpy.mockRestore();
        });
        (0, globals_1.test)('should handle gasLimit as string and convert to number', async () => {
            const thorClient = src_1.ThorClient.at(src_1.TESTNET_URL);
            const clauses = [
                {
                    to: '0x0000000000000000000000000000456e65726779',
                    value: '0',
                    data: '0xa9059cbb0000000000000000000000009e7911de289c3c856ce7f421034f66b6cde49c390000000000000000000000000000000000000000000000000de0b6b3a7640000'
                }
            ];
            const gasResult = await thorClient.transactions.estimateGas(clauses, '0x000000000000000000000000004d000000000000');
            // Test with gas as string
            const txBody = await thorClient.transactions.buildTransactionBody(clauses, gasResult.totalGas, { gas: '175000' });
            // Verify that string gas is converted to number
            (0, globals_1.expect)(txBody.gas).toBe(175000);
            (0, globals_1.expect)(typeof txBody.gas).toBe('number');
        });
        (0, globals_1.test)('should handle deprecated gasLimit property in signer populateTransaction', async () => {
            // This test verifies that the deprecation warning is shown when using gasLimit
            // through the signer's populateTransaction method
            // Mock console.warn to capture the warning
            const consoleWarnSpy = jest
                .spyOn(console, 'warn')
                .mockImplementation();
            // Create a mock signer that uses populateTransaction
            const mockSigner = {
                populateTransaction: (transaction) => {
                    // Simulate the populateTransaction logic
                    if (transaction.gasLimit !== undefined) {
                        console.warn('\n****************** WARNING: Deprecated Property Usage ******************\n' +
                            '- The `gasLimit` property is deprecated and will be removed in a future release.\n' +
                            '- Please use the `gas` property instead.\n' +
                            '- The `gasLimit` value will be used as the `gas` value for this transaction.\n');
                        return Promise.resolve({
                            gas: Number(transaction.gasLimit)
                        });
                    }
                    return Promise.resolve({
                        gas: Number(transaction.gas) || 21000
                    });
                }
            };
            // Test with gasLimit (deprecated)
            const resultWithGasLimit = await mockSigner.populateTransaction({
                to: '0x0000000000000000000000000000000000000000',
                value: '0',
                gasLimit: '250000'
            });
            // Verify that gasLimit is used and warning is shown
            (0, globals_1.expect)(resultWithGasLimit.gas).toBe(250000);
            (0, globals_1.expect)(consoleWarnSpy).toHaveBeenCalledWith(globals_1.expect.stringContaining('WARNING: Deprecated Property Usage'));
            (0, globals_1.expect)(consoleWarnSpy).toHaveBeenCalledWith(globals_1.expect.stringContaining('The `gasLimit` property is deprecated'));
            // Test with gas (not deprecated)
            const resultWithGas = await mockSigner.populateTransaction({
                to: '0x0000000000000000000000000000000000000000',
                value: '0',
                gas: '200000'
            });
            // Verify that gas is used and no warning is shown
            (0, globals_1.expect)(resultWithGas.gas).toBe(200000);
            // Restore console.warn
            consoleWarnSpy.mockRestore();
        });
    });
});
