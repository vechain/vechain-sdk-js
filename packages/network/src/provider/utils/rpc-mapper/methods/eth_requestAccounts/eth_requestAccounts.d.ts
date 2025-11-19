import { type VeChainProvider } from '../../../../providers/vechain-provider';
/**
 * RPC Method eth_requestAccounts implementation
 *
 * @param provider - Provider with ProviderInternalWallet instance to use.
 * @throws {JSONRPCInvalidParams}
 */
declare const ethRequestAccounts: (provider?: VeChainProvider) => Promise<string[]>;
export { ethRequestAccounts };
//# sourceMappingURL=eth_requestAccounts.d.ts.map