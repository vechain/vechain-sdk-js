"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debugTraceTransactionNegativeCasesFixtureTestnet = exports.debugTraceTransactionPositiveCasesFixtureTestnet = void 0;
const sdk_errors_1 = require("@vechain/sdk-errors");
/**
 * debug_traceTransaction positive cases fixture - Testnet
 */
const debugTraceTransactionPositiveCasesFixtureTestnet = [
    // Transaction 1 - callTracer - 0x2dbc8268a2dbf889abe828c0671cb9adce61f537aab8855480aff6967e0ed687
    {
        input: {
            params: [
                '0x2dbc8268a2dbf889abe828c0671cb9adce61f537aab8855480aff6967e0ed687',
                {
                    tracer: 'callTracer',
                    timeout: '10s',
                    tracerConfig: { onlyTopCall: true }
                }
            ],
            expected: {
                from: '0x7487d912d03ab9de786278f679592b3730bdd540',
                gas: '0x11c5',
                gasUsed: '0x0',
                to: '0x6e1ffe60656421eb12de92433c5a319ba606bb81',
                input: '0x02fe53050000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000f6e657742617365546f6b656e5552490000000000000000000000000000000000',
                value: '0x0',
                type: 'CALL',
                revertReason: ''
            }
        }
    },
    // Transaction 2 - callTracer - 0x05b31824569f2f2ec64c62c4e6396199f56ae872ff219288eb3293b4a36e7b0f
    {
        input: {
            params: [
                '0x05b31824569f2f2ec64c62c4e6396199f56ae872ff219288eb3293b4a36e7b0f',
                {
                    tracer: 'callTracer',
                    timeout: '10s',
                    tracerConfig: { onlyTopCall: true }
                }
            ],
            expected: {
                from: '0x105199a26b10e55300cb71b46c5b5e867b7df427',
                gas: '0x8b92',
                gasUsed: '0x50fa',
                to: '0xaa854565401724f7061e0c366ca132c87c1e5f60',
                input: '0xf14fcbc800d770b9faa11ba944366f3e7a14c166f780ece542e557e0b7fe4870fcbe8dbe',
                revertReason: '',
                value: '0x0',
                type: 'CALL'
            }
        }
    }
];
exports.debugTraceTransactionPositiveCasesFixtureTestnet = debugTraceTransactionPositiveCasesFixtureTestnet;
/**
 * debug_traceTransaction positive cases fixture.
 */
const debugTraceTransactionNegativeCasesFixtureTestnet = [
    // Transaction 1 Invalid transaction ID
    {
        input: {
            params: [
                'INVALID_TRANSACTION_ID',
                {
                    tracer: 'callTracer',
                    timeout: '10s',
                    tracerConfig: { onlyTopCall: true }
                }
            ],
            expectedError: sdk_errors_1.InvalidDataType
        }
    },
    // Transaction not exists
    {
        input: {
            params: [
                '0x000000000000000000000004e600000000000000000000000000000000000000',
                {
                    tracer: 'callTracer',
                    timeout: '10s',
                    tracerConfig: { onlyTopCall: true }
                }
            ],
            expectedError: sdk_errors_1.JSONRPCInternalError
        }
    },
    // Invalid input
    {
        input: {
            params: ['INVALID'],
            expectedError: sdk_errors_1.JSONRPCInvalidParams
        }
    }
];
exports.debugTraceTransactionNegativeCasesFixtureTestnet = debugTraceTransactionNegativeCasesFixtureTestnet;
