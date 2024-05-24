# sdk-node-integration:VeChain Transaction Logger

The VeChain Transaction Logger is a TypeScript class that provides methods to monitor the transactions of a specificVeChain account and optionally send webhook notifications when new transactions occur.

## Features

- Monitors transactions sent to and from a specifiedVeChain account.
- Automatically filters out transactions that occurred before the latest timestamp.
- Optionally sends webhook notifications with transaction details when new transactions are detected.

## Usage

```typescript
// Initialize the VeChainTransactionLogger withVeChain node URL and optional webhook URL
const logger = new VeChainTransactionLogger('YOUR_VET_NODE_URL', 'YOUR_WEBHOOK_URL');

// Start monitoring transactions for a specific address
logger.startLogging('YOUR_VET_ACCOUNT_ADDRESS');

// Stop monitoring transactions
logger.stopLogging();
```
## Configuration

- `new VeChainTransactionLogger(url: string, webhookUrl?: string)`: Constructor to initialize the logger. Requires the URL of the VeChain node. Optionally accepts the URL of the webhook endpoint.
- `startLogging(address: string)`: Method to start monitoring transactions for the specifiedVeChain account address.
- `stopLogging()`: Method to stop monitoring transactions.

Webhook notifications: The logger can send webhook notifications with transaction details if a webhook URL is provided.
