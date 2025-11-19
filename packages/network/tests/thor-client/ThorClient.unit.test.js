"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../../src");
/**
 * ThorClient module tests.
 *
 * @group unit/clients/thor-client
 */
(0, globals_1.describe)('ThorClient deprecated methods', () => {
    (0, globals_1.test)('ok <- fromUrl', () => {
        const expected = src_1.ThorClient.at(src_1.TESTNET_URL);
        const actual = src_1.ThorClient.at(src_1.TESTNET_URL);
        (0, globals_1.expect)(actual.httpClient.baseURL).toEqual(expected.httpClient.baseURL);
    });
});
