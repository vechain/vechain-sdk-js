import { Poll, THOR_SOLO_URL, ThorClient } from '@vechain/sdk-network';
import { Hex, HexUInt, TransactionHandler } from '@vechain/sdk-core';
import { expect } from 'expect';

// 1 - Create thor client for solo network

const thorSoloClient = ThorClient.fromUrl(THOR_SOLO_URL);

// 2- Init transaction

// 2.1 - Get latest block
const latestBlock = await thorSoloClient.blocks.getBestBlockCompressed();

// 2.2 - Transaction sender and receiver
const sender = {
    address: '0x2669514f9fe96bc7301177ba774d3da8a06cace4',
    privateKey: HexUInt.of(
        'ea5383ac1f9e625220039a4afac6a7f868bf1ad4f48ce3a1dd78bd214ee4ace5'
    ).bytes
};

const receiver = {
    address: '0x9e7911de289c3c856ce7f421034f66b6cde49c39',
    privateKey: HexUInt.of(
        '1758771c54938e977518e4ff1c297aca882f6598891df503030734532efa790e'
    ).bytes
};

// 2.2 - Create transaction clauses
const clauses = [
    {
        to: receiver.address,
        value: 1000000,
        data: '0x'
    }
];

// 2.3 - Calculate gas
const gasResult = await thorSoloClient.gas.estimateGas(clauses, sender.address);

// 2.4 - Create transactions
const transactionBody = {
    // Solo network chain tag
    chainTag: 0xf6,
    // Solo network block ref
    blockRef: latestBlock !== null ? latestBlock.id.slice(0, 18) : '0x0',
    expiration: 32,
    clauses,
    gasPriceCoef: 128,
    gas: gasResult.totalGas,
    dependsOn: null,
    nonce: 12345678
};

// 2.5 - Sign and get raw transaction
const encoded = TransactionHandler.sign(
    transactionBody,
    sender.privateKey
).encoded;
const raw = HexUInt.of(encoded).toString();

// 3 - Get the sender and receiver balance before the transaction

const senderBalanceBefore = (
    await thorSoloClient.accounts.getAccount(sender.address)
).balance;

const receiverBalanceBefore = (
    await thorSoloClient.accounts.getAccount(receiver.address)
).balance;

console.log('Sender balance before:', senderBalanceBefore);
console.log('Receiver balance before:', receiverBalanceBefore);

// 4 - Send transaction

const sentTransaction =
    await thorSoloClient.transactions.sendRawTransaction(raw);

// 4.1 - Check if the transaction is sent successfully (check if the transaction id is a valid hex string)
expect(sentTransaction).toBeDefined();
expect(sentTransaction).toHaveProperty('id');
expect(Hex.isValid0x(sentTransaction.id)).toBe(true);

// 4 -Wait until balance is updated

// New balance of sender (wait until the balance is updated)
const newBalanceSender = await Poll.SyncPoll(
    async () =>
        (await thorSoloClient.accounts.getAccount(sender.address)).balance
).waitUntil((newBalance) => {
    return newBalance !== senderBalanceBefore;
});

// New balance of receiver (wait until the balance is updated)
const newBalanceReceiver = await Poll.SyncPoll(
    async () =>
        (await thorSoloClient.accounts.getAccount(receiver.address)).balance
).waitUntil((newBalance) => {
    return newBalance !== receiverBalanceBefore;
});

expect(newBalanceSender).toBeDefined();
expect(newBalanceReceiver).toBeDefined();

expect(newBalanceSender).not.toBe(senderBalanceBefore);
expect(newBalanceReceiver).not.toBe(receiverBalanceBefore);

console.log('New balance of sender:', newBalanceSender);
console.log('New balance of receiver:', newBalanceReceiver);
