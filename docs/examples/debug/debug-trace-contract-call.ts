import { HttpClient, ThorClient } from '@vechain/sdk-network';

// START_SNIPPET: DebugTraceContractCallSnippet

// 1 - Create thor client for testnet
const _testnetUrl = 'https://testnet.vechain.org';
const testNetwork = new HttpClient(_testnetUrl);
const thorClient = new ThorClient(testNetwork);

// 2 - Trace the contract call.
const result = await thorClient.debug.traceContractCall(
    {
        contractInput: {
            to: '0x0000000000000000000000000000456E65726779',
            data: '0xa9059cbb0000000000000000000000000000000000000000000000000000456e65726779000000000000000000000000000000000000000000000004563918244f400000',
            value: '0x0'
        },
        transactionOptions: {
            caller: '0x625fCe8dd8E2C05e82e77847F3da06AF6e55A7AF',
            gasPayer: '0x625fCe8dd8E2C05e82e77847F3da06AF6e55A7AF',
            expiration: 18,
            blockRef: '0x0101d05409d55cce'
        },
        config: {}
    },
    null
);

// 3 - Print the result.
console.log(result);

// END_SNIPPET: DebugTraceContractCallSnippet
