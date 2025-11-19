import { type TransferLogs } from '@vechain/sdk-network';
/**
 * The `VeChainTransactionLogger` class provides methods to monitor the transactions of an account
 */
declare class VechainTransactionLogger {
    private readonly thorClient;
    private monitoringPoll?;
    private latestTimestamp;
    private readonly webhookUrl?;
    constructor(url: string, webhookUrl?: string);
    /**
     * Start monitoring the transactions of an account
     * @param address The address to monitor
     */
    startLogging(address: string): TransferLogs[] | void;
    /**
     * Stop monitoring the transactions
     */
    stopLogging(): void;
    /**
     * Send a notification to the webhook
     * @param newLogs Logs to be sent to the webhook
     */
    private notifyWebhook;
}
export { VechainTransactionLogger };
//# sourceMappingURL=vechain-transaction-logger.d.ts.map