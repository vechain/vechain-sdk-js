import { ThorClient, ThorNetworks } from '@vechain/sdk-temp/thor';
import { Hex, log, LoggerRegistry, JSONLogger } from '@vechain/sdk-temp/common';

// register a logger
LoggerRegistry.getInstance().registerLogger(new JSONLogger())

// thor client pointing to mainnet
const thor = ThorClient.at(ThorNetworks.MAINNET);

// get transaction details using transaction id
// here is a transaction id from mainnet
const txId = Hex.of(
  '0xcf0bf0cd1531c5c8e64a016413df882700bcb377714fcbb1f7c1b15ef46e865a'
);

// get transaction details
const tx = await thor.transactions.getTransaction(txId);

// log the details
log.info({ message: 'Transaction details', context: { tx } });

// getting transaction receipt using the transaction id
const txReceipt = await thor.transactions.getTransactionReceipt(txId);
log.info({ message: 'Transaction receipt', context: { txReceipt } });

