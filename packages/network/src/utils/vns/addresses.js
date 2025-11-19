"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkContracts = void 0;
const sdk_core_1 = require("@vechain/sdk-core");
const NetworkContracts = {
    [sdk_core_1.MAINNET_NETWORK.genesisBlock.id]: {
        registry: '0xa9231da8BF8D10e2df3f6E03Dd5449caD600129b',
        resolveUtils: '0xA11413086e163e41901bb81fdc5617c975Fa5a1A'
    },
    [sdk_core_1.TESTNET_NETWORK.genesisBlock.id]: {
        registry: '0xcBFB30c1F267914816668d53AcBA7bA7c9806D13',
        resolveUtils: '0xc403b8EA53F707d7d4de095f0A20bC491Cf2bc94'
    },
    [sdk_core_1.SOLO_NETWORK.genesisBlock.id]: {
        registry: '0x1c4a602ed21f3d1dddd1142c81f231ef1a08c921',
        resolveUtils: '0xb2f08bbfa8a42b1fbe63feec604cb147385203d7'
    }
};
exports.NetworkContracts = NetworkContracts;
