import { ThorClient, Poll, EventPoll, AccountDetail } from '@vechain/sdk-network';

class VeChainTransactionLogger {
    private thorClient: ThorClient;
    private monitoringPoll?: EventPoll<AccountDetail>;

    constructor(url: string) {
        this.thorClient = ThorClient.fromUrl(url);
    }

    public async startLogging(address: string) {
        this.monitoringPoll = Poll.createEventPoll(
            async () => await this.thorClient.accounts.getAccount(address),
            1000
        ).onStart(() => {
            console.log(`Start monitoring account ${address}`);
        }).onStop(() => {
            console.log(`Stop monitoring account ${address}`);
        }).onData((accountDetails) => {
            console.log(`Account details of ${address}:`, accountDetails);
        }).onError((error) => {
            console.log('Error:', error);
        });

        this.monitoringPoll.startListen();
    }

    public stopLogging(): void {
        if (this.monitoringPoll != null) {
            this.monitoringPoll.stopListen();
        }
    }
}

export { VeChainTransactionLogger };
