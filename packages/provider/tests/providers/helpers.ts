import { type SubscriptionEvent, type VechainProvider } from '../../src';
import { ERC20_ABI, ERC20_BYTECODE, ERC721_BYTECODE } from './fixture';
import { type Contract, type ThorClient } from '@vechain/sdk-network';
import { ERC721_ABI } from '@vechain/sdk-core';
import { type Signer } from '@vechain/sdk-wallet';

export async function waitForMessage(
    provider: VechainProvider
): Promise<SubscriptionEvent> {
    return await new Promise((resolve) => {
        provider.on('message', (message) => {
            resolve(message as SubscriptionEvent);
            provider.destroy();
        });
    });
}

export async function deployERC20Contract(
    thorClient: ThorClient,
    signer: Signer
): Promise<Contract> {
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
    signer: Signer
): Promise<Contract> {
    const factory = thorClient.contracts.createContractFactory(
        ERC721_ABI,
        ERC721_BYTECODE,
        signer
    );

    await factory.startDeployment();

    return await factory.waitForDeployment();
}
