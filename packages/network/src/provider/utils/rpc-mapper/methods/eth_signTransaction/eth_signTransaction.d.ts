import type { ThorClient } from '../../../../../thor-client';
import type { VeChainProvider } from '../../../../providers/vechain-provider';
/**
 * RPC Method eth_signTransaction implementation
 *
 * @link [eth_signTransaction](https://ethereum.github.io/execution-apis/api-documentation/)
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
 *                   * nonce: The nonce of the transaction.
 * @param provider - The provider instance to use.
 * @throws {JSONRPCInvalidParams, JSONRPCInternalError}
 */
declare const ethSignTransaction: (thorClient: ThorClient, params: unknown[], provider?: VeChainProvider) => Promise<string>;
export { ethSignTransaction };
//# sourceMappingURL=eth_signTransaction.d.ts.map