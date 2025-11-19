import { type HardhatVeChainProvider } from '@vechain/sdk-network';
import { type Contract } from 'ethers';
/**
 * Contract adapter for the VeChain hardhat plugin
 *
 * @param contract - The contract to adapt to the VeChain network
 * @param hardhatVeChainProvider - The hardhatVeChain provider
 * @returns The adapted contract
 */
declare const contractAdapter: (contract: Contract, hardhatVeChainProvider: HardhatVeChainProvider) => Contract;
export { contractAdapter };
//# sourceMappingURL=contract-adapter.d.ts.map