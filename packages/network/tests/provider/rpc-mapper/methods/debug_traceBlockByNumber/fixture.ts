import { HexInt } from '@vechain/sdk-core';

/**
 * debug_traceBlockByNumber fixture
 */
const debugTraceBlockByNumberFixture = [
    // Call tracer
    {
        input: {
            params: [
                HexInt.of(17727716).toString(),
                {
                    tracer: 'callTracer',
                    tracerConfig: { onlyTopCall: true }
                }
            ]
        },
        expected: [
            {
                txHash: '0x7e7d7ec1510425fd6f68e3dd2369e57af44114fb95b5a26fade14621821c74f3',
                result: {
                    from: '0x7487d912d03ab9de786278f679592b3730bdd540',
                    gas: '0x135e',
                    gasUsed: '0x0',
                    to: '0x6e1ffe60656421eb12de92433c5a319ba606bb81',
                    input: '0xd547741f3c11d16cbaffd01df69ce1c404f6340ee057498f5f00246190ea54220576a84800000000000000000000000042f51a1de771c41157be6129ba7b1756da2f8290',
                    value: '0x0',
                    type: 'CALL',
                    revertReason: ''
                }
            },
            {
                txHash: '0x5f1eb314b18a906e26f68a6b8a79fcea47edc65d1c30bccccdb5ff3f92f4acee',
                result: {
                    from: '0x7487d912d03ab9de786278f679592b3730bdd540',
                    gas: '0x22e2',
                    gasUsed: '0x0',
                    to: '0x6e1ffe60656421eb12de92433c5a319ba606bb81',
                    input: '0x2f2ff15d3c11d16cbaffd01df69ce1c404f6340ee057498f5f00246190ea54220576a84800000000000000000000000042f51a1de771c41157be6129ba7b1756da2f8290',
                    value: '0x0',
                    type: 'CALL',
                    revertReason: ''
                }
            }
        ]
    }
    // The commented out lines should be used as part of the test on solo {@link https://github.com/vechain/vechain-sdk-js/issues/1357}
    // Prestate tracer
    // {
    //     input: {
    //         params: [
    //             HexInt.of(17727716).toString(),
    //             {
    //                 tracer: 'presStateTracer',
    //                 tracerConfig: { onlyTopCall: true }
    //             }
    //         ]
    //     },
    //     expected: [
    //         {
    //             txHash: '0x7e7d7ec1510425fd6f68e3dd2369e57af44114fb95b5a26fade14621821c74f3',
    //             result: {
    //                 '0x6e1ffe60656421eb12de92433c5a319ba606bb81': {
    //                     balance: '0x0',
    //                     nonce: 0
    //                 },
    //                 '0x7487d912d03ab9de786278f679592b3730bdd540': {
    //                     balance: '0x422ca8b0a00a425000000',
    //                     nonce: 0
    //                 },
    //                 '0xb4094c25f86d628fdd571afc4077f0d0196afb48': {
    //                     balance: '0x14b3cf4cc2f3044b700000',
    //                     nonce: 0
    //                 }
    //             }
    //         },
    //         {
    //             txHash: '0x5f1eb314b18a906e26f68a6b8a79fcea47edc65d1c30bccccdb5ff3f92f4acee',
    //             result: {
    //                 '0x6e1ffe60656421eb12de92433c5a319ba606bb81': {
    //                     balance: '0x0',
    //                     nonce: 0
    //                 },
    //                 '0x7487d912d03ab9de786278f679592b3730bdd540': {
    //                     balance: '0x422ca8b0a00a425000000',
    //                     nonce: 0
    //                 },
    //                 '0xb4094c25f86d628fdd571afc4077f0d0196afb48': {
    //                     balance: '0x14b3cf4cc2f3044b700000',
    //                     nonce: 0
    //                 }
    //             }
    //         }
    //     ]
    // }
];

export { debugTraceBlockByNumberFixture };
