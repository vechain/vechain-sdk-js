import { Address, Hex, HexUInt, Revision } from '@vechain/sdk-temp/common';
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

// Create viem-compatible clients
const publicClient = createPublicClient({ network });
const walletClient = createWalletClient({
    network,
    account: privateKeyToAccount(
        Hex.of(
            '0xf9fc826b63a35413541d92d2bfb6661128cd5075fcdca583446d20c59994ba26'
        )
    )
});

// Use ThorClient only for building transactions; all signing/sending is done via WalletClient
const thorClient = ThorClient.at(network);
const senderAddress =
    walletClient.getAddresses()[0] ??
    Address.ofPrivateKey(
        HexUInt.of(
            'f9fc826b63a35413541d92d2bfb6661128cd5075fcdca583446d20c59994ba26'
        ).bytes
    );
console.log(`Sender address: ${senderAddress.toString()}`);

/**
 * ------------------------------------------------------------------------------------------------
 * EXAMPLE 1:
 * Build a TransactionRequest using block-ref defaults from ThorClient
 * and sign/send it with the viem WalletClient.
 * ------------------------------------------------------------------------------------------------
 */
async function example1(): Promise<void> {
    const clauses = [
        ClauseBuilder.transferVTHO(
            Address.of('0x7567d83b7b8d80addcb281a71d54fc7b3364ffed'),
            0n
        )
    ];

    const gas = await publicClient.estimateGas(clauses, senderAddress, {
        revision: Revision.BEST
    });

    const txRequest = await thorClient.transactions.buildTransactionBody(
        clauses,
        gas.totalGas
    );
    console.log('Example 1: TransactionRequest:', txRequest);

    const transactionId = await walletClient.sendTransaction(txRequest);

    const transactionReceipt =
        await publicClient.waitForTransactionReceipt(transactionId);
    console.log('Example 1: Transaction receipt:', transactionReceipt);
}

/**
 * ------------------------------------------------------------------------------------------------
 * EXAMPLE 2:
 * Build a TransactionRequest using the fluent TransactionBuilder
 * and send it with the viem WalletClient.
 * ------------------------------------------------------------------------------------------------
 */
async function example2(): Promise<void> {
    const clauses = [
        ClauseBuilder.transferVTHO(
            Address.of('0x7567d83b7b8d80addcb281a71d54fc7b3364ffed'),
            0n
        )
    ];

    const txBuilder = TransactionBuilder.create(thorClient);

    const txRequest = await txBuilder
        .withClauses(clauses)
        .withEstimatedGas(senderAddress, {
            revision: Revision.BEST
        })
        .build();
    console.log('Example 2: TransactionRequest:', txRequest);

    const transactionId = await walletClient.sendTransaction(txRequest);

    const transactionReceipt =
        await publicClient.waitForTransactionReceipt(transactionId);
    console.log('Example 2: Transaction receipt:', transactionReceipt);
}

example1().catch(console.error);
example2().catch(console.error);
