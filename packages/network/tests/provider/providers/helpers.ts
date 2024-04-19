import {
    ERC20_ABI,
    ERC20_BYTECODE,
    ERC721_BYTECODE,
    TEST_ACCOUNT
} from './fixture';

import { ERC721_ABI } from '@vechain/sdk-core';
import {
    type Contract,
    type SubscriptionEvent,
    type ThorClient,
    type VechainProvider
} from '../../../src';

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
