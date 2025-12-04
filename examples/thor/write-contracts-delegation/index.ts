import { Address, Secp256k1, Revision, Hex } from '@vechain/sdk-temp/common';
import {
    ThorClient,
    PrivateKeySigner,
    ClauseBuilder,
    TransactionBuilder,
    TransactionRequest,
    ThorNetworks
} from '@vechain/sdk-temp/thor';

// Create ThorClient for testnet
const thorClient = ThorClient.at(ThorNetworks.TESTNET);

// Generate a private key, from which we get the address and instantiate a signer
const privateKey = await Secp256k1.generatePrivateKey();
const senderAddress = Address.ofPrivateKey(privateKey);

console.log('Address:', senderAddress.toString());

// Create a signer from the private key
const signer = new PrivateKeySigner(privateKey);

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
const txBuilder = TransactionBuilder.create(thorClient);
const txRequest = await txBuilder
    .withClauses([clause])
    .withDelegatedFee()
    .withDynFeeTxDefaults()
    .withEstimatedGas(senderAddress, { revision: Revision.BEST })
    .build();

// Sign the transaction as the origin (sender)
const senderSignedTx = signer.sign(txRequest);

// For fee delegation with an external sponsor service
const sponsorUrl = 'https://sponsor-testnet.vechain.energy/by/441';
const sponsorResponse = await fetch(sponsorUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        raw: senderSignedTx.encoded.toString(),
        origin: senderAddress.toString()
    })
});

if (sponsorResponse.ok) {
    const sponsorData = (await sponsorResponse.json()) as { raw: string };
    const fullySigned = TransactionRequest.decode(Hex.of(sponsorData.raw));
    const txId = await thorClient.transactions.sendTransaction(fullySigned);
    console.log('Transaction id:', txId.toString());
} else {
    console.error('Sponsor service error:', await sponsorResponse.text());
}

