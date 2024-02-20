import { type SubscriptionEvent, type VechainProvider } from '../../src';
import {
    ERC20_ABI,
    ERC20_BYTECODE,
    ERC721_BYTECODE,
    TEST_ACCOUNT
} from './fixture';
import { type Contract, type ThorClient } from '@vechain/vechain-sdk-network';
import { ERC721_ABI } from '@vechain/vechain-sdk-core';

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
    thorClient: ThorClient
): Promise<Contract> {
    const factory = thorClient.contracts.createContractFactory(
        ERC20_ABI,
        ERC20_BYTECODE,
        TEST_ACCOUNT.privateKey
    );

    await factory.startDeployment();

    return await factory.waitForDeployment();
}

export async function deployERC721Contract(
    thorClient: ThorClient
): Promise<Contract> {
    const factory = thorClient.contracts.createContractFactory(
        ERC721_ABI,
        ERC721_BYTECODE,
        TEST_ACCOUNT.privateKey
    );

    await factory.startDeployment();

    return await factory.waitForDeployment();
}
