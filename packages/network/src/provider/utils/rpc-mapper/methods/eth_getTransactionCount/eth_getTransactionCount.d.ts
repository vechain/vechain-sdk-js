/**
 * RPC Method eth_getTransactionCount implementation
 *
 * @link [eth_getTransactionCount](https://ethereum.github.io/execution-apis/api-documentation/)
 *
 * @note: To respect differences between VeChain and Ethereum, in this function we will give a random number as output.
 * Basically Ethereum to get nonce to use the number of transactions sent from an address,
 * while VeChain uses a random number.
 *
 * @param params - The standard array of rpc call parameters.
 *                * params[0]: address: string, is the address to get the number of transactions from.
 *                * params[1]: A string representing a block number, or one of the string tags latest, earliest, or pending.
 * @throws {JSONRPCInvalidParams, JSONRPCInternalError}
 */
declare const ethGetTransactionCount: (params: unknown[]) => Promise<string>;
export { ethGetTransactionCount };
//# sourceMappingURL=eth_getTransactionCount.d.ts.map