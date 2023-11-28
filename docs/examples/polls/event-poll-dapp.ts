import {
    HttpClient,
    Poll,
    ThorestClient
} from '@vechainfoundation/vechain-sdk-network';

// 1 - Create client for testnet

const _testnetUrl = 'https://testnet.vechain.org';
const testNetwork = new HttpClient(_testnetUrl);
const thorestClient = new ThorestClient(testNetwork);

// 2- Init accounts

const accounts = [
    '0x2669514f9fe96bc7301177ba774d3da8a06cace4',
    '0x9e7911de289c3c856ce7f421034f66b6cde49c39'
];

// 3 - Monitor status for each account

for (const account of accounts) {
    const monitoringPoll = Poll.createEventPoll(
        async () => await thorestClient.accounts.getAccount(account),
        1000
    )
        .onStart((eventPoll) => {
            console.log(`Start monitoring account ${account}`);
            console.log('Event poll:', eventPoll);
        })
        .onStop((eventPoll) => {
            console.log(`Start monitoring account ${account}`);
            console.log('Event poll:', eventPoll);
        })
        .onData((accountDetails, eventPoll) => {
            console.log(`Account details of ${account}:`, accountDetails);

            // Stop after 3 iterations - EXIT CONDITION
            if (eventPoll.getCurrentIteration === 3) eventPoll.stopListen();
        })
        .onError((error) => {
            console.log('Error:', error);
        });

    monitoringPoll.startListen();
}
