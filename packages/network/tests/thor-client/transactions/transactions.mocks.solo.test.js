"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../../src");
const fixture_1 = require("./fixture");
const fixture_2 = require("../../fixture");
const sdk_errors_1 = require("@vechain/sdk-errors");
const test_utils_1 = require("../../test-utils");
/**
 * Transactions module tests with mocks.
 *
 * @group integration/clients/thor-client/transactions
 */
(0, globals_1.describe)('buildTransactionBody with mocks', () => {
    (0, globals_1.test)('Should throw error when genesis block is not found', async () => {
        const thorSoloClient = src_1.ThorClient.at(src_1.THOR_SOLO_URL);
        // Mock the getBlock method to return null
        globals_1.jest.spyOn(thorSoloClient.blocks, 'getBlockCompressed').mockResolvedValue(null);
        const gas = await (0, test_utils_1.retryOperation)(async () => await thorSoloClient.transactions.estimateGas([fixture_1.transferTransactionBody.clauses[0]], fixture_2.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address));
        await (0, globals_1.expect)(thorSoloClient.transactions.buildTransactionBody([fixture_1.transferTransactionBody.clauses[0]], gas.totalGas)).rejects.toThrowError(sdk_errors_1.InvalidTransactionField);
    });
    (0, globals_1.test)('Should throw error when get block is not found', async () => {
        const thorSoloClient = src_1.ThorClient.at(src_1.THOR_SOLO_URL);
        // Mock the getBestBlock method to return null
        globals_1.jest.spyOn(thorSoloClient.blocks, 'getBestBlockCompressed').mockResolvedValue(null);
        const gas = await (0, test_utils_1.retryOperation)(async () => await thorSoloClient.transactions.estimateGas([fixture_1.transferTransactionBody.clauses[0]], fixture_2.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address));
        await (0, globals_1.expect)(thorSoloClient.transactions.buildTransactionBody([fixture_1.transferTransactionBody.clauses[0]], gas.totalGas)).rejects.toThrowError(sdk_errors_1.InvalidTransactionField);
    });
    (0, globals_1.test)('Should succeed when options are set', async () => {
        const thorSoloClient = src_1.ThorClient.at(src_1.THOR_SOLO_URL);
        const blockRef = (await thorSoloClient.blocks.getBestBlockRef());
        const gas = await (0, test_utils_1.retryOperation)(async () => await thorSoloClient.transactions.estimateGas([fixture_1.transferTransactionBody.clauses[0]], fixture_2.TEST_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address));
        const options = {
            blockRef,
            chainTag: 256,
            dependsOn: '0x9140e36f05000508465fd55d70947b99a78c84b3afa5e068b955e366b560935f', // Any valid tx id
            expiration: 1000,
            gasPriceCoef: 255,
            isDelegated: true,
            nonce: fixture_1.transactionNonces
                .sendTransactionWithANumberAsValueInTransactionBody[0]
        };
        const transactionBody = await thorSoloClient.transactions.buildTransactionBody([fixture_1.transferTransactionBody.clauses[0]], gas.totalGas, options);
        (0, globals_1.expect)(transactionBody.blockRef).toStrictEqual(options.blockRef);
        (0, globals_1.expect)(transactionBody.chainTag).toStrictEqual(options.chainTag);
        (0, globals_1.expect)(transactionBody.dependsOn).toStrictEqual(options.dependsOn);
        (0, globals_1.expect)(transactionBody.expiration).toStrictEqual(options.expiration);
        (0, globals_1.expect)(transactionBody.gasPriceCoef).toStrictEqual(options.gasPriceCoef);
        (0, globals_1.expect)(transactionBody.nonce).toStrictEqual(options.nonce);
        (0, globals_1.expect)(transactionBody.reserved).toStrictEqual({ features: 1 });
    });
});
