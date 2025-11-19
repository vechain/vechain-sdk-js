"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gasPayerPrivateKeyFixture = exports.THOR_SOLO_ACCOUNTS_ETH_SEND_TRANSACTION_FIXTURE = void 0;
const fixture_1 = require("../../../../fixture");
/**
 * Thor solo accounts to use in the tests
 */
const THOR_SOLO_ACCOUNTS_ETH_SEND_TRANSACTION_FIXTURE = {
    sender: (0, fixture_1.getUnusedAccount)(),
    receiver: (0, fixture_1.getUnusedAccount)()
};
exports.THOR_SOLO_ACCOUNTS_ETH_SEND_TRANSACTION_FIXTURE = THOR_SOLO_ACCOUNTS_ETH_SEND_TRANSACTION_FIXTURE;
/**
 * Fixture for a gasPayer private key
 */
const gasPayerPrivateKeyFixture = (0, fixture_1.getUnusedAccount)().privateKey;
exports.gasPayerPrivateKeyFixture = gasPayerPrivateKeyFixture;
