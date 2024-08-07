import {
    ThorClient,
    Poll,
    type EventPoll,
    type FilterTransferLogsOptions,
    type TransferLogs
} from '@vechain/sdk-network';

/**
 * The `VeChainTransactionLogger` class provides methods to monitor the transactions of an account
 */
class VechainTransactionLogger {
    private readonly thorClient: ThorClient;
    private monitoringPoll?: EventPoll<TransferLogs[]>;
    private latestTimestamp: number = 0;
    private readonly webhookUrl?: string;

    constructor(url: string, webhookUrl?: string) {
        this.thorClient = ThorClient.fromUrl(url);
        this.webhookUrl = webhookUrl;
    }

    /**
     * Start monitoring the transactions of an account
     * @param address The address to monitor
     */
    public startLogging(address: string): TransferLogs[] | void {
        this.monitoringPoll = Poll.createEventPoll(
            // Get details about the account every time a transaction is made
            async () => {
                try {
                    // Get the latest block
                    const bestBlock =
                        await this.thorClient.blocks.getBestBlockCompressed();
                    // Filter the transactions based on the address
                    const filterOptions: FilterTransferLogsOptions = {
                        criteriaSet: [
                            { sender: address }, // Transactions sent by the address
                            { recipient: address } // Transactions received by the address
                        ],
                        order: 'desc', // Order logs by descending timestamp
                        range: {
                            unit: 'block',
                            from: bestBlock != null ? bestBlock.number : 0,
                            to: bestBlock != null ? bestBlock.number + 100 : 100
                        }
                    };

                    // Get the transfer logs
                    const logs =
                        await this.thorClient.logs.filterTransferLogs(
                            filterOptions
                        );

                    // Filter out transactions that occurred before the latest timestamp
                    const newLogs = logs.filter(
                        (log) => log.meta.blockTimestamp > this.latestTimestamp
                    );

                    // Update the latest timestamp
                    if (newLogs.length > 0) {
                        this.latestTimestamp = newLogs[0].meta.blockTimestamp;

                        // Notify webhook if URL is provided
                        if (this.webhookUrl != null) {
                            await this.notifyWebhook(newLogs);
                        }
                    }

                    return newLogs;
                } catch (error) {
                    console.error('Error while fetching transfer logs:', error);
                    throw error; // Propagate the error to stop the polling
                }
            },
            1000
        )
            .onStart(() => {
                console.log(`Start monitoring account ${address}`);
            })
            .onStop(() => {
                console.log(`Stop monitoring account ${address}`);
            })
            .onData((logs) => {
                logs.forEach((log) => {
                    console.log('Transaction details:', log);
                });
            })
            .onError((error) => {
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

    /**
     * Send a notification to the webhook
     * @param newLogs Logs to be sent to the webhook
     */
    private async notifyWebhook(newLogs: TransferLogs[]): Promise<void> {
        try {
            // Make an HTTP POST request to the webhook URL with the new transaction data
            const response = await fetch(this.webhookUrl as string, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newLogs)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            console.log('Webhook notification sent successfully');
        } catch (error) {
            console.error('Error sending webhook notification:', error);
        }
    }
}

export { VechainTransactionLogger };
