"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expandedBlockDetailFixture = exports.invalidBlockRevisions = exports.validExpandedBlockRevisions = exports.validCompressedBlockRevisions = exports.waitForBlockTestCases = void 0;
const sdk_errors_1 = require("@vechain/sdk-errors");
/**
 * waitForBlock test cases
 */
const waitForBlockTestCases = [
    {
        options: {
            timeoutMs: undefined,
            intervalMs: undefined
        }
    },
    {
        options: {
            timeoutMs: 12000,
            intervalMs: undefined
        }
    },
    {
        options: {
            timeoutMs: undefined,
            intervalMs: 1000
        }
    },
    {
        options: {
            timeoutMs: 11000,
            intervalMs: 1000
        }
    }
];
exports.waitForBlockTestCases = waitForBlockTestCases;
const validCompressedBlockRevisions = [
    {
        revision: '1',
        expected: {
            number: 1,
            id: '0x000000019015bbd98fc1c9088d793ba9add53896a29cd9aa3a4dcabd1f561c38',
            size: 236,
            parentID: '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127',
            timestamp: 1530014410,
            gasLimit: 10000000,
            beneficiary: '0xb4094c25f86d628fdd571afc4077f0d0196afb48',
            gasUsed: 0,
            totalScore: 1,
            txsRoot: '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            txsFeatures: 0,
            stateRoot: '0x4ec3af0acbad1ae467ad569337d2fe8576fe303928d35b8cdd91de47e9ac84bb',
            receiptsRoot: '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            com: false,
            signer: '0x25ae0ef84da4a76d5a1dfe80d3789c2c46fee30a',
            isTrunk: true,
            isFinalized: true,
            transactions: []
        }
    },
    {
        revision: '1',
        expected: {
            number: 1,
            id: '0x000000019015bbd98fc1c9088d793ba9add53896a29cd9aa3a4dcabd1f561c38',
            size: 236,
            parentID: '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127',
            timestamp: 1530014410,
            gasLimit: 10000000,
            beneficiary: '0xb4094c25f86d628fdd571afc4077f0d0196afb48',
            gasUsed: 0,
            totalScore: 1,
            txsRoot: '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            txsFeatures: 0,
            stateRoot: '0x4ec3af0acbad1ae467ad569337d2fe8576fe303928d35b8cdd91de47e9ac84bb',
            receiptsRoot: '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            com: false,
            signer: '0x25ae0ef84da4a76d5a1dfe80d3789c2c46fee30a',
            isTrunk: true,
            isFinalized: true,
            transactions: []
        }
    },
    {
        revision: '0x00000002e6922bf34b716c736cd95b6602d8255d0c57f975abbe0d4ec34c06c4',
        expected: {
            number: 2,
            id: '0x00000002e6922bf34b716c736cd95b6602d8255d0c57f975abbe0d4ec34c06c4',
            size: 236,
            parentID: '0x000000019015bbd98fc1c9088d793ba9add53896a29cd9aa3a4dcabd1f561c38',
            timestamp: 1530014420,
            gasLimit: 10000000,
            beneficiary: '0xb4094c25f86d628fdd571afc4077f0d0196afb48',
            gasUsed: 0,
            totalScore: 2,
            txsRoot: '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            txsFeatures: 0,
            stateRoot: '0x4ec3af0acbad1ae467ad569337d2fe8576fe303928d35b8cdd91de47e9ac84bb',
            receiptsRoot: '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            com: false,
            signer: '0x25ae0ef84da4a76d5a1dfe80d3789c2c46fee30a',
            isTrunk: true,
            isFinalized: true,
            transactions: []
        }
    },
    {
        revision: 2,
        expected: {
            number: 2,
            id: '0x00000002e6922bf34b716c736cd95b6602d8255d0c57f975abbe0d4ec34c06c4',
            size: 236,
            parentID: '0x000000019015bbd98fc1c9088d793ba9add53896a29cd9aa3a4dcabd1f561c38',
            timestamp: 1530014420,
            gasLimit: 10000000,
            beneficiary: '0xb4094c25f86d628fdd571afc4077f0d0196afb48',
            gasUsed: 0,
            totalScore: 2,
            txsRoot: '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            txsFeatures: 0,
            stateRoot: '0x4ec3af0acbad1ae467ad569337d2fe8576fe303928d35b8cdd91de47e9ac84bb',
            receiptsRoot: '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            com: false,
            signer: '0x25ae0ef84da4a76d5a1dfe80d3789c2c46fee30a',
            isTrunk: true,
            isFinalized: true,
            transactions: []
        }
    }
];
exports.validCompressedBlockRevisions = validCompressedBlockRevisions;
const validExpandedBlockRevisions = [
    {
        revision: '1',
        expected: {
            number: 1,
            id: '0x000000019015bbd98fc1c9088d793ba9add53896a29cd9aa3a4dcabd1f561c38',
            size: 236,
            parentID: '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127',
            timestamp: 1530014410,
            gasLimit: 10000000,
            beneficiary: '0xb4094c25f86d628fdd571afc4077f0d0196afb48',
            gasUsed: 0,
            totalScore: 1,
            txsRoot: '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            txsFeatures: 0,
            stateRoot: '0x4ec3af0acbad1ae467ad569337d2fe8576fe303928d35b8cdd91de47e9ac84bb',
            receiptsRoot: '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            com: false,
            signer: '0x25ae0ef84da4a76d5a1dfe80d3789c2c46fee30a',
            isTrunk: true,
            isFinalized: true,
            transactions: []
        }
    },
    {
        revision: '0x01038ee9f989843a7beb3897232f4fd9ac0bc4897545b9c3151f82ece45c9628',
        expected: {
            number: 17010409,
            id: '0x01038ee9f989843a7beb3897232f4fd9ac0bc4897545b9c3151f82ece45c9628',
            size: 494,
            parentID: '0x01038ee8daf9f3094b55fda706f17ba74845eaa57fb5247d2a9997c374906509',
            timestamp: 1700135460,
            gasLimit: 30000000,
            beneficiary: '0xb4094c25f86d628fdd571afc4077f0d0196afb48',
            gasUsed: 21000,
            totalScore: 132697198,
            txsRoot: '0x21f1dc5a129d3ce558a1cbd6abd9b6baabd024e1deba7c6b285ade1b71762a9f',
            txsFeatures: 1,
            stateRoot: '0xd5793ff22938f2d875ae4c33b6d95356450397225bfc69e97b5f1b8f26eedb0f',
            receiptsRoot: '0xc49772fc8a4013db440de4014b4492dec2516f8ae878d69c6e4a1fd8e8018c75',
            com: true,
            signer: '0xab7b27fc9e7d29f9f2e5bd361747a5515d0cc2d1',
            isTrunk: true,
            isFinalized: true,
            transactions: [
                {
                    id: '0x42720d768659aabff05c456acdd4e1f5c5672740a3728fbc0681117e4868167f',
                    chainTag: 39,
                    type: 0,
                    blockRef: '0x01038ee704383133',
                    expiration: 2000,
                    clauses: [
                        {
                            to: '0x9840acbcd7417ceee8117da585a3c3f6642c8a52',
                            value: '0xde0b6b3a7640000',
                            data: '0x'
                        }
                    ],
                    gasPriceCoef: 0,
                    gas: 21000,
                    origin: '0x6b8d66568cbc7944798268aca153f426596d250a',
                    delegator: null, // TO BE REMOVED WHEN BNC COMPLETE
                    nonce: '0x4ec144ad97b4b079',
                    dependsOn: null,
                    size: 130,
                    gasUsed: 21000,
                    gasPayer: '0x6b8d66568cbc7944798268aca153f426596d250a',
                    paid: '0x2ea11e32ad50000',
                    reward: '0xdfd22a8cd98000',
                    reverted: false,
                    outputs: [
                        {
                            contractAddress: null,
                            events: [],
                            transfers: [
                                {
                                    sender: '0x6b8d66568cbc7944798268aca153f426596d250a',
                                    recipient: '0x9840acbcd7417ceee8117da585a3c3f6642c8a52',
                                    amount: '0xde0b6b3a7640000'
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }
];
exports.validExpandedBlockRevisions = validExpandedBlockRevisions;
const invalidBlockRevisions = [
    {
        description: 'Should throw error for invalid revision',
        revision: 'invalid-revision',
        expectedError: sdk_errors_1.InvalidDataType
    }
];
exports.invalidBlockRevisions = invalidBlockRevisions;
const expandedBlockDetailFixture = {
    number: 17229578,
    id: '0x0106e70ac5e7a11f0d508a0f5dc5916e7e0bc837e4de4f79c9cfbef6a702ea32',
    size: 1255,
    parentID: '0x0106e7096f12cedd83f4922791599ac90fadc054d796e4a47581e8726cb4c369',
    timestamp: 1702821970,
    gasLimit: 30000000,
    beneficiary: '0x1eef8963e1222417af4dac0d98553abddb4a76b5',
    gasUsed: 290302,
    totalScore: 1680196497,
    txsRoot: '0xcbe8f25d8ef87a2d2664157d9df8872ec9840584423d2e327d7f31b697865164',
    txsFeatures: 1,
    stateRoot: '0xbe07b1207976cadcdaff95bf4bca52c7f856e13711be9dcc1f4804001b0ff58b',
    receiptsRoot: '0x2a6f43d81cc422a6daf359b28c9e696c94b7246f9052c3ddbff523bc3ef4cbb7',
    com: true,
    signer: '0x6298c7a54720febdefd741d0899d287c70954c68',
    isTrunk: true,
    isFinalized: false,
    transactions: [
        {
            id: '0x9c2964962df2e2f9e6f378726d47df7c7a948dd98112043c838185f74c6a4e2f',
            chainTag: '74',
            blockRef: '0x0106e7096f12cedd',
            expiration: 32,
            clauses: [
                {
                    to: '0x576da7124c7bb65a692d95848276367e5a844d95',
                    value: '0x1043561a8829300000',
                    data: '0x7ff36ab50000000000000000000000000000000000000000000002394e270e08364000000000000000000000000000000000000000000000000000000000000000000080000000000000000000000000a416bdda32b00e218f08ace220bab512c863ff2f00000000000000000000000000000000000000000000000000000000657f0433000000000000000000000000000000000000000000000000000000000000000200000000000000000000000045429a2255e7248e57fce99e7239aed3f84b7a530000000000000000000000005db3c8a942333f6468176a870db36eef120a34dc'
                }
            ],
            gasPriceCoef: 255,
            gas: 253631,
            origin: '0xa416bdda32b00e218f08ace220bab512c863ff2f',
            delegator: '',
            nonce: '0x2603c69707b46b55',
            dependsOn: '',
            size: 365,
            gasUsed: 223631,
            gasPayer: '0xa416bdda32b00e218f08ace220bab512c863ff2f',
            paid: '0x3e11f0316b4ec000',
            reward: '0x129efb420697a000',
            reverted: false,
            outputs: [
                {
                    contractAddress: null,
                    events: [
                        {
                            address: '0x45429a2255e7248e57fce99e7239aed3f84b7a53',
                            topics: [
                                '0xe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c',
                                '0x000000000000000000000000576da7124c7bb65a692d95848276367e5a844d95'
                            ],
                            data: '0x00000000000000000000000000000000000000000000001043561a8829300000'
                        },
                        {
                            address: '0x45429a2255e7248e57fce99e7239aed3f84b7a53',
                            topics: [
                                '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                                '0x000000000000000000000000576da7124c7bb65a692d95848276367e5a844d95',
                                '0x0000000000000000000000001a8abd6d5627eb26ad71c0c7ae5224cdc640faf3'
                            ],
                            data: '0x00000000000000000000000000000000000000000000001043561a8829300000'
                        },
                        {
                            address: '0x5db3c8a942333f6468176a870db36eef120a34dc',
                            topics: [
                                '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                                '0x0000000000000000000000001a8abd6d5627eb26ad71c0c7ae5224cdc640faf3',
                                '0x000000000000000000000000a416bdda32b00e218f08ace220bab512c863ff2f'
                            ],
                            data: '0x00000000000000000000000000000000000000000000023b04b1d40b515745aa'
                        },
                        {
                            address: '0x1a8abd6d5627eb26ad71c0c7ae5224cdc640faf3',
                            topics: [
                                '0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1'
                            ],
                            data: '0x000000000000000000000000000000000000000000002f87e3cb2aaf503b96140000000000000000000000000000000000000000000687a8d57a3a1d0de7f46c'
                        },
                        {
                            address: '0x1a8abd6d5627eb26ad71c0c7ae5224cdc640faf3',
                            topics: [
                                '0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822',
                                '0x000000000000000000000000576da7124c7bb65a692d95848276367e5a844d95',
                                '0x000000000000000000000000a416bdda32b00e218f08ace220bab512c863ff2f'
                            ],
                            data: '0x00000000000000000000000000000000000000000000001043561a88293000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000023b04b1d40b515745aa'
                        }
                    ],
                    transfers: [
                        {
                            sender: '0xa416bdda32b00e218f08ace220bab512c863ff2f',
                            recipient: '0x576da7124c7bb65a692d95848276367e5a844d95',
                            amount: '0x1043561a8829300000'
                        },
                        {
                            sender: '0x576da7124c7bb65a692d95848276367e5a844d95',
                            recipient: '0x45429a2255e7248e57fce99e7239aed3f84b7a53',
                            amount: '0x1043561a8829300000'
                        }
                    ]
                }
            ]
        },
        {
            id: '0x3e15b509f2109a60c3f1cfdb198b59b46d4792b777333119e819e11b69a190d8',
            chainTag: '74',
            blockRef: '0x0106e7096f12cedd',
            expiration: 720,
            clauses: [
                {
                    to: '0x23a46368e4acc7bb2fe0afeb054def51ec56aa74',
                    value: '0xac576e2a31c35a0000',
                    data: '0x000000606060'
                }
            ],
            gasPriceCoef: 128,
            gas: 29000,
            origin: '0xbeae4bef0121f11d269aedf6adb227259d4314ad',
            delegator: '0xbeae4bef0121f11d269aedf6adb227259d4314ad',
            nonce: '0x33f2b93',
            dependsOn: '',
            size: 200,
            gasUsed: 21216,
            gasPayer: '0xbeae4bef0121f11d269aedf6adb227259d4314ad',
            paid: '0x46c17f1958beae0',
            reward: '0x153a0c879a9f9a9',
            reverted: false,
            outputs: [
                {
                    contractAddress: null,
                    events: [],
                    transfers: [
                        {
                            sender: '0xbeae4bef0121f11d269aedf6adb227259d4314ad',
                            recipient: '0x23a46368e4acc7bb2fe0afeb054def51ec56aa74',
                            amount: '0xac576e2a31c35a0000'
                        }
                    ]
                }
            ]
        },
        {
            id: '0x09804e17727ca0bee6521ae50e15653a8770edade8ac0e36bdda646e09af9c13',
            chainTag: '74',
            blockRef: '0x0106e7096f12cedd',
            expiration: 720,
            clauses: [
                {
                    to: '0x0000000000000000000000000000456e65726779',
                    value: '0x0',
                    data: '0xa9059cbb00000000000000000000000031437d38b38a5cb28dacb0379dbf0b5185e10643000000000000000000000000000000000000000000fbf26224799870e5280000'
                }
            ],
            gasPriceCoef: 10,
            gas: 31990,
            origin: '0x95fe74d1ae072ee45bdb09879a157364e5341565',
            delegator: '',
            nonce: '0x4b129bf90751676e',
            dependsOn: '',
            size: 193,
            gasUsed: 24455,
            gasPayer: '0x95fe74d1ae072ee45bdb09879a157364e5341565',
            paid: '0x386e3296e67232f',
            reward: '0x10eddbfa11ef0f4',
            reverted: true,
            outputs: []
        },
        {
            id: '0xab4c2867d90f6ea27e8eac6b180ca43c267be82593ac15aa801bf70de7301354',
            chainTag: '74',
            blockRef: '0x0106e7096f12cedd',
            expiration: 720,
            clauses: [
                {
                    to: '0xb7591602c0c9d525bc3a7cf3c729fd91b8bf5bf6',
                    value: '0xe18cc1b1e0e8c20000',
                    data: '0x'
                }
            ],
            gasPriceCoef: 0,
            gas: 21000,
            origin: '0x9a107a75cff525b033a3e53cadafe3d193b570ec',
            delegator: '',
            nonce: '0x7bced3146d8fb8fc',
            dependsOn: '',
            size: 131,
            gasUsed: 21000,
            gasPayer: '0x9a107a75cff525b033a3e53cadafe3d193b570ec',
            paid: '0x2ea11e32ad50000',
            reward: '0xdfd22a8cd98000',
            reverted: false,
            outputs: [
                {
                    contractAddress: '0xb2c20a6de401003a671659b10629eb82ff254fb8',
                    events: [],
                    transfers: [
                        {
                            sender: '0x9a107a75cff525b033a3e53cadafe3d193b570ec',
                            recipient: '0xb7591602c0c9d525bc3a7cf3c729fd91b8bf5bf6',
                            amount: '0xe18cc1b1e0e8c20000'
                        }
                    ]
                }
            ]
        }
    ]
};
exports.expandedBlockDetailFixture = expandedBlockDetailFixture;
