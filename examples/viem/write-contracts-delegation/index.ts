import { Address, Hex, Revision, Secp256k1 } from '@vechain/sdk-temp/common';
import {
    ClauseBuilder,
    ThorClient,
    ThorNetworks,
    TransactionBuilder,
    TransactionRequest
} from '@vechain/sdk-temp/thor';
import {
    createPublicClient,
    createWalletClient,
    privateKeyToAccount
} from '@vechain/sdk-temp/viem';

async function main(): Promise<void> {

    // create a public client for the testnet
    const network = ThorNetworks.TESTNET;
    const publicClient = createPublicClient({ network });

    // create a private key wallet client
    const privateKey = await Secp256k1.generatePrivateKey();
    const account = privateKeyToAccount(Hex.of(privateKey));
    const walletClient = createWalletClient({ network, account });
    
    // create a thor client for the testnet
    const thorClient = ThorClient.at(network);

    console.log('Address:', account.address.toString());
    const contractAddress = '0x8384738c995d49c5b692560ae688fc8b51af1059';

    // define the ABI for the contract function call
    const incrementAbi = {
        name: 'increment',
        inputs: [],
        outputs: [],
        type: 'function',
        stateMutability: 'nonpayable'
    } as const;

    // build the clause for the contract function call
    const clause = ClauseBuilder.callFunction(
        Address.of(contractAddress),
        [incrementAbi],
        'increment',
        [],
        0n
    );

    // build a delegated transaction request with the clause
    const txBuilder = TransactionBuilder.create(thorClient);
    const txRequest = await txBuilder
        .withClauses([clause])
        .withDelegatedFee()
        .withLegacyTxDefaults()
        .withEstimatedGas(account.address, { revision: Revision.BEST })
        .build();

    // sign the transaction as the origin (sender) first
    const originSignedHex = await walletClient.signTransaction(txRequest);
    const originSignedTx = TransactionRequest.decode(originSignedHex);

    // sign the transaction as the gas payer
    const originSignedTxWithGasPayer = TransactionRequest.of({ ...originSignedTx }, { signature: originSignedTx.signature, feeDelegationUrl: 'https://sponsor-testnet.vechain.energy/by/441' });
    const fullySignedHex = await walletClient.signTransaction(originSignedTxWithGasPayer, account.address);
    const fullySigned = TransactionRequest.decode(fullySignedHex);
    
    // send the transaction to the network
    const txId = await walletClient.sendTransaction(fullySigned);
    console.log('Transaction id:', txId.toString());

    // wait for the transaction to be confirmed
    const receipt = await publicClient.waitForTransactionReceipt(txId);
    console.log('Receipt:', receipt);
    
}

// run the main function
main().catch((error) => {
    console.error(error);
});
