"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ethSignTypedDataV4 = void 0;
const sdk_core_1 = require("@vechain/sdk-core");
const sdk_errors_1 = require("@vechain/sdk-errors");
/**
 * RPC Method eth_signTypedDataV4 implementation
 *
 * @link [eth_signTypedDataV4](https://docs.metamask.io/wallet/reference/eth_signtypeddata_v4/)
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 *               * params[0]: The hex encoded address of the account to sign the typed message.
 *               * params[1] An object or a JSON string containing:
 *                   * types - An array of EIP712Domain object. It is an array specifying one or more (name, version, chainId, verifyingContract) tuples.
 *                   * domain - Contains the domain separator values specified in the EIP712Domain type.
 *                   * primaryType: A string specifying the name of the primary type for the message.
 *                   * message: An object containing the data to sign.
 * @param provider - The provider instance to use.
 * @throws {JSONRPCInvalidParams, JSONRPCInternalError}
 */
const ethSignTypedDataV4 = async (thorClient, params, provider) => {
    // Input validation
    if (params.length !== 2 ||
        typeof params[0] !== 'string' ||
        !sdk_core_1.Address.isValid(params[0]) ||
        (typeof params[1] !== 'object' && typeof params[1] !== 'string'))
        throw new sdk_errors_1.JSONRPCInvalidParams('eth_signTypedDataV4', `Invalid input params for "eth_signTypedDataV4" method. See https://docs.metamask.io/wallet/reference/eth_signtypeddata_v4/ for details.`, { params });
    // Provider must be defined
    if (provider?.wallet === undefined ||
        (await provider.getSigner(params[0])) === null) {
        throw new sdk_errors_1.JSONRPCInvalidParams('eth_signTypedDataV4', `Provider must be defined with a wallet. Ensure that the provider is defined, connected to the network and has the wallet with the address ${params[0]} into it.`, { provider });
    }
    // Input params
    const [address] = params;
    let typedData;
    // Parse typedData if it's a string
    if (typeof params[1] === 'string') {
        try {
            const parsed = JSON.parse(params[1]);
            const isObject = typeof parsed === 'object' &&
                parsed !== null &&
                !Array.isArray(parsed);
            const hasFields = 'primaryType' in parsed &&
                'domain' in parsed &&
                'types' in parsed &&
                'message' in parsed;
            if (!isObject || !hasFields) {
                throw new sdk_errors_1.JSONRPCInvalidParams('eth_signTypedDataV4', 'Invalid typedData structure', { params });
            }
            typedData = parsed;
        }
        catch (error) {
            throw new sdk_errors_1.JSONRPCInvalidParams('eth_signTypedData_v4', 'Invalid JSON string for typed data parameter', { params }, error);
        }
    }
    else {
        typedData = params[1];
    }
    // check domain is an object
    if (typeof typedData.domain !== 'object' || typedData.domain === null) {
        throw new sdk_errors_1.JSONRPCInvalidParams('eth_signTypedDataV4', 'Invalid typedData structure', { params });
    }
    try {
        // Get the signer of the provider
        const signer = (await provider.getSigner(address));
        // Return the result
        return await signer.signTypedData(typedData.domain, typedData.types, typedData.message, typedData.primaryType);
    }
    catch (error) {
        throw new sdk_errors_1.JSONRPCInternalError('eth_signTypedDataV4', 'Method "eth_signTypedDataV4" failed.', {
            params: (0, sdk_errors_1.stringifyData)(params),
            url: thorClient.httpClient.baseURL
        }, error);
    }
};
exports.ethSignTypedDataV4 = ethSignTypedDataV4;
