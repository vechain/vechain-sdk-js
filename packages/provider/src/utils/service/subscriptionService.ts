// subscriptionService.ts
interface SubscriptionService {
    subscriptions: string[];
    currentBlockNumber: number;
}

export const subscriptionService: SubscriptionService = {
    subscriptions: [],
    currentBlockNumber: 0
};
