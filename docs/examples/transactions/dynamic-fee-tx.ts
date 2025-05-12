import {
    Address,
    Clause,
    HexUInt,
    Transaction,
    TransactionType,
    VET,
    networkInfo,
    type TransactionBody,
    type TransactionClause
} from '@vechain/sdk-core';
import { THOR_SOLO_URL, ThorClient } from '@vechain/sdk-network';

// START_SNIPPET: DynamicFeeTransactionSnippet
// Sample account with private key
const senderAccount = {
    privateKey:
        '0x658c8a0db369c02797cb20c89c24e5bfb1598c2e7f99d3f9595a9e91b3d970fe',
    address: '0xA92C535D0A04332ecF3dbB3F5F5609c242232F35'
};

// 1 - Create thor client for solo network
const thorClient = ThorClient.at(THOR_SOLO_URL, {
    isPollingEnabled: false
});

// 2 - Define a clause for the transaction
const clauses: TransactionClause[] = [
    Clause.transferVET(
        Address.of('0x7567d83b7b8d80addcb281a71d54fc7b3364ffed'),
        VET.of(10000)
    ) as TransactionClause
];

// 3 - Get the latest suggested priority fee from the node
let suggestedPriorityFee = '0x746a528800'; // Default 500 Gwei
try {
    suggestedPriorityFee = await thorClient.gas.getMaxPriorityFeePerGas();
    console.log('Suggested priority fee:', suggestedPriorityFee);
} catch (error) {
    console.log('Using default priority fee:', parseInt(suggestedPriorityFee, 16) / 1e9, 'Gwei');
}

// 4 - Get fee history to determine base fee
let baseFeePerGas = '0x9184e72a000'; // Default 10 Gwei
try {
    const feeHistory = await thorClient.gas.getFeeHistory({
        blockCount: 10,
        newestBlock: 'best',
        rewardPercentiles: [25, 50, 75]
    });

    // Get the most recent base fee (last element in the array)
    baseFeePerGas = feeHistory.baseFeePerGas[feeHistory.baseFeePerGas.length - 1];
    console.log('Current base fee per gas:', baseFeePerGas);
} catch (error) {
    console.log('Using default base fee:', parseInt(baseFeePerGas, 16) / 1e9, 'Gwei');
}

// 5 - Get the estimated gas for the transaction
let gasEstimate = 21000; // Default gas for simple transfers
try {
    const gasResult = await thorClient.transactions.estimateGas(
        clauses,
        senderAccount.address
    );
    gasEstimate = gasResult.totalGas || gasEstimate;
} catch (error) {
    console.log('Using default gas value:', gasEstimate);
}

// 6 - Get latest block for block reference
let blockRef = '0x0000000000000000';
try {
    const latestBlock = await thorClient.blocks.getBestBlockCompressed();
    if (latestBlock?.id) {
        blockRef = latestBlock.id.slice(0, 18);
    }
} catch (error) {
    console.log('Using default block reference');
}

// 7 - Define transaction body with dynamic fee parameters
const body: TransactionBody = {
    chainTag: networkInfo.solo.chainTag,
    blockRef,
    expiration: 32,
    clauses,
    gas: gasEstimate,
    dependsOn: null,
    nonce: Math.floor(Math.random() * 1000000),
    // These fields make it a dynamic fee transaction
    maxFeePerGas: parseInt(baseFeePerGas, 16) * 2 + parseInt(suggestedPriorityFee, 16),
    maxPriorityFeePerGas: parseInt(suggestedPriorityFee, 16)
};

// 8 - Create transaction and sign it
const privateKey = HexUInt.of(senderAccount.privateKey).bytes;
const signedTransaction = Transaction.of(body).sign(privateKey);

// 9 - Verify this is an EIP1559 transaction
console.log('Transaction type:', signedTransaction.transactionType);

// 10 - Encode transaction for sending
const encodedRaw = signedTransaction.encoded;

// In a real scenario, you would send the transaction and wait for receipt
console.log('Transaction ready to send');
console.log('- Max fee per gas:', body.maxFeePerGas);
console.log('- Max priority fee per gas:', body.maxPriorityFeePerGas);

// 11 - Send the transaction (commented for example purposes)
// const txResponse = await thorClient.transactions.sendRawTransaction(
//     HexUInt.of(encodedRaw).toString()
// );

// 12 - Wait for transaction confirmation and check receipt
// const receipt = await thorClient.transactions.waitForTransaction(txResponse.id);
// END_SNIPPET: DynamicFeeTransactionSnippet
