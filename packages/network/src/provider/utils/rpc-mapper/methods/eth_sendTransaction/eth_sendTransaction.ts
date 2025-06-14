import {
    JSONRPCInternalError,
    JSONRPCInvalidParams,
    stringifyData
} from '@vechain/sdk-errors';
import { type VeChainSigner } from '../../../../../signer';
import { type ThorClient } from '../../../../../thor-client';
import { RPC_DOCUMENTATION_URL } from '../../../../../utils';
import { type VeChainProvider } from '../../../../providers/vechain-provider';
import { getCachedChainId } from '../eth_chainId';
import { type TransactionObjectInput } from './types';

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
const ethSendTransaction = async (
    thorClient: ThorClient,
    params: unknown[],
    provider?: VeChainProvider
): Promise<string> => {
    // Input validation
    if (
        params === undefined ||
        params.length !== 1 ||
        typeof params[0] !== 'object'
    )
        throw new JSONRPCInvalidParams(
            'eth_sendTransaction',
            `Invalid input params for "eth_sendTransaction" method. See ${RPC_DOCUMENTATION_URL} for details.`,
            { params }
        );

    // Provider must be defined
    if (provider?.wallet === undefined) {
        throw new JSONRPCInvalidParams(
            'eth_sendTransaction',
            'Provider must be defined with a wallet. Ensure that the provider is defined and connected to the network.',
            { provider }
        );
    }

    // From field is required
    if ((params[0] as TransactionObjectInput).from === undefined) {
        throw new JSONRPCInvalidParams(
            'eth_sendTransaction',
            'From field is required in the transaction object.',
            { provider }
        );
    }

    // default value for value is 0x0
    if ((params[0] as TransactionObjectInput).value === undefined) {
        (params[0] as TransactionObjectInput).value = '0x0';
    }

    // Input params
    const [transaction] = params as [TransactionObjectInput];

    // Check if the chainId in the transaction object if specified matches the chainId of the network
    const chainId = await getCachedChainId(thorClient);
    if (transaction.chainId != null && transaction.chainId !== chainId) {
        throw new JSONRPCInvalidParams(
            'eth_sendTransaction',
            `ChainId in the transaction object does not match the chainId of the network. Expected: ${chainId}, Received: ${transaction.chainId}`,
            { chainId: transaction.chainId }
        );
    }

    try {
        // Get the signer of the provider
        const signer = (await provider.getSigner(
            transaction.from
        )) as VeChainSigner;

        // Return the result
        return await signer.sendTransaction(transaction);
    } catch (error) {
        throw new JSONRPCInternalError(
            'eth_sendTransaction()',
            'Method "eth_sendTransaction" failed.',
            {
                params: stringifyData(params),
                url: thorClient.httpClient.baseURL
            },
            error
        );
    }
};

export { ethSendTransaction };
