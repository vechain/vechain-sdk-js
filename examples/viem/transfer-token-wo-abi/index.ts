import { Address, Hex } from '@vechain/sdk-temp/common';
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
const amount = 1n;

const B3TR_TOKEN_ADDRESS = Address.of(
    '0x5ef79995fe8a89e0812330e4378eb2660cede699'
);

const clauses = [
    ClauseBuilder.transferToken(B3TR_TOKEN_ADDRESS, receiverAddress, amount)
];

const txBuilder = TransactionBuilder.create(thorClient);
const txRequest = await txBuilder
    .withClauses(clauses)
    .withEstimatedGas(senderAddress, {})
    .build();

const transactionId = await walletClient.sendTransaction(txRequest);
console.log('Transaction id:', transactionId.toString());

const receipt = await publicClient.waitForTransactionReceipt(transactionId);

if (receipt) {
    console.log('Transaction confirmed!');
    console.log('Block number:', receipt.meta.blockNumber);
    console.log('Reverted:', receipt.reverted);
} else {
    console.log('Transaction receipt not found within timeout');
}
