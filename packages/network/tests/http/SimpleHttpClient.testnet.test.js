"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const http_1 = require("../../src/http");
const src_1 = require("../../src");
const fixture_1 = require("../fixture");
const sdk_errors_1 = require("@vechain/sdk-errors");
const TIMEOUT = 10000;
const GENESIS_BLOCK = {
    number: 0,
    id: '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127',
    size: 170,
    parentID: '0xffffffff00000000000000000000000000000000000000000000000000000000',
    timestamp: 1530014400,
    gasLimit: 10000000,
    beneficiary: fixture_1.ZERO_ADDRESS,
    gasUsed: 0,
    totalScore: 0,
    txsRoot: '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
    txsFeatures: 0,
    stateRoot: '0x4ec3af0acbad1ae467ad569337d2fe8576fe303928d35b8cdd91de47e9ac84bb',
    receiptsRoot: '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
    com: false,
    signer: fixture_1.ZERO_ADDRESS,
    isTrunk: true,
    isFinalized: true,
    transactions: []
};
/**
 * Test SimpleHttpClient class.
 *
 * @group integration/network/http
 */
(0, globals_1.describe)('SimpleHttpClient testnet tests', () => {
    (0, globals_1.describe)('GET method tests', () => {
        (0, globals_1.test)('ok <- GET /block/latest', async () => {
            const httpClient = new http_1.SimpleHttpClient(src_1.TESTNET_URL);
            const response = await httpClient.get('/blocks/0?expanded=false');
            const expected = (0, sdk_errors_1.stringifyData)(GENESIS_BLOCK);
            const actual = (0, sdk_errors_1.stringifyData)(response);
            (0, globals_1.expect)(actual).toEqual(expected);
        }, TIMEOUT);
        (0, globals_1.test)('Test http without leading slash', async () => {
            const httpClient = new http_1.SimpleHttpClient(src_1.TESTNET_URL);
            const resp = await httpClient.http(http_1.HttpMethod.GET, 'blocks/best');
            (0, globals_1.expect)(resp).toBeDefined();
        });
        (0, globals_1.test)('Test http with leading slash', async () => {
            const httpClient = new http_1.SimpleHttpClient(src_1.TESTNET_URL);
            const resp = await httpClient.http(http_1.HttpMethod.GET, '/blocks/best');
            (0, globals_1.expect)(resp).toBeDefined();
        });
    });
});
