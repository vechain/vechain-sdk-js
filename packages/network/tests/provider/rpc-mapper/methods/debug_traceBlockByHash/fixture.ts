/**
 * debug_traceBlockByHash fixture
 */
const debugTraceBlockByHashFixture = [
    // Call tracer
    {
        input: {
            params: [
                '0x010e80e4c2b06efb61a86f33155d7a1e3f3bd2ae7b676e7d62270079bd1fe329',
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
];

export { debugTraceBlockByHashFixture };
