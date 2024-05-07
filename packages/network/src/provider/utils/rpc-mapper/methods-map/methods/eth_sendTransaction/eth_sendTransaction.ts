import { type ThorClient } from '../../../../../../thor-client';
import { assert, buildProviderError, DATA, JSONRPC } from '@vechain/sdk-errors';
import { type VechainProvider } from '../../../../../providers';
import { type TransactionObjectInput } from './types';
import { type VechainSigner } from '../../../../../../signer';

/**
 * RPC Method eth_sendTransaction implementation
 *
 * @link [eth_sendTransaction](https://docs.metamask.io/wallet/reference/eth_sendtransaction/)
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
 *
 * @NOTE: If 'to' address is not provided.
 * It will be assumed that the transaction is a contract creation transaction.
 * The 'data' field of the transaction will be used as the contract initialization code.
 *
 * @NOTE: 'gasPrice' cannot be used together with 'maxPriorityFeePerGas' and 'maxFeePerGas'.
 * 'maxPriorityFeePerGas' and 'maxFeePerGas' are not supported in the current version.
 *
 * @throws {ProviderRpcError} - Will throw an error if the transaction fails.
 * @throws {InvalidDataTypeError} - Will throw an error if the params are invalid.ù
 */
const ethSendTransaction = async (
    thorClient: ThorClient,
    params: unknown[],
    provider?: VechainProvider
): Promise<string> => {
    // Input validation
    assert(
        'eth_sendTransaction',
        params.length === 1 && typeof params[0] === 'object',
        DATA.INVALID_DATA_TYPE,
        `Invalid params, expected one transaction object containing following properties: \n {` +
            `\n\tto: 20 bytes - Address the transaction is directed to.` +
            `\n\tfrom: 20 bytes [Required] - Address the transaction is sent from.` +
            `\n\tgas: Hexadecimal value of the gas provided for the transaction execution as hex string.` +
            `\n\tgasPrice: Hexadecimal value of the gasPrice used for each paid gas.` +
            `\n\tvalue: Hexadecimal of the value sent with this transaction.` +
            `\n\tdata: Hash of the method signature and encoded parameters.` +
            `\n\tmaxPriorityFeePerGas: Maximum fee per gas the sender is willing to pay to miners in wei. Used in 1559 transactions.` +
            `\n\tmaxFeePerGas: The maximum total fee per gas the sender is willing to pay (includes the network / base fee and miner / priority fee) in wei. Used in 1559 transactions.` +
            `\n}.`
    );

    // Provider must be defined
    assert(
        'eth_sendTransaction',
        provider?.wallet !== undefined,
        JSONRPC.INVALID_PARAMS,
        'Provider must be defined with a wallet. Ensure that the provider is defined and connected to the network.'
    );

    // From field is required
    assert(
        'eth_sendTransaction',
        (params[0] as TransactionObjectInput).from !== undefined,
        JSONRPC.INVALID_PARAMS,
        'From field is required in the transaction object.'
    );

    // Input params
    const [transaction] = params as [TransactionObjectInput];

    try {
        // Get the signer of the provider
        const signer = (await (provider as VechainProvider).getSigner(
            transaction.from
        )) as VechainSigner;

        // Return the result
        return await signer.sendTransaction(transaction);
    } catch (e) {
        throw buildProviderError(
            JSONRPC.INTERNAL_ERROR,
            `Method 'eth_sendTransaction' failed: Error sending the transaction\n
            Params: ${JSON.stringify(params)}\n
            URL: ${thorClient.httpClient.baseURL}`,
            {
                params,
                innerError: JSON.stringify(e)
            }
        );
    }
};

export { ethSendTransaction };
