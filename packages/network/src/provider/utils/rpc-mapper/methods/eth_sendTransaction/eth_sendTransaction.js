"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ethSendTransaction = void 0;
const sdk_errors_1 = require("@vechain/sdk-errors");
const utils_1 = require("../../../../../utils");
const eth_chainId_1 = require("../eth_chainId");
/**
 * RPC Method eth_sendTransaction implementation
 *
 * @link [eth_sendTransaction](https://ethereum.github.io/execution-apis/api-documentation/)
 *
 * @NOTE: If 'to' address is not provided.
 * It will be assumed that the transaction is a contract creation transaction.
 * The 'data' field of the transaction will be used as the contract initialization code.
 *
 * @NOTE: 'gasPrice' cannot be used together with 'maxPriorityFeePerGas' and 'maxFeePerGas'.
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 *               * params[0]: transaction - object - This describes the transaction info with following properties:
 *                   * to: 20 bytes - Address the transaction is directed to.
 *                   * from: 20 bytes [Required] - Address the transaction is sent from.
 *                   * gas: Hexadecimal value of the gas provided for the transaction execution as hex string.
 *                   * gasPrice: Hexadecimal value of the gasPrice used for each paid gas.
 *                   * value: Hexadecimal of the value sent with this transaction.
 *                   * data: Hash of the method signature and encoded parameters.
 *                   * maxPriorityFeePerGas: Maximum fee per gas the sender is willing to pay to miners in wei. Used in 1559 transactions.
 *                   * maxFeePerGas: The maximum total fee per gas the sender is willing to pay (includes the network / base fee and miner / priority fee) in wei. Used in 1559 transactions.
 * @param provider - The provider instance to use.
 * @throws {JSONRPCInvalidParams, JSONRPCInternalError}
 */
const ethSendTransaction = async (thorClient, params, provider) => {
    // Input validation
    if (params === undefined ||
        params.length !== 1 ||
        typeof params[0] !== 'object')
        throw new sdk_errors_1.JSONRPCInvalidParams('eth_sendTransaction', `Invalid input params for "eth_sendTransaction" method. See ${utils_1.RPC_DOCUMENTATION_URL} for details.`, { params });
    // Provider must be defined
    if (provider?.wallet === undefined) {
        throw new sdk_errors_1.JSONRPCInvalidParams('eth_sendTransaction', 'Provider must be defined with a wallet. Ensure that the provider is defined and connected to the network.', { provider });
    }
    // From field is required
    if (params[0].from === undefined) {
        throw new sdk_errors_1.JSONRPCInvalidParams('eth_sendTransaction', 'From field is required in the transaction object.', { provider });
    }
    // default value for value is 0x0
    if (params[0].value === undefined) {
        params[0].value = '0x0';
    }
    // Input params
    const [transaction] = params;
    // Check if the chainId in the transaction object if specified matches the chainId of the network
    const chainId = await (0, eth_chainId_1.getCachedChainId)(thorClient);
    if (transaction.chainId != null && transaction.chainId !== chainId) {
        throw new sdk_errors_1.JSONRPCInvalidParams('eth_sendTransaction', `ChainId in the transaction object does not match the chainId of the network. Expected: ${chainId}, Received: ${transaction.chainId}`, { chainId: transaction.chainId });
    }
    try {
        // Get the signer of the provider
        const signer = (await provider.getSigner(transaction.from));
        // Return the result
        return await signer.sendTransaction(transaction);
    }
    catch (error) {
        // Check if this is a network communication error
        if (error instanceof sdk_errors_1.HttpNetworkError) {
            throw new sdk_errors_1.JSONRPCInternalError('eth_sendTransaction()', 'Method "eth_sendTransaction" failed due to network communication error.', {
                params: (0, sdk_errors_1.stringifyData)(params),
                url: thorClient.httpClient.baseURL,
                networkError: true,
                networkErrorType: error.data.networkErrorType
            }, error);
        }
        throw new sdk_errors_1.JSONRPCInternalError('eth_sendTransaction()', 'Method "eth_sendTransaction" failed.', {
            params: (0, sdk_errors_1.stringifyData)(params),
            url: thorClient.httpClient.baseURL
        }, error);
    }
};
exports.ethSendTransaction = ethSendTransaction;
