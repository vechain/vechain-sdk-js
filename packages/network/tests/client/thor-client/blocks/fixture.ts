import { InvalidDataTypeError } from '@vechainfoundation/vechain-sdk-errors';

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
    }
];

const invalidBlockRevisions = [
    {
        description: 'Should throw error for invalid revision',
        revision: 'invalid-revision',
        expectedError: InvalidDataTypeError
    }
];

export { validBlockRevisions, invalidBlockRevisions };
