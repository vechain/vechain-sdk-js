// 1 - Create the thor client
import { ThorClient } from '@vechain/sdk-network';

const _testnetUrl = 'https://testnet.vechain.org/';
const thorClient = ThorClient.fromUrl(_testnetUrl, {
    isPollingEnabled: false
});

// START_SNIPPET: RevertReasonSnippet

// Define transaction id's
const transactionHash =
    '0x0a5177fb83346bb6ff7ca8408889f0c99f44b2b1b5c8bf6f0eb53c4b2e81d98d';

// Get the revert reason
const revertReason =
    await thorClient.transactions.getRevertReason(transactionHash);
console.log(revertReason);

// END_SNIPPET: RevertReasonSnippet
