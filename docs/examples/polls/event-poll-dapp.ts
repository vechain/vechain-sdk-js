import {
    HttpClient,
    Poll,
    ThorestClient
} from '@vechainfoundation/vechain-sdk-network';
import {
    Transaction,
    TransactionHandler,
    TransactionUtils
} from '@vechainfoundation/vechain-sdk-core';

const createAndSendTransaction = async (
    senderPrivateKey: Buffer,
    receiverAddress: string,
    client: ThorestClient
): Promise<string> => {
    // 1 - Get latest block
    const latestBlock = await client.blocks.getFinalBlock();

    // 2 - Create transaction clauses
    const clauses = [
        {
            to: receiverAddress,
            value: 1000000,
            data: '0x'
        }
    ];

    // 3 - Calculate gas
    // @NOTE: To improve the performance, we use a fixed gas price here.
    const gas = 5000 + TransactionUtils.intrinsicGas(clauses) * 5;

    // 4 - Create transactions
    const transaction = new Transaction({
        // Solo network chain tag
        chainTag: 0xf6,
        // Solo network block ref
        blockRef: latestBlock !== null ? latestBlock.id.slice(0, 18) : '0x0',
        expiration: 32,
        clauses,
        gasPriceCoef: 128,
        gas,
        dependsOn: null,
        nonce: 12345678
    });

    // 5 - Sign and get raw transaction
    const encoded = TransactionHandler.sign(
        transaction,
        senderPrivateKey
    ).encoded;
    const raw = `0x${encoded.toString('hex')}`;

    // 6 - Send transaction
    const sentedTransaction = await client.transactions.sendTransaction(raw);

    return sentedTransaction.id;
};

// 1 - Create client for solo network

const _soloUrl = 'http://localhost:8669';
const soloNetwork = new HttpClient(_soloUrl);
const thorestSoloClient = new ThorestClient(soloNetwork);

// 2- Create sender and receiver

const sender = {
    address: '0x2669514f9fe96bc7301177ba774d3da8a06cace4',
    privateKey: Buffer.from(
        'ea5383ac1f9e625220039a4afac6a7f868bf1ad4f48ce3a1dd78bd214ee4ace5',
        'hex'
    )
};

const receiver = {
    address: '0x9e7911de289c3c856ce7f421034f66b6cde49c39',
    privateKey: Buffer.from(
        '1758771c54938e977518e4ff1c297aca882f6598891df503030734532efa790e',
        'hex'
    )
};

// 3 - Send transaction every 1 second (SENDER)
const sendTransactionPoll = Poll.createEventPoll(
    async () =>
        await createAndSendTransaction(
            sender.privateKey,
            receiver.address,
            thorestSoloClient
        ),
    1000
)
    .onStart((eventPoll) => {
        console.log('Start sending transaction every 3 seconds');
        console.log('Event poll (sender):', eventPoll);
    })
    .onStop((eventPoll) => {
        console.log('Stop sending transaction every 3 seconds');
        console.log('Event poll (sender):', eventPoll);
    })
    .onData((transactionId: string, eventPoll) => {
        console.log('Sented transaction:', transactionId);

        // Stop after 3 iterations - EXIT CONDITION
        if (eventPoll.getCurrentIteration === 3) eventPoll.stopListen();
    })
    .onError((error) => {
        console.log('Error:', error);
    });

sendTransactionPoll.startListen();

// 4 - Verify the balance of the receiver account every 1 second (RECEIVER)
const verifyBalancePoll = Poll.createEventPoll(
    async () => await thorestSoloClient.accounts.getAccount(receiver.address),
    1000
)
    .onStart((eventPoll) => {
        console.log('Start verifying balance every 3 seconds');
        console.log('Event poll (receiver):', eventPoll);
    })
    .onStop((eventPoll) => {
        console.log('Stop verifying balance every 3 seconds');
        console.log('Event poll (receiver):', eventPoll);
    })
    .onData((account, eventPoll) => {
        console.log('Receiver account:', account);

        // Stop after 3 iterations - EXIT CONDITION
        if (eventPoll.getCurrentIteration === 3) eventPoll.stopListen();
    })
    .onError((error) => {
        console.log('Error:', error);
    });

verifyBalancePoll.startListen();
