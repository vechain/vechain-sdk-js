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
    /**
     * sendTransaction tests
     */
    (0, globals_1.describe)('sendTransaction', () => {
        (0, globals_1.test)('Send Dynamic Fee Vet Transaction and Verify in Expanded Block', async () => {
            const clauses = [
                {
                    to: fixture_1.SOLO_GENESIS_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER
                        .address,
                    value: 1,
                    data: '0x'
                }
            ];
            const latestBlock = await (0, test_utils_1.retryOperation)(async () => await thorSoloClient.blocks.getBestBlockCompressed());
            const gasResult = await (0, test_utils_1.retryOperation)(async () => await thorSoloClient.gas.estimateGas(clauses, fixture_1.SOLO_GENESIS_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER
                .address));
            const chainTagId = await thorSoloClient.nodes.getChaintag();
            if (!chainTagId) {
                throw new Error('Chain tag not found');
            }
            const transactionBody = {
                chainTag: chainTagId,
                blockRef: latestBlock !== null ? latestBlock.id.slice(0, 18) : '0x0',
                expiration: 32,
                clauses,
                gas: gasResult.totalGas,
                maxFeePerGas: 10000000000000,
                maxPriorityFeePerGas: 1000000,
                dependsOn: null,
                nonce: 12345677
            };
            const unsignedTx = sdk_core_1.Transaction.of(transactionBody);
            const signedTx = unsignedTx.sign(sdk_core_1.HexUInt.of(fixture_1.SOLO_GENESIS_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER
                .privateKey).bytes);
            const signedEncodedTx = signedTx.encoded;
            const send = await (0, test_utils_1.retryOperation)(async () => await thorSoloClient.transactions.sendRawTransaction(sdk_core_1.HexUInt.of(signedEncodedTx).toString()));
            (0, globals_1.expect)(send).toBeDefined();
            (0, globals_1.expect)(send).toHaveProperty('id');
            const receipt = await (0, test_utils_1.retryOperation)(async () => await thorSoloClient.transactions.waitForTransaction(send.id));
            (0, globals_1.expect)(receipt).toBeDefined();
            (0, globals_1.expect)(receipt?.reverted).toBe(false);
            // Fetch the expanded block using the receipt blockID
            const blockID = receipt?.meta.blockID;
            (0, globals_1.expect)(blockID).toBeDefined(); // This already guarantees it's not undefined
            const expandedBlock = await (0, test_utils_1.retryOperation)(async () => await thorSoloClient.blocks.getBlockExpanded(blockID));
            (0, globals_1.expect)(expandedBlock).not.toBeNull();
            (0, globals_1.expect)(Array.isArray(expandedBlock?.transactions)).toBe(true);
            // Locate the transaction inside the block
            if (expandedBlock == null ||
                !Array.isArray(expandedBlock.transactions)) {
                throw new Error('Expanded block is null or missing transactions');
            }
            const txInBlock = expandedBlock.transactions.find((tx) => tx.id === send.id);
            if (txInBlock == null) {
                throw new Error('Transaction not found in block');
            }
            (0, globals_1.expect)(txInBlock).toBeDefined();
            (0, globals_1.expect)(txInBlock?.origin).toBe(fixture_1.SOLO_GENESIS_ACCOUNTS.TRANSACTION.TRANSACTION_SENDER.address);
            // Validate fields in the transaction
            (0, globals_1.expect)(txInBlock.clauses.length).toBe(1);
            const clauseTo = txInBlock.clauses[0].to;
            (0, globals_1.expect)(clauseTo).not.toBeNull();
            // Explicit null check for `clauseTo`
            if (clauseTo === null || clauseTo === undefined) {
                throw new Error("Clause 'to' field is null or undefined");
            }
            (0, globals_1.expect)(clauseTo.toLowerCase()).toBe(fixture_1.SOLO_GENESIS_ACCOUNTS.TRANSACTION.TRANSACTION_RECEIVER.address.toLowerCase());
            (0, globals_1.expect)(txInBlock.clauses[0].value).toBe('0x1');
            (0, globals_1.expect)(txInBlock.gas).toBe(gasResult.totalGas);
            (0, globals_1.expect)(txInBlock.maxFeePerGas).toBe('0x9184e72a000'); // 10000000000000
            (0, globals_1.expect)(txInBlock.maxPriorityFeePerGas).toBe('0xf4240'); // 1000000
            (0, globals_1.expect)(txInBlock.nonce).toBe('0xbc614d'); // 12345677 in hex
            (0, globals_1.expect)(txInBlock.chainTag).toBe(chainTagId);
        });
    });
});
