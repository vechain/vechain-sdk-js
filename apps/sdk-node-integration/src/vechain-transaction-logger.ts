import { ThorClient, Poll, EventPoll, FilterTransferLogsOptions, TransferLogs } from '@vechain/sdk-network';

/**
 * The `VeChainTransactionLogger` class provides methods to monitor the transactions of an account
 */
class VeChainTransactionLogger {
    private thorClient: ThorClient;
    private monitoringPoll?: EventPoll<TransferLogs[]>;

    constructor(url: string) {
        this.thorClient = ThorClient.fromUrl(url);
    }

    /**
     * Start monitoring the transactions of an account
     * @param address The address to monitor
     */
    public async startLogging(address: string) {
        const bestBlock = await this.thorClient.blocks.getBestBlockCompressed();
        const filterOptions: FilterTransferLogsOptions = {
            criteriaSet: [
                { sender: address }, // Transactions sent by the address
                { recipient: address } // Transactions received by the address
            ],
            order: 'desc', // Order logs by descending timestamp
            range: 
                { 
                    unit: 'block',
                    from: bestBlock ? bestBlock.number : 0,
                    to: bestBlock ? bestBlock.number + 100 : 100
                }, 
        };
        
        this.monitoringPoll = Poll.createEventPoll(
            // Get details about the account every time a transaction is made
            async () => await this.thorClient.logs.filterTransferLogs(filterOptions),
            1000
        ).onStart(() => {
            console.log(`Start monitoring account ${address}`);
        }).onStop(() => {
            console.log(`Stop monitoring account ${address}`);
        }).onData((logs) => {
            logs.forEach(log => {
                console.log('Transaction details:', log);
            });
        }).onError((error) => {
            console.log('Error:', error);
        });

        this.monitoringPoll.startListen();
    }

    /**
     * Stop monitoring the transactions
     */
    public stopLogging(): void {
        if (this.monitoringPoll != null) {
            this.monitoringPoll.stopListen();
        }
    }
}

export { VeChainTransactionLogger };
