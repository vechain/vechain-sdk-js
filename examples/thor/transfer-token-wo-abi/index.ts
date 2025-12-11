import { Address, HexUInt } from '@vechain/sdk-temp/common';
import {
    ThorClient,
    ThorNetworks,
    ClauseBuilder,
    PrivateKeySigner
} from '@vechain/sdk-temp/thor';

// Create testnet thor client
const thorClient = ThorClient.at(ThorNetworks.TESTNET);

// Private key and addresses
const privateKey = HexUInt.of(
    'f9fc826b63a35413541d92d2bfb6661128cd5075fcdca583446d20c59994ba26'
).bytes;
const senderAddress = Address.of(
    '0x7a28e7361fd10f4f058f9fefc77544349ecff5d6'
); // has 20 B3TR on 5th March 2025

const receiverAddress = senderAddress;
const amount = 1n; // 1 wei B3TR

// B3TR token address on testnet
const B3TR_TOKEN_ADDRESS = Address.of(
    '0x5ef79995fe8a89e0812330e4378eb2660cede699'
);

// Create the signer
const signer = new PrivateKeySigner(privateKey);

// Build a clause to transfer B3TR tokens
// ClauseBuilder.transferToken handles VIP-180/ERC-20 token transfers
const clauses = [
    ClauseBuilder.transferToken(
        B3TR_TOKEN_ADDRESS, // Token contract address
        receiverAddress, // Recipient address
        amount // Amount in smallest unit (wei)
    )
];

// Execute the transaction using executeClauses
// This method handles gas estimation, transaction building, signing, and sending
const transactionId = await thorClient.transactions.executeClauses(
    clauses,
    signer,
    {} // Gas estimate options (empty for defaults)
);

console.log('Transaction id:', transactionId.toString());

// Optionally wait for the transaction receipt
const receipt =
    await thorClient.transactions.waitForTransactionReceipt(transactionId);

if (receipt) {
    console.log('Transaction confirmed!');
    console.log('Block number:', receipt.meta.blockNumber);
    console.log('Reverted:', receipt.reverted);
} else {
    console.log('Transaction receipt not found within timeout');
}

