import {
    HttpClient,
    ThorestClient
} from '@vechainfoundation/vechain-sdk-network';

// Url of the testnet network
const _testnetUrl = 'https://testnet.vechain.org/';

// Testnet network instance
const testNetwork = new HttpClient(_testnetUrl);

// Thorest client testnet instance
const thorestTestnetClient = new ThorestClient(testNetwork);

// Retrieves the details of a transaction.
const transactionDetails =
    await thorestTestnetClient.transactions.getTransaction(
        '0x46d195f69e1ac3922d42c207e4705a3d1642883d97e58f7efc72f179ea326adb'
    );
console.log(transactionDetails);

// Retrieves the receipt of a transaction.
const transactionReceipt =
    await thorestTestnetClient.transactions.getTransactionReceipt(
        '0x46d195f69e1ac3922d42c207e4705a3d1642883d97e58f7efc72f179ea326adb'
    );
console.log(transactionReceipt);
