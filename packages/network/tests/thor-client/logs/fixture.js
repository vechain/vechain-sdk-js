"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expectedFilterTransferLogs = exports.expectedFilterEventLogs = exports.argFilterTransferLogs = exports.argFilterEventLogs = void 0;
const argFilterEventLogs = {
    range: {
        unit: 'block',
        from: 0,
        to: 100000
    },
    options: {
        offset: 0,
        limit: 10
    },
    criteriaSet: [
        {
            address: '0x0000000000000000000000000000456E65726779',
            topic0: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
            topic1: '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e'
        }
    ],
    order: 'asc'
};
exports.argFilterEventLogs = argFilterEventLogs;
const argFilterTransferLogs = {
    range: {
        unit: 'block',
        from: 0,
        to: 100000
    },
    options: {
        offset: 0,
        limit: 10
    },
    criteriaSet: [
        {
            txOrigin: '0xe59d475abe695c7f67a8a2321f33a856b0b4c71d',
            sender: '0xe59d475abe695c7f67a8a2321f33a856b0b4c71d',
            recipient: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed'
        }
    ],
    order: 'asc'
};
exports.argFilterTransferLogs = argFilterTransferLogs;
const expectedFilterEventLogs = [
    {
        address: '0x0000000000000000000000000000456e65726779',
        topics: [
            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
            '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e',
            '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e'
        ],
        data: '0x00000000000000000000000000000000000000000000124bc0ddd92e55fff280',
        meta: {
            blockID: '0x000060716a6decc7127d221e8a53cd7b33992db6236490f79d47585f9ae7ca14',
            blockNumber: 24689,
            blockTimestamp: 1530261290,
            txID: '0x0ee8df3a9de6787ec0848ea8951ed8899bb053b6b4af167228dd7c0c012f5346',
            txOrigin: '0x5034aa590125b64023a0262112b98d72e3c8e40e',
            clauseIndex: 0
        }
    },
    {
        address: '0x0000000000000000000000000000456e65726779',
        topics: [
            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
            '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e',
            '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e'
        ],
        data: '0x00000000000000000000000000000000000000000000124bc0ddd92e56000000',
        meta: {
            blockID: '0x00006135c993e6cd1ed99aac34679caac80759764ecb01431c9bea0199f3bf4c',
            blockNumber: 24885,
            blockTimestamp: 1530263250,
            txID: '0x86b3364c0faf2df6365b975cf1bd8046264b1eeaa2f266fe15b2df27d7954f65',
            txOrigin: '0x5034aa590125b64023a0262112b98d72e3c8e40e',
            clauseIndex: 0
        }
    },
    {
        address: '0x0000000000000000000000000000456e65726779',
        topics: [
            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
            '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e',
            '0x000000000000000000000000f881a94423f22ee9a0e3e1442f515f43c966b7ed'
        ],
        data: '0x00000000000000000000000000000000000000000000021e19e0c9bab2400000',
        meta: {
            blockID: '0x000069fa97729ea3aaddd0756bb2bf2044fc16cb7d2b391b7982059deb43a86c',
            blockNumber: 27130,
            blockTimestamp: 1530285700,
            txID: '0x9edf26009aa903e2c5e7afbb39a547c9cf324a7f3eedafc33691ce2c9e5c9541',
            txOrigin: '0x5034aa590125b64023a0262112b98d72e3c8e40e',
            clauseIndex: 0
        }
    },
    {
        address: '0x0000000000000000000000000000456e65726779',
        topics: [
            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
            '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e',
            '0x000000000000000000000000f881a94423f22ee9a0e3e1442f515f43c966b7ed'
        ],
        data: '0x00000000000000000000000000000000000000000000021e19e0c9bab2400000',
        meta: {
            blockID: '0x00006a01f75077f2aeebff51f046071bfa4d696ac51612c88eff4877165f73e3',
            blockNumber: 27137,
            blockTimestamp: 1530285770,
            txID: '0xf8ee11a6807b53a0a29df509fbaab15f73c1f2a3f9f8fed14e961c62c4226c9b',
            txOrigin: '0x5034aa590125b64023a0262112b98d72e3c8e40e',
            clauseIndex: 0
        }
    },
    {
        address: '0x0000000000000000000000000000456e65726779',
        topics: [
            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
            '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e',
            '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e'
        ],
        data: '0x00000000000000000000000000000000000000000000124bc0ddd92e56000000',
        meta: {
            blockID: '0x00006a2e2b18a4e7697c54045d2d615fe1a2eaad9a698e803c15b847ad4a7f95',
            blockNumber: 27182,
            blockTimestamp: 1530286220,
            txID: '0x9fada14187c54ca93741c7b20483f52dc83b3f5a934082ea1d7a7d75216c1b80',
            txOrigin: '0x5034aa590125b64023a0262112b98d72e3c8e40e',
            clauseIndex: 0
        }
    },
    {
        address: '0x0000000000000000000000000000456e65726779',
        topics: [
            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
            '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e',
            '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e'
        ],
        data: '0x00000000000000000000000000000000000000000000124bc0ddd92e56000000',
        meta: {
            blockID: '0x00006a423cfbab794f79328cbd0f29f08f0ed1466c076153445d10c3e0ac21b2',
            blockNumber: 27202,
            blockTimestamp: 1530286420,
            txID: '0xed2c6e452326f2ea126632830ebb8abca5bbfbed9da0780bf65efbbf555c8452',
            txOrigin: '0x5034aa590125b64023a0262112b98d72e3c8e40e',
            clauseIndex: 0
        }
    },
    {
        address: '0x0000000000000000000000000000456e65726779',
        topics: [
            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
            '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e',
            '0x000000000000000000000000a7df76f0b8e0d191c5f27563720d1edcd76876db'
        ],
        data: '0x0000000000000000000000000000000000000000000001b1ae4d6e2ef5000000',
        meta: {
            blockID: '0x000080f380a9d89d090360092764d3022e3a39aa7a46a5767f8ed43a80305aac',
            blockNumber: 33011,
            blockTimestamp: 1530344510,
            txID: '0x6dded962eda4c04b91805a7ea63ef7e0a76284e36402986c19bb153fe07200e8',
            txOrigin: '0x5034aa590125b64023a0262112b98d72e3c8e40e',
            clauseIndex: 0
        }
    },
    {
        address: '0x0000000000000000000000000000456e65726779',
        topics: [
            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
            '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e',
            '0x000000000000000000000000b18d55e99335b6f5b416f427c0035bf791cb226f'
        ],
        data: '0x0000000000000000000000000000000000000000000000a2a15d09519be00000',
        meta: {
            blockID: '0x000084f2cb4c3e5ce3b3b311358902ed99ce9dfe70bfb768d2054142b26b6e5a',
            blockNumber: 34034,
            blockTimestamp: 1530354740,
            txID: '0x4192b2351439f2b3979ef18bc9c16678a5fbb601f80c32787cf22bb3282f2925',
            txOrigin: '0x5034aa590125b64023a0262112b98d72e3c8e40e',
            clauseIndex: 0
        }
    },
    {
        address: '0x0000000000000000000000000000456e65726779',
        topics: [
            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
            '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e',
            '0x000000000000000000000000ebc860f3dd7f7aa3f38eb4b17315db73e8f6d319'
        ],
        data: '0x000000000000000000000000000000000000000000000163746089a18cd20000',
        meta: {
            blockID: '0x000089c7b155093311a0ab543f46f2f52f83ca87cbfb04c26507ad134f25f6d2',
            blockNumber: 35271,
            blockTimestamp: 1530367110,
            txID: '0x7234d0e34abe1e7e612fcd3aae108087ef5d85707333afecfa24b5ad31a7a4aa',
            txOrigin: '0x5034aa590125b64023a0262112b98d72e3c8e40e',
            clauseIndex: 0
        }
    },
    {
        address: '0x0000000000000000000000000000456e65726779',
        topics: [
            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
            '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e',
            '0x000000000000000000000000ebdb7c7bd6b46e9611101057e5b98a89697d38a7'
        ],
        data: '0x00000000000000000000000000000000000000000000180863c9a3f1c3a40000',
        meta: {
            blockID: '0x000089c7b155093311a0ab543f46f2f52f83ca87cbfb04c26507ad134f25f6d2',
            blockNumber: 35271,
            blockTimestamp: 1530367110,
            txID: '0x7234d0e34abe1e7e612fcd3aae108087ef5d85707333afecfa24b5ad31a7a4aa',
            txOrigin: '0x5034aa590125b64023a0262112b98d72e3c8e40e',
            clauseIndex: 1
        }
    }
];
exports.expectedFilterEventLogs = expectedFilterEventLogs;
const expectedFilterTransferLogs = [
    {
        amount: '0x152d02c7e14af6800000',
        meta: {
            blockID: '0x00003abbf8435573e0c50fed42647160eabbe140a87efbe0ffab8ef895b7686e',
            blockNumber: 15035,
            blockTimestamp: 1530164750,
            clauseIndex: 0,
            txID: '0x9daa5b584a98976dfca3d70348b44ba5332f966e187ba84510efb810a0f9f851',
            txOrigin: '0xe59d475abe695c7f67a8a2321f33a856b0b4c71d'
        },
        recipient: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
        sender: '0xe59d475abe695c7f67a8a2321f33a856b0b4c71d'
    }
];
exports.expectedFilterTransferLogs = expectedFilterTransferLogs;
