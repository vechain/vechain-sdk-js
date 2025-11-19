import { type ThorClient } from '../../../../../thor-client';
import { type VeChainProvider } from '../../../../providers/vechain-provider';
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
declare const ethSendTransaction: (thorClient: ThorClient, params: unknown[], provider?: VeChainProvider) => Promise<string>;
export { ethSendTransaction };
//# sourceMappingURL=eth_sendTransaction.d.ts.map