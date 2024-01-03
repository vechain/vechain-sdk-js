import { InvalidDataTypeError } from '@vechainfoundation/vechain-sdk-errors';

/**
 * waitForBlock test cases
 */
const waitForBlockTestCases = [
    {
        description:
            'Should wait for block without timeoutMs and intervalMs and return BlockDetail',
        options: {
            timeoutMs: undefined,
            intervalMs: undefined
        }
    },
    {
        description:
            'Should wait for block with timeoutMs and return BlockDetail',
        options: {
            timeoutMs: 10000,
            intervalMs: undefined
        }
    },
    {
        description:
            'Should wait for transaction with intervalMs and return BlockDetail',
        options: {
            timeoutMs: undefined,
            intervalMs: 1000
        }
    },
    {
        description:
            'Should wait for transaction with intervalMs & timeoutMs and return BlockDetail',
        options: {
            timeoutMs: 11000,
            intervalMs: 1000
        }
    }
];

const validBlockRevisions = [
    {
        revision: '1',
        expected: {
            number: 1,
            id: '0x000000019015bbd98fc1c9088d793ba9add53896a29cd9aa3a4dcabd1f561c38',
            size: 236,
            parentID:
                '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127',
            timestamp: 1530014410,
            gasLimit: 10000000,
            beneficiary: '0xb4094c25f86d628fdd571afc4077f0d0196afb48',
            gasUsed: 0,
            totalScore: 1,
            txsRoot:
                '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            txsFeatures: 0,
            stateRoot:
                '0x4ec3af0acbad1ae467ad569337d2fe8576fe303928d35b8cdd91de47e9ac84bb',
            receiptsRoot:
                '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            com: false,
            signer: '0x25ae0ef84da4a76d5a1dfe80d3789c2c46fee30a',
            isTrunk: true,
            isFinalized: true,
            transactions: []
        }
    },
    {
        revision: '1',
        expanded: true,
        expected: {
            number: 1,
            id: '0x000000019015bbd98fc1c9088d793ba9add53896a29cd9aa3a4dcabd1f561c38',
            size: 236,
            parentID:
                '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127',
            timestamp: 1530014410,
            gasLimit: 10000000,
            beneficiary: '0xb4094c25f86d628fdd571afc4077f0d0196afb48',
            gasUsed: 0,
            totalScore: 1,
            txsRoot:
                '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            txsFeatures: 0,
            stateRoot:
                '0x4ec3af0acbad1ae467ad569337d2fe8576fe303928d35b8cdd91de47e9ac84bb',
            receiptsRoot:
                '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            com: false,
            signer: '0x25ae0ef84da4a76d5a1dfe80d3789c2c46fee30a',
            isTrunk: true,
            isFinalized: true,
            transactions: []
        }
    },
    {
        revision: '1',
        expanded: false,
        expected: {
            number: 1,
            id: '0x000000019015bbd98fc1c9088d793ba9add53896a29cd9aa3a4dcabd1f561c38',
            size: 236,
            parentID:
                '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127',
            timestamp: 1530014410,
            gasLimit: 10000000,
            beneficiary: '0xb4094c25f86d628fdd571afc4077f0d0196afb48',
            gasUsed: 0,
            totalScore: 1,
            txsRoot:
                '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            txsFeatures: 0,
            stateRoot:
                '0x4ec3af0acbad1ae467ad569337d2fe8576fe303928d35b8cdd91de47e9ac84bb',
            receiptsRoot:
                '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            com: false,
            signer: '0x25ae0ef84da4a76d5a1dfe80d3789c2c46fee30a',
            isTrunk: true,
            isFinalized: true,
            transactions: []
        }
    },
    {
        revision:
            '0x00000002e6922bf34b716c736cd95b6602d8255d0c57f975abbe0d4ec34c06c4',
        expected: {
            number: 2,
            id: '0x00000002e6922bf34b716c736cd95b6602d8255d0c57f975abbe0d4ec34c06c4',
            size: 236,
            parentID:
                '0x000000019015bbd98fc1c9088d793ba9add53896a29cd9aa3a4dcabd1f561c38',
            timestamp: 1530014420,
            gasLimit: 10000000,
            beneficiary: '0xb4094c25f86d628fdd571afc4077f0d0196afb48',
            gasUsed: 0,
            totalScore: 2,
            txsRoot:
                '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            txsFeatures: 0,
            stateRoot:
                '0x4ec3af0acbad1ae467ad569337d2fe8576fe303928d35b8cdd91de47e9ac84bb',
            receiptsRoot:
                '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
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
            parentID:
                '0x000000019015bbd98fc1c9088d793ba9add53896a29cd9aa3a4dcabd1f561c38',
            timestamp: 1530014420,
            gasLimit: 10000000,
            beneficiary: '0xb4094c25f86d628fdd571afc4077f0d0196afb48',
            gasUsed: 0,
            totalScore: 2,
            txsRoot:
                '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            txsFeatures: 0,
            stateRoot:
                '0x4ec3af0acbad1ae467ad569337d2fe8576fe303928d35b8cdd91de47e9ac84bb',
            receiptsRoot:
                '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            com: false,
            signer: '0x25ae0ef84da4a76d5a1dfe80d3789c2c46fee30a',
            isTrunk: true,
            isFinalized: true,
            transactions: []
        }
    },
    {
        revision:
            '0x01038ee9f989843a7beb3897232f4fd9ac0bc4897545b9c3151f82ece45c9628',
        expanded: true,
        expected: {
            number: 17010409,
            id: '0x01038ee9f989843a7beb3897232f4fd9ac0bc4897545b9c3151f82ece45c9628',
            size: 494,
            parentID:
                '0x01038ee8daf9f3094b55fda706f17ba74845eaa57fb5247d2a9997c374906509',
            timestamp: 1700135460,
            gasLimit: 30000000,
            beneficiary: '0xb4094c25f86d628fdd571afc4077f0d0196afb48',
            gasUsed: 21000,
            totalScore: 132697198,
            txsRoot:
                '0x21f1dc5a129d3ce558a1cbd6abd9b6baabd024e1deba7c6b285ade1b71762a9f',
            txsFeatures: 1,
            stateRoot:
                '0xd5793ff22938f2d875ae4c33b6d95356450397225bfc69e97b5f1b8f26eedb0f',
            receiptsRoot:
                '0xc49772fc8a4013db440de4014b4492dec2516f8ae878d69c6e4a1fd8e8018c75',
            com: true,
            signer: '0xab7b27fc9e7d29f9f2e5bd361747a5515d0cc2d1',
            isTrunk: true,
            isFinalized: true,
            transactions: [
                {
                    id: '0x42720d768659aabff05c456acdd4e1f5c5672740a3728fbc0681117e4868167f',
                    chainTag: 39,
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
                    delegator: null,
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
                                    recipient:
                                        '0x9840acbcd7417ceee8117da585a3c3f6642c8a52',
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

const invalidBlockRevisions = [
    {
        description: 'Should throw error for invalid revision',
        revision: 'invalid-revision',
        expectedError: InvalidDataTypeError
    }
];

export { waitForBlockTestCases, validBlockRevisions, invalidBlockRevisions };
