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

// Get account details
const accountDetails = await thorestTestnetClient.accounts.getAccount(
    '0x5034aa590125b64023a0262112b98d72e3c8e40e'
);
console.log(accountDetails);

// Get account code
const accountCode = await thorestTestnetClient.accounts.getBytecode(
    '0x5034aa590125b64023a0262112b98d72e3c8e40e'
);
console.log(accountCode);

// Get account storage
const accountStorage = await thorestTestnetClient.accounts.getStorageAt(
    '0x5034aa590125b64023a0262112b98d72e3c8e40e',
    '0x0000000000000000000000000000000000000000000000000000000000000001'
);
console.log(accountStorage);
