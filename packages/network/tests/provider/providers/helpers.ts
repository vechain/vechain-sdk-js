import { ERC20_ABI, ERC20_BYTECODE, ERC721_BYTECODE } from './fixture';

import { ERC721_ABI } from '@vechain/sdk-core';
import {
    type SubscriptionEvent,
    type ThorClient,
    type VeChainProvider,
    type VeChainSigner,
    type Contract
} from '../../../src';

export async function waitForMessage(
    provider: VeChainProvider
): Promise<SubscriptionEvent> {
    return await new Promise((resolve, reject) => {
        const timeout = setTimeout(
            () => {
                // Clean up event listener on timeout
                provider.removeAllListeners('message');
                reject(new Error('Timeout waiting for subscription message'));
            },
            process.env.CI === 'true' ? 45000 : 30000
        ); // Longer timeout in CI

        const messageHandler = (message: SubscriptionEvent): void => {
            clearTimeout(timeout);
            // Remove the specific event listener
            provider.off('message', messageHandler);
            resolve(message);
            provider.destroy();
        };

        provider.on('message', messageHandler);
    });
}

export async function deployERC20Contract(
    thorClient: ThorClient,
    signer: VeChainSigner
): Promise<Contract<typeof ERC20_ABI>> {
    const factory = thorClient.contracts.createContractFactory(
        ERC20_ABI,
        ERC20_BYTECODE,
        signer
    );

    await factory.startDeployment();

    return await factory.waitForDeployment();
}

export async function deployERC721Contract(
    thorClient: ThorClient,
    signer: VeChainSigner
): Promise<Contract<typeof ERC721_ABI>> {
    const factory = thorClient.contracts.createContractFactory(
        ERC721_ABI,
        ERC721_BYTECODE,
        signer
    );

    await factory.startDeployment();

    return await factory.waitForDeployment();
}
