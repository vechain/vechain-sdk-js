"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const sdk_errors_1 = require("@vechain/sdk-errors");
const src_1 = require("../../../../../src");
const test_utils_1 = require("../../../../test-utils");
/**
 * RPC Mapper integration tests for 'eth_call' method with Solo Network and mocked functionality
 *
 * @group unit/rpc-mapper/methods/eth_call
 */
(0, globals_1.describe)('RPC Mapper - eth_call method tests', () => {
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
     * eth_call RPC call tests - Negative cases
     */
    (0, globals_1.describe)('eth_call - Negative cases', () => {
        /**
         * Test case that mocks an revert error thrown by the simulateTransaction method
         */
        (0, globals_1.test)('Should throw `JSONRPCTransactionRevertError` if an error occurs while simulating the transaction', async () => {
            // Mock the simulateTransaction method to return a revert error
            globals_1.jest.spyOn(thorClient.transactions, 'simulateTransaction').mockRejectedValue(new sdk_errors_1.JSONRPCTransactionRevertError('message', 'data'));
            await (0, globals_1.expect)((0, test_utils_1.retryOperation)(async () => {
                return await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_call]([
                    {
                        from: '0x7487d912d03ab9de786278f679592b3730bdd540',
                        to: '0x3db469a79593dcc67f07DE1869d6682fC1eaf535',
                        value: '1000000000000000000',
                        data: '0x'
                    },
                    'latest'
                ]);
            })).rejects.toThrowError(sdk_errors_1.JSONRPCTransactionRevertError);
        });
        /**
         * Test case that mocks an error thrown by the simulateTransaction method
         */
        (0, globals_1.test)('Should throw `ProviderRpcError` if an error occurs while simulating the transaction', async () => {
            // Mock the getGenesisBlock method to return null
            globals_1.jest.spyOn(thorClient.transactions, 'simulateTransaction').mockRejectedValue(new Error());
            await (0, globals_1.expect)((0, test_utils_1.retryOperation)(async () => {
                return await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_call]([
                    {
                        from: '0x7487d912d03ab9de786278f679592b3730bdd540',
                        to: '0x3db469a79593dcc67f07DE1869d6682fC1eaf535',
                        value: '1000000000000000000',
                        data: '0x'
                    },
                    'latest'
                ]);
            })).rejects.toThrowError(sdk_errors_1.JSONRPCInternalError);
        });
        /**
         * Test an invalid default block tag name
         */
        (0, globals_1.test)('Should throw `JSONRPCInvalidParams` if the default block parameter is invalid block tag', async () => {
            await (0, globals_1.expect)((0, test_utils_1.retryOperation)(async () => {
                return await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_call]([
                    {
                        from: '0x7487d912d03ab9de786278f679592b3730bdd540',
                        to: '0x3db469a79593dcc67f07DE1869d6682fC1eaf535',
                        value: '1000000000000000000',
                        data: '0x'
                    },
                    'invalid'
                ]);
            })).rejects.toThrowError(sdk_errors_1.JSONRPCInternalError);
        });
        /**
         * Test an invalid hexadecimal block number
         */
        (0, globals_1.test)('Should throw `JSONRPCInvalidParams` if the default block parameter is invalid block number hex', async () => {
            await (0, globals_1.expect)((0, test_utils_1.retryOperation)(async () => {
                return await (0, src_1.RPCMethodsMap)(thorClient)[src_1.RPC_METHODS.eth_call]([
                    {
                        from: '0x7487d912d03ab9de786278f679592b3730bdd540',
                        to: '0x3db469a79593dcc67f07DE1869d6682fC1eaf535',
                        value: '1000000000000000000',
                        data: '0x'
                    },
                    '0xinvalid'
                ]);
            })).rejects.toThrowError(sdk_errors_1.JSONRPCInternalError);
        });
    });
});
