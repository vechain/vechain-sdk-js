import type { ThorClient } from '../../../../../thor-client';
import type { VeChainProvider } from '../../../../providers/vechain-provider';
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
declare const ethSignTypedDataV4: (thorClient: ThorClient, params: unknown[], provider?: VeChainProvider) => Promise<string>;
export { ethSignTypedDataV4 };
//# sourceMappingURL=eth_signTypedData_v4.d.ts.map