import { type SubscriptionEvent, type VechainProvider } from '../../src';

export async function waitForMessage(
    provider: VechainProvider
): Promise<SubscriptionEvent[]> {
    return await new Promise((resolve) => {
        provider.on('message', (message) => {
            resolve(message as SubscriptionEvent[]);
            provider.destroy();
        });
    });
}
