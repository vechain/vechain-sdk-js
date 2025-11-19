"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const fixture_1 = require("../../fixture");
const sdk_core_1 = require("@vechain/sdk-core");
const src_1 = require("../../../src");
const test_utils_1 = require("../../test-utils");
/**
 * ThorClient tests for dynamic fee transactions on solo network
 *
 * @group galactica/integration/clients/thor-client/transactions
 */
(0, globals_1.describe)('ThorClient - Transactions Module Dynamic Fees', () => {
    // ThorClient instance
    let thorSoloClient;
    (0, globals_1.beforeEach)(() => {
        thorSoloClient = src_1.ThorClient.at(src_1.THOR_SOLO_URL);
    });
    (0, globals_1.test)('e2e <- Send Dynamic Fee Vet Transfer Transaction with maxFeePerGas and maxPriorityFeePerGas specified', async () => {
        // Vet transfer clause
        const clauses = [
            {
                to: fixture_1.SOLO_GENESIS_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER
                    .address,
                value: 1,
                data: '0x'
            }
        ];
        // Get latest block
        const latestBlock = await (0, test_utils_1.retryOperation)(async () => await thorSoloClient.blocks.getBestBlockCompressed());
        // Estimate the gas required for the transfer transaction
        const gasResult = await (0, test_utils_1.retryOperation)(async () => await thorSoloClient.transactions.estimateGas(clauses, fixture_1.SOLO_GENESIS_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address));
        const genesisBlock = await thorSoloClient.blocks.getGenesisBlock();
        if (!genesisBlock) {
            throw new Error('Genesis block not found');
        }
        const chainTagId = Number(`0x${genesisBlock.id.slice(-2)}`);
        // Create transaction body
        const transactionBody = {
            chainTag: chainTagId, // 0xf6 for Galactica dev network
            blockRef: latestBlock !== null ? latestBlock.id.slice(0, 18) : '0x0',
            expiration: 32,
            clauses,
            gas: gasResult.totalGas,
            maxFeePerGas: 10000000000000,
            maxPriorityFeePerGas: 1000000,
            dependsOn: null,
            nonce: 12345677
        };
        // create transaction
        const unsignedTx = sdk_core_1.Transaction.of(transactionBody);
        (0, globals_1.expect)(unsignedTx.transactionType).toBe('eip1559');
        // get signeded tx
        const signedTx = unsignedTx.sign(sdk_core_1.HexUInt.of(fixture_1.SOLO_GENESIS_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.privateKey).bytes);
        // encoded signed tx
        const signedEncodedTx = signedTx.encoded;
        // check if raw transactions have valid prefix
        (0, globals_1.expect)(signedEncodedTx[0]).toBe(0x51);
        // decode transaction and check
        const decodedTx = sdk_core_1.Transaction.decode(signedEncodedTx, true);
        (0, globals_1.expect)(decodedTx.transactionType).toBe(sdk_core_1.TransactionType.EIP1559);
        (0, globals_1.expect)(decodedTx.body.maxFeePerGas).toBe(10000000000000); // 10000000000000 in hex
        (0, globals_1.expect)(decodedTx.body.maxPriorityFeePerGas).toBe(1000000); // 1000000 in hex
        (0, globals_1.expect)(decodedTx.body.chainTag).toBe(chainTagId);
        (0, globals_1.expect)(decodedTx.body.blockRef).toBe(latestBlock !== null ? latestBlock.id.slice(0, 18) : '0x0');
        // send raw transactions
        const send = await (0, test_utils_1.retryOperation)(async () => await thorSoloClient.transactions.sendRawTransaction(sdk_core_1.HexUInt.of(signedEncodedTx).toString()));
        (0, globals_1.expect)(send).toBeDefined();
        (0, globals_1.expect)(send).toHaveProperty('id');
        (0, globals_1.expect)(sdk_core_1.HexUInt.isValid0x(send.id)).toBe(true);
        // wait for transaction to be mined and get receipt
        const receipt = await (0, test_utils_1.retryOperation)(async () => await thorSoloClient.transactions.waitForTransaction(send.id));
        (0, globals_1.expect)(receipt).toBeDefined();
        (0, globals_1.expect)(receipt?.reverted).toBe(false);
        (0, globals_1.expect)(receipt?.gasUsed).toBeGreaterThan(0);
        (0, globals_1.expect)(receipt?.gasUsed).toBeLessThanOrEqual(gasResult.totalGas);
        // Get transaction object from blockchain
        const onChainTx = await (0, test_utils_1.retryOperation)(async () => await thorSoloClient.transactions.getTransaction(send.id));
        (0, globals_1.expect)(onChainTx).toBeDefined();
        (0, globals_1.expect)(onChainTx?.type).toBe((0, sdk_core_1.fromTransactionType)(sdk_core_1.TransactionType.EIP1559));
        (0, globals_1.expect)(onChainTx?.maxFeePerGas).toBe('0x9184E72A000'.toLowerCase()); // 10000000000000 in hex
        (0, globals_1.expect)(onChainTx?.maxPriorityFeePerGas).toBe('0xF4240'.toLowerCase()); // 1000000 in hex
    });
    (0, globals_1.test)('e2e <- Send Dynamic Fee Vet Transfer Transaction with only maxFeePerGas specified', async () => {
        // Vet transfer clause
        const clauses = [
            {
                to: fixture_1.SOLO_GENESIS_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER
                    .address,
                value: 1,
                data: '0x'
            }
        ];
        // Get latest block
        const latestBlock = await (0, test_utils_1.retryOperation)(async () => await thorSoloClient.blocks.getBestBlockCompressed());
        // Estimate the gas required for the transfer transaction
        const gasResult = await (0, test_utils_1.retryOperation)(async () => await thorSoloClient.transactions.estimateGas(clauses, fixture_1.SOLO_GENESIS_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address));
        const chainTagId = await thorSoloClient.nodes.getChaintag();
        if (!chainTagId) {
            throw new Error('Chain tag not found');
        }
        // Create transaction body
        const transactionBody = {
            chainTag: chainTagId, // 0xf6 for Galactica dev network
            blockRef: latestBlock !== null ? latestBlock.id.slice(0, 18) : '0x0',
            expiration: 32,
            clauses,
            gas: gasResult.totalGas,
            maxFeePerGas: 10000000000000,
            dependsOn: null,
            nonce: 12345677
        };
        // set default value for maxPriorityFeePerGas
        const updatedBody = await thorSoloClient.transactions.fillTransactionBody(transactionBody);
        // create transaction
        const unsignedTx = sdk_core_1.Transaction.of(updatedBody);
        (0, globals_1.expect)(unsignedTx.transactionType).toBe('eip1559');
        (0, globals_1.expect)(unsignedTx.body.maxFeePerGas).toBe(10000000000000); // unchanged
        (0, globals_1.expect)(unsignedTx.body.maxPriorityFeePerGas).toBeDefined(); // computed
        // get signeded tx
        const signedTx = unsignedTx.sign(sdk_core_1.HexUInt.of(fixture_1.SOLO_GENESIS_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.privateKey).bytes);
        // encoded signed tx
        const signedEncodedTx = signedTx.encoded;
        // check if raw transactions have valid prefix
        (0, globals_1.expect)(signedEncodedTx[0]).toBe(0x51);
        // decode transaction and check
        const decodedTx = sdk_core_1.Transaction.decode(signedEncodedTx, true);
        (0, globals_1.expect)(decodedTx.transactionType).toBe(sdk_core_1.TransactionType.EIP1559);
        (0, globals_1.expect)(decodedTx.body.maxFeePerGas).toBe(10000000000000);
        (0, globals_1.expect)(decodedTx.body.maxPriorityFeePerGas).toBeGreaterThan(0);
        (0, globals_1.expect)(decodedTx.body.chainTag).toBe(chainTagId);
        (0, globals_1.expect)(decodedTx.body.blockRef).toBe(latestBlock !== null ? latestBlock.id.slice(0, 18) : '0x0');
        // send raw transactions
        const send = await (0, test_utils_1.retryOperation)(async () => await thorSoloClient.transactions.sendRawTransaction(sdk_core_1.HexUInt.of(signedEncodedTx).toString()));
        (0, globals_1.expect)(send).toBeDefined();
        (0, globals_1.expect)(send).toHaveProperty('id');
        (0, globals_1.expect)(sdk_core_1.HexUInt.isValid0x(send.id)).toBe(true);
        // wait for transaction to be mined and get receipt
        const receipt = await (0, test_utils_1.retryOperation)(async () => await thorSoloClient.transactions.waitForTransaction(send.id));
        (0, globals_1.expect)(receipt).toBeDefined();
        (0, globals_1.expect)(receipt?.reverted).toBe(false);
        (0, globals_1.expect)(receipt?.gasUsed).toBeGreaterThan(0);
        (0, globals_1.expect)(receipt?.gasUsed).toBeLessThanOrEqual(gasResult.totalGas);
        // Get transaction object from blockchain
        const onChainTx = await (0, test_utils_1.retryOperation)(async () => await thorSoloClient.transactions.getTransaction(send.id));
        (0, globals_1.expect)(onChainTx).toBeDefined();
        (0, globals_1.expect)(onChainTx?.type).toBe((0, sdk_core_1.fromTransactionType)(sdk_core_1.TransactionType.EIP1559));
        (0, globals_1.expect)(onChainTx?.maxFeePerGas).toBe('0x9184E72A000'.toLowerCase()); // 10000000000000 in hex
        (0, globals_1.expect)(onChainTx?.maxPriorityFeePerGas).toBeDefined(); // computed
    });
});
