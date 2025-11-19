"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const sdk_core_1 = require("@vechain/sdk-core");
const src_1 = require("../../../../../src");
const fixture_1 = require("../../../../fixture");
const test_utils_1 = require("../../../../test-utils");
/**
 * RPC Mapper integration tests for 'eth_sendRawTransaction' method
 *
 * @group integration/rpc-mapper/methods/eth_sendRawTransaction
 */
(0, globals_1.describe)('RPC Mapper - eth_sendRawTransaction method tests', () => {
    /**
     * Thor client instance
     */
    let thorClient;
    /**
     * Init thor client before each test
     */
    (0, globals_1.beforeEach)(() => {
        // Init thor client
        thorClient = src_1.ThorClient.at(src_1.THOR_SOLO_URL);
    });
    /**
     * eth_sendRawTransaction RPC call tests - Positive cases
     */
    (0, globals_1.describe)('eth_sendRawTransaction - Positive cases', () => {
        /**
         * Positive case 1 - Send a simple raw transaction
         */
        (0, globals_1.test)('eth_sendRawTransaction - Send a simple raw transaction', async () => {
            // 1 - Init sender and receiver
            const actors = {
                sender: (0, fixture_1.getUnusedAccount)(),
                receiver: (0, fixture_1.getUnusedAccount)()
            };
            // 2- Init transaction
            // Init clauses
            const clauses = [
                {
                    to: actors.receiver.address,
                    value: 1000000,
                    data: '0x'
                }
            ];
            // Get latest block
            const latestBlock = await (0, test_utils_1.retryOperation)(async () => await thorClient.blocks.getBestBlockCompressed());
            // Estimate the gas required for the transfer transaction
            const gasResult = await (0, test_utils_1.retryOperation)(async () => await thorClient.transactions.estimateGas(clauses, actors.sender.address));
            const genesisBlock = await thorClient.blocks.getGenesisBlock();
            if (!genesisBlock) {
                throw new Error('Genesis block not found');
            }
            const chainTagId = Number(`0x${genesisBlock.id.slice(-2)}`);
            // Create transactions
            const transactionBody = {
                chainTag: chainTagId,
                blockRef: latestBlock !== null ? latestBlock.id.slice(0, 18) : '0x0',
                expiration: 32,
                clauses,
                gasPriceCoef: 128,
                gas: gasResult.totalGas,
                dependsOn: null,
                nonce: 23456789
            };
            // 2- Sign transaction
            const signedTransaction = sdk_core_1.Transaction.of(transactionBody).sign(sdk_core_1.HexUInt.of(actors.sender.privateKey).bytes);
            const raw = sdk_core_1.HexUInt.of(signedTransaction.encoded).toString();
            // 3 - Send raw transaction
            const result = (await (0, test_utils_1.retryOperation)(async () => await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_sendRawTransaction]([raw])));
            (0, globals_1.expect)(result).toBe(signedTransaction.id.toString());
        });
    });
});
