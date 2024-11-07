import { TESTNET_URL, ThorClient } from '@vechain/sdk-network';
import { Address, HexUInt, VET } from '@vechain/sdk-core';

// START_SNIPPET: DebugTraceContractCallSnippet

// 1 - Create thor client for testnet
const thorClient = ThorClient.at(TESTNET_URL);

// 2 - Trace the contract call.
const result = await thorClient.debug.traceContractCall(
    {
        target: {
            to: Address.of('0x0000000000000000000000000000456E65726779'),
            data: HexUInt.of(
                '0xa9059cbb0000000000000000000000000000000000000000000000000000456e65726779000000000000000000000000000000000000000000000004563918244f400000'
            ),
            value: VET.of(0)
        },
        options: {
            caller: '0x625fCe8dd8E2C05e82e77847F3da06AF6e55A7AF',
            gasPayer: '0x625fCe8dd8E2C05e82e77847F3da06AF6e55A7AF',
            expiration: 18,
            blockRef: '0x0101d05409d55cce'
        },
        config: {}
    },
    // Note that in the testnet only the 'call' option is available.
    'call'
);

// 3 - Print the result.
console.log(result);

// END_SNIPPET: DebugTraceContractCallSnippet
