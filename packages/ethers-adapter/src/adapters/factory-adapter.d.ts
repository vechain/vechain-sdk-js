import type { HardhatVeChainProvider } from '@vechain/sdk-network';
import { type ContractFactory } from 'ethers';
/**
 * Factory adapter for the VeChain hardhat plugin
 *
 * @param contractFactory - The contract factory to adapt to the VeChain network
 * @param hardhatVeChainProvider - The hardhatVeChain provider
 * @returns The adapted contract factory
 * @throws {UnsupportedOperation}
 */
declare function factoryAdapter<A extends unknown[], I>(contractFactory: ContractFactory<A, I>, hardhatVeChainProvider: HardhatVeChainProvider): ContractFactory<A, I>;
export { factoryAdapter };
//# sourceMappingURL=factory-adapter.d.ts.map