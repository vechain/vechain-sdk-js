import { TESTNET_URL, ThorClient } from '@vechain/sdk-network';
import { expect } from 'expect';
import { Address, ThorId } from '@vechain/sdk-core';
// START_SNIPPET: AccountsSnippet
// 1 - Create thor client for testnet
const thorClient = ThorClient.at(TESTNET_URL);
// 2 - Get account details
const accountAddress = Address.of('0x5034aa590125b64023a0262112b98d72e3c8e40e');
// Account details
const accountDetails = await thorClient.accounts.getAccount(accountAddress);
// Account code
const accountCode = await thorClient.accounts.getBytecode(accountAddress);
// Get account storage
const position = ThorId.of(1);
const accountStorage = await thorClient.accounts.getStorageAt(accountAddress, position);
// END_SNIPPET: AccountsSnippet
expect(accountDetails).toBeDefined();
expect(`${accountCode}`).toEqual('0x');
expect(`${accountStorage}`).toEqual('0x0000000000000000000000000000000000000000000000000000000000000000');
