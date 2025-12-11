import { Address, HexUInt, Revision } from '@vechain/sdk-temp/common';
import {
  ThorClient,
  ThorNetworks,
  ClauseBuilder,
  formatEther,
  TransactionBuilder,
} from '@vechain/sdk-temp/thor';

// Create testnet thor client
const thorClient = ThorClient.at(ThorNetworks.TESTNET);

// Setup the signer of the transaction
const privateKey = HexUInt.of('f9fc826b63a35413541d92d2bfb6661128cd5075fcdca583446d20c59994ba26').bytes;
const senderAddress = Address.ofPrivateKey(privateKey);
console.log(`Sender address: ${senderAddress.toString()}`);

/**
 * ------------------------------------------------------------------------------------------------
 * EXAMPLE 1:
 * This example is similar to SDK v2, it uses the function buildTransactionBody to build a TransactionRequest 
 * from the clauses and the estimated gas.
 * ------------------------------------------------------------------------------------------------
 */
async function example1(): Promise<void> {
    /**
     * Build the clauses of the transaction
     * Here we are transferring 0 VTHO to the receiver
     * The ClauseBuilder provides a way to create ready made clauses for common operations
     */
    const clauses = [
        ClauseBuilder.transferVTHO(
            Address.of('0x7567d83b7b8d80addcb281a71d54fc7b3364ffed'),
            BigInt(0)
        ),
    ];
    // Estimate the gas for the transaction
    const gas = await thorClient.gas.estimateGas(clauses);

    // Build the TransactionRequest from the clauses with the estimated gas
    const txRequest = await thorClient.transactions.buildTransactionBody(clauses, gas.totalGas);
    console.log('Example 1: TransactionRequest:', txRequest);

    // Sign the transaction using the private key
    const signedTransaction = txRequest.sign(privateKey);

    // Send the transaction to thor network
    const transactionId = await thorClient.transactions.sendTransaction(signedTransaction);

    // Wait for the receipt
    const transactionReceipt =
    await thorClient.transactions.waitForTransactionReceipt(transactionId);
    console.log('Example 1: Transaction receipt:', transactionReceipt);
}


/**
 * ------------------------------------------------------------------------------------------------
 * EXAMPLE 2:
 * This example uses the TransactionBuilder to build a TransactionRequest 
 * ------------------------------------------------------------------------------------------------
 */
async function example2(): Promise<void> {

    // create the clauses - same as example 1
    const clauses = [
        ClauseBuilder.transferVTHO(
            Address.of('0x7567d83b7b8d80addcb281a71d54fc7b3364ffed'),
            BigInt(0)
        ),
    ];
    
    // setup the transaction builder
    const txBuilder = TransactionBuilder.create(thorClient);

    // using the builders fluent API, build the transaction request
    // note: the withEstimatedGas method is used to estimate the gas for the transaction
    const txRequest = await txBuilder
        .withClauses(clauses)
        .withEstimatedGas(senderAddress, {
            revision: Revision.BEST
        })
        .build();
    console.log('Example 2: TransactionRequest:', txRequest);

    // Sign the transaction using the private key
    const signedTransaction = txRequest.sign(privateKey);

    // Send the transaction to thor network
    const transactionId = await thorClient.transactions.sendTransaction(signedTransaction);

    // Wait for the receipt
    const transactionReceipt =
    await thorClient.transactions.waitForTransactionReceipt(transactionId);
    console.log('Example 2: Transaction receipt:', transactionReceipt);

}

// run example 1
example1().catch(console.error);
example2().catch(console.error);