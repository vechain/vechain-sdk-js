import type { HardhatVeChainProvider } from '@vechain/sdk-network';
import { vechain_sdk_core_ethers } from '@vechain/sdk-core';

/**
 * Factory adapter for the VeChain hardhat plugin
 *
 * @param contractFactory - The contract factory to adapt to the VeChain network
 * @param hardhatVeChainProvider - The hardhatVeChain provider
 * @returns The adapted contract factory
 */
function factoryAdapter<A extends unknown[], I>(
    contractFactory: vechain_sdk_core_ethers.ContractFactory<A, I>,
    hardhatVeChainProvider: HardhatVeChainProvider
): vechain_sdk_core_ethers.ContractFactory<A, I> {
    contractFactory.deploy = async function (
        ...args: vechain_sdk_core_ethers.ContractMethodArgs<A>
    ) {
        const tx = await this.getDeployTransaction(...args);

        vechain_sdk_core_ethers.assert(
            this.runner != null &&
                typeof this.runner.sendTransaction === 'function',
            'factory runner does not support sending transactions',
            'UNSUPPORTED_OPERATION',
            {
                operation: 'sendTransaction'
            }
        );

        const sentTx = await this.runner.sendTransaction(tx);

        const receipt =
            await hardhatVeChainProvider.thorClient.transactions.waitForTransaction(
                sentTx.hash
            );

        // @ts-expect-error this return type is required by the contract factory deploy method
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return new (vechain_sdk_core_ethers.BaseContract as unknown)(
            receipt?.outputs[0].contractAddress ?? '',
            this.interface,
            this.runner,
            sentTx
        );
    };
    return contractFactory;
}

export { factoryAdapter };
