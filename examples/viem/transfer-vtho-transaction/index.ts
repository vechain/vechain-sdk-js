import { Address, Hex, Revision } from '@vechain/sdk-temp/common';
import {
    ClauseBuilder,
    ThorClient,
    ThorNetworks,
    TransactionBuilder
} from '@vechain/sdk-temp/thor';
import {
    createPublicClient,
    createWalletClient,
    privateKeyToAccount
} from '@vechain/sdk-temp/viem';

const network = ThorNetworks.TESTNET;

const publicClient = createPublicClient({ network });
const walletClient = createWalletClient({
    network,
    account: privateKeyToAccount(
        Hex.of(
            '0xf9fc826b63a35413541d92d2bfb6661128cd5075fcdca583446d20c59994ba26'
        )
    )
});
const thorClient = ThorClient.at(network);

const senderAddress = walletClient.getAddresses()[0];
const receiverAddress = senderAddress;
const amount = 0n;

const clauses = [ClauseBuilder.transferVTHO(receiverAddress, amount)];

const txBuilder = TransactionBuilder.create(thorClient);
const txRequest = await txBuilder
    .withClauses(clauses)
    .withEstimatedGas(senderAddress, {
        revision: Revision.BEST,
        gasPadding: 0.2
    })
    .build();

const transactionId = await walletClient.sendTransaction(txRequest);

const transactionReceipt =
    await publicClient.waitForTransactionReceipt(transactionId);
console.log('Transaction receipt:', transactionReceipt);
