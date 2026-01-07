import { Address, Secp256k1, Revision } from '@vechain/sdk-temp/common';
import {
    ThorClient,
    PrivateKeySigner,
    ClauseBuilder,
    TransactionBuilder,
    ThorNetworks
} from '@vechain/sdk-temp/thor';

async function main(): Promise<void> {

    // Create ThorClient for testnet
    const thorClient = ThorClient.at(ThorNetworks.TESTNET);

    // Generate a private key, from which we get the address and instantiate a signer
    const privateKey = await Secp256k1.generatePrivateKey();
    const senderAddress = Address.ofPrivateKey(privateKey);

    console.log('Address:', senderAddress.toString());

    // Create a signer from the private key
    // use the vechain energy as gas payer
    const signer = new PrivateKeySigner(privateKey, {
        vip191ServiceURL: 'https://sponsor-testnet.vechain.energy/by/441'
    });

    const contractAddress = '0x8384738c995d49c5b692560ae688fc8b51af1059';

    // Define the ABI function as a plain object (no type import needed)
    const incrementAbi = {
        name: 'increment',
        inputs: [],
        outputs: [],
        type: 'function',
        stateMutability: 'nonpayable'
    } as const;

    // Build the clause for the contract function call
    const clause = ClauseBuilder.callFunction(
        Address.of(contractAddress),
        [incrementAbi],
        'increment',
        [], // function arguments
        0n // value to send
    );

    // Build the transaction with fee delegation
    // Note: Using legacy transaction format for sponsor service compatibility
    const txBuilder = TransactionBuilder.create(thorClient);
    const txRequest = await txBuilder
        .withClauses([clause])
        .withDelegatedFee()
        .withLegacyTxDefaults()
        .withEstimatedGas(senderAddress, { revision: Revision.BEST })
        .build();

    // Sign the transaction as the origin (sender) first
    const senderSignedTx = await signer.sign(txRequest);

    // sign the transaction as the gas payer
    // this will use the vechain energy as gas payer as specified in the signer options
    const fullySignedTx = await signer.sign(senderSignedTx, senderAddress);
    const txId = await thorClient.transactions.sendTransaction(fullySignedTx);
    console.log('Transaction id:', txId.toString());
}

// run the main function
main().catch((error) => {
    console.error(error);
});
