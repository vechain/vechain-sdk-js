import { ERC20_ABI, ERC20_BYTECODE, ERC721_BYTECODE } from './fixture';

import { ERC721_ABI } from '@vechain/sdk-core';
import {
    type Contract,
    type SubscriptionEvent,
    type ThorClient,
    type VeChainProvider,
    type VeChainSigner
} from '../../../src';

export async function waitForMessage(
    provider: VeChainProvider
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
    signer: VeChainSigner
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
    signer: VeChainSigner
): Promise<Contract> {
    const factory = thorClient.contracts.createContractFactory(
        ERC721_ABI,
        ERC721_BYTECODE,
        signer
    );

    await factory.startDeployment();

    return await factory.waitForDeployment();
}
