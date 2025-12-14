import { Hex, JSONLogger, LoggerRegistry, log } from '@vechain/sdk-temp/common';
import { ThorNetworks } from '@vechain/sdk-temp/thor';
import { createPublicClient } from '@vechain/sdk-temp/viem';

LoggerRegistry.getInstance().registerLogger(new JSONLogger());

const publicClient = createPublicClient({ network: ThorNetworks.MAINNET });

const txId = Hex.of(
    '0xcf0bf0cd1531c5c8e64a016413df882700bcb377714fcbb1f7c1b15ef46e865a'
);

const tx = await publicClient.getTransaction(txId);
log.info({ message: 'Transaction details', context: { tx } });

const txReceipt = await publicClient.getTransactionReceipt(txId);
log.info({ message: 'Transaction receipt', context: { txReceipt } });
