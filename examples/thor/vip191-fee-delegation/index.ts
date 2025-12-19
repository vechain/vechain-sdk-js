import {
    Revision,
    HexUInt,
    Address
} from '@vechain/sdk-temp/common';
import { ClauseBuilder, PrivateKeySigner, ThorClient, ThorNetworks } from '@vechain/sdk-temp/thor';

async function example(): Promise<void> {

    // Create testnet thor client
    const thorClient = ThorClient.at(ThorNetworks.TESTNET);

    // Setup the signer of the transaction
    // Setup the private key signer with the vechain energy account as gas payer
    const privateKey = HexUInt.of(
    'f9fc826b63a35413541d92d2bfb6661128cd5075fcdca583446d20c59994ba26'
    ).bytes;
    const senderAddress = Address.ofPrivateKey(privateKey);
    const signer = new PrivateKeySigner(privateKey, {
        vip191ServiceURL: 'https://sponsor-testnet.vechain.energy/by/441'
    });

    // create the transaction details
    const receiverAddress = senderAddress;
    const amount = 0n;
    const clauses = [];
    // add a transfer VTHO clause to the transaction
    clauses.push(ClauseBuilder.transferVTHO(receiverAddress, amount));

    // execute the transaction
    // note: as executeClauses method creates the transaction request, we pass the isDelegated flag to the transaction options
    const transactionId = await thorClient.transactions.executeClauses(
        clauses,
        signer,
        { revision: Revision.BEST, gasPadding: 0.2 },
        { isDelegated: true }
    );

    // wait for the receipt of the transaction
    const transactionReceipt =
    await thorClient.transactions.waitForTransactionReceipt(transactionId);
    console.log('Transaction receipt:', transactionReceipt);

}

// run examples
example().catch(console.error);

