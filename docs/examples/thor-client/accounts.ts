import { HttpClient, ThorClient } from '@vechain/sdk-network';
import { expect } from 'expect';

// START_SNIPPET: AccountsSnippet

// 1 - Create thor client for testnet

const _testnetUrl = 'https://testnet.vechain.org';
const testNetwork = new HttpClient(_testnetUrl);
const thorClient = new ThorClient(testNetwork);

// 2 - Get account details

// Account details
const accountDetails = await thorClient.accounts.getAccount(
    '0x5034aa590125b64023a0262112b98d72e3c8e40e'
);

// Account code
const accountCode = await thorClient.accounts.getBytecode(
    '0x5034aa590125b64023a0262112b98d72e3c8e40e'
);

// Get account storage
const accountStorage = await thorClient.accounts.getStorageAt(
    '0x5034aa590125b64023a0262112b98d72e3c8e40e',
    '0x0000000000000000000000000000000000000000000000000000000000000001'
);

// END_SNIPPET: AccountsSnippet

expect(accountDetails).toBeDefined();
expect(accountCode).toEqual('0x');
expect(accountStorage).toEqual(
    '0x0000000000000000000000000000000000000000000000000000000000000000'
);
