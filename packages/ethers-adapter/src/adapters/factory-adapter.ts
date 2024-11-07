import { UnsupportedOperation } from '@vechain/sdk-errors';
import type { HardhatVeChainProvider } from '@vechain/sdk-network';
import type { BaseContract, ContractFactory, ContractMethodArgs } from 'ethers';

/**
 * Factory adapter for the VeChain hardhat plugin
 *
 * @param contractFactory - The contract factory to adapt to the VeChain network
 * @param hardhatVeChainProvider - The hardhatVeChain provider
 * @returns The adapted contract factory
 * @throws {UnsupportedOperation}
 */
function factoryAdapter<A extends unknown[], I>(
    contractFactory: ContractFactory<A, I>,
    hardhatVeChainProvider: HardhatVeChainProvider
): ContractFactory<A, I> {
    contractFactory.deploy = async function (...args: ContractMethodArgs<A>) {
        const tx = await this.getDeployTransaction(...args);

        if (
            this.runner == null ||
            typeof this.runner.sendTransaction !== 'function'
        ) {
            throw new UnsupportedOperation(
                'factoryAdapter()',
                'Runner does not support sending transactions',
                {
                    operation: 'sendTransaction'
                }
            );
        }

        const sentTx = await this.runner.sendTransaction(tx);

        const receipt =
            await hardhatVeChainProvider.thorClient.transactions.waitForTransaction(
                sentTx.hash
            );

        // @ts-expect-error this return type is required by the contract factory deploy method
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, sonarjs/new-operator-misuse
        return new (BaseContract as unknown)(
            receipt?.outputs[0].contractAddress ?? '',
            this.interface,
            this.runner,
            sentTx
        );
    };
    return contractFactory;
}

export { factoryAdapter };
