import {
    type CompressedBlockDetail,
    type ExpandedBlockDetail,
    type TransactionDetailNoRaw
} from '../../../src';

/**
 * Block fixtures
 */
const blockFixtures = [
    // Compressed block without transactions
    {
        testName: 'Compressed block without transactions',
        block: {
            number: 0,
            id: '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127',
            size: 170,
            parentID:
                '0xffffffff00000000000000000000000000000000000000000000000000000000',
            timestamp: 1530014400,
            gasLimit: 10000000,
            beneficiary: '0x0000000000000000000000000000000000000000',
            gasUsed: 0,
            totalScore: 0,
            txsRoot:
                '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            txsFeatures: 0,
            stateRoot:
                '0x4ec3af0acbad1ae467ad569337d2fe8576fe303928d35b8cdd91de47e9ac84bb',
            receiptsRoot:
                '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            com: false,
            signer: '0x0000000000000000000000000000000000000000',
            isTrunk: true,
            isFinalized: true,
            transactions: []
        } satisfies CompressedBlockDetail,
        expected: {
            hash: '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127',
            parentHash:
                '0xffffffff00000000000000000000000000000000000000000000000000000000',
            number: '0x0',
            size: '0xaa',
            stateRoot:
                '0x4ec3af0acbad1ae467ad569337d2fe8576fe303928d35b8cdd91de47e9ac84bb',
            receiptsRoot:
                '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            transactionsRoot:
                '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            timestamp: '0x5b322ac0',
            gasLimit: '0x989680',
            gasUsed: '0x0',
            transactions: [],
            miner: '0x0000000000000000000000000000000000000000',
            difficulty: '0x0',
            totalDifficulty: '0x0',
            uncles: [],
            sha3Uncles:
                '0x0000000000000000000000000000000000000000000000000000000000000000',
            nonce: '0x0000000000000000',
            logsBloom:
                '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
            extraData: '0x',
            baseFeePerGas: '0x0',
            mixHash:
                '0x0000000000000000000000000000000000000000000000000000000000000000'
        }
    },
    // Compressed block with transactions
    {
        testName: 'Compressed block with transactions',
        block: {
            number: 0,
            id: '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127',
            size: 170,
            parentID:
                '0xffffffff00000000000000000000000000000000000000000000000000000000',
            timestamp: 1530014400,
            gasLimit: 10000000,
            beneficiary: '0x0000000000000000000000000000000000000000',
            gasUsed: 0,
            totalScore: 0,
            txsRoot:
                '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            txsFeatures: 0,
            stateRoot:
                '0x4ec3af0acbad1ae467ad569337d2fe8576fe303928d35b8cdd91de47e9ac84bb',
            receiptsRoot:
                '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            com: false,
            signer: '0x0000000000000000000000000000000000000000',
            isTrunk: true,
            isFinalized: true,
            transactions: [
                '0x6994801b6f92f9a0a151ab4ac1c27d2dcf2ab61245b10ddf05504ae5384e759d',
                '0xd331443a31ef1f32e2c4510710e62561012de11ef404c35086629436e4d5dded'
            ]
        } satisfies CompressedBlockDetail,
        expected: {
            hash: '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127',
            parentHash:
                '0xffffffff00000000000000000000000000000000000000000000000000000000',
            number: '0x0',
            size: '0xaa',
            stateRoot:
                '0x4ec3af0acbad1ae467ad569337d2fe8576fe303928d35b8cdd91de47e9ac84bb',
            receiptsRoot:
                '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            transactionsRoot:
                '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            timestamp: '0x5b322ac0',
            gasLimit: '0x989680',
            gasUsed: '0x0',
            transactions: [
                '0x6994801b6f92f9a0a151ab4ac1c27d2dcf2ab61245b10ddf05504ae5384e759d',
                '0xd331443a31ef1f32e2c4510710e62561012de11ef404c35086629436e4d5dded'
            ],
            miner: '0x0000000000000000000000000000000000000000',
            difficulty: '0x0',
            totalDifficulty: '0x0',
            uncles: [],
            sha3Uncles:
                '0x0000000000000000000000000000000000000000000000000000000000000000',
            nonce: '0x0000000000000000',
            logsBloom:
                '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
            extraData: '0x',
            baseFeePerGas: '0x0',
            mixHash:
                '0x0000000000000000000000000000000000000000000000000000000000000000'
        }
    },
    // Expanded block with transactions
    {
        testName: 'Expanded block with transactions',
        block: {
            number: 0,
            id: '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127',
            size: 170,
            parentID:
                '0xffffffff00000000000000000000000000000000000000000000000000000000',
            timestamp: 1530014400,
            gasLimit: 10000000,
            beneficiary: '0x0000000000000000000000000000000000000000',
            gasUsed: 0,
            totalScore: 0,
            txsRoot:
                '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            txsFeatures: 0,
            stateRoot:
                '0x4ec3af0acbad1ae467ad569337d2fe8576fe303928d35b8cdd91de47e9ac84bb',
            receiptsRoot:
                '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            com: false,
            signer: '0x0000000000000000000000000000000000000000',
            isTrunk: true,
            isFinalized: true,
            transactions: [
                {
                    id: '0xd331443a31ef1f32e2c4510710e62561012de11ef404c35086629436e4d5dded',
                    chainTag: '39',
                    blockRef: '0x010b7a6c0bb58653',
                    expiration: 18,
                    clauses: [
                        {
                            to: '0x6e1ffe60656421eb12de92433c5a319ba606bb81',
                            value: '0x0',
                            data: '0xd547741f3c11d16cbaffd01df69ce1c404f6340ee057498f5f00246190ea54220576a84800000000000000000000000042f51a1de771c41157be6129ba7b1756da2f8290'
                        }
                    ],
                    gasPriceCoef: 64,
                    gas: 29750,
                    origin: '0x7487d912d03ab9de786278f679592b3730bdd540',
                    delegator: '',
                    nonce: '0xb8314776ce0bf5df',
                    dependsOn: 'null',
                    size: 191,
                    gasUsed: 24792,
                    gasPayer: '0x7487d912d03ab9de786278f679592b3730bdd540',
                    paid: '0x44dd97802ba8700',
                    reward: '0x14a8e0a6737f54c',
                    reverted: false,
                    outputs: [
                        {
                            contractAddress: null,
                            events: [],
                            transfers: []
                        }
                    ]
                },
                {
                    id: '0x6994801b6f92f9a0a151ab4ac1c27d2dcf2ab61245b10ddf05504ae5384e759d',
                    chainTag: '39',
                    blockRef: '0x010b7a6c0bb58653',
                    expiration: 18,
                    clauses: [
                        {
                            to: '0x6e1ffe60656421eb12de92433c5a319ba606bb81',
                            value: '0x0',
                            data: '0x799161d500000000000000000000000042f51a1de771c41157be6129ba7b1756da2f8290'
                        },
                        {
                            to: '0x6e1ffe60656421eb12de92433c5a319ba606bb81',
                            value: '0x0',
                            data: '0x799161d500000000000000000000000042f51a1de771c41157be6129ba7b1756da2f8290'
                        }
                    ],
                    gasPriceCoef: 64,
                    gas: 48432,
                    origin: '0x7487d912d03ab9de786278f679592b3730bdd540',
                    delegator: 'null',
                    nonce: '0x176bbcbf79a3a672',
                    dependsOn: 'null',
                    size: 219,
                    gasUsed: 40360,
                    gasPayer: '0x7487d912d03ab9de786278f679592b3730bdd540',
                    paid: '0x701bff39d048900',
                    reward: '0x21a1ffc48b48f80',
                    reverted: false,
                    outputs: [
                        {
                            contractAddress: null,
                            events: [],
                            transfers: []
                        },
                        {
                            contractAddress: null,
                            events: [],
                            transfers: []
                        }
                    ]
                }
            ]
        } satisfies ExpandedBlockDetail,
        expected: {
            hash: '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127',
            parentHash:
                '0xffffffff00000000000000000000000000000000000000000000000000000000',
            number: '0x0',
            size: '0xaa',
            stateRoot:
                '0x4ec3af0acbad1ae467ad569337d2fe8576fe303928d35b8cdd91de47e9ac84bb',
            receiptsRoot:
                '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            transactionsRoot:
                '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            timestamp: '0x5b322ac0',
            gasLimit: '0x989680',
            gasUsed: '0x0',
            transactions: [
                {
                    blockHash:
                        '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127',
                    blockNumber: '0x0',
                    from: '0x7487d912d03ab9de786278f679592b3730bdd540',
                    gas: '0x7436',
                    chainId: '0x0',
                    hash: '0xd331443a31ef1f32e2c4510710e62561012de11ef404c35086629436e4d5dded',
                    nonce: '0xb8314776ce0bf5df',
                    transactionIndex: '0x0',
                    input: '0xd547741f3c11d16cbaffd01df69ce1c404f6340ee057498f5f00246190ea54220576a84800000000000000000000000042f51a1de771c41157be6129ba7b1756da2f8290',
                    to: '0x6e1ffe60656421eb12de92433c5a319ba606bb81',
                    value: '0x0',
                    gasPrice: '0x0',
                    type: '0x0',
                    v: '0x0',
                    r: '0x0',
                    s: '0x0',
                    accessList: [],
                    maxFeePerGas: '0x0',
                    maxPriorityFeePerGas: '0x0',
                    yParity: '0x0'
                },
                {
                    blockHash:
                        '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127',
                    blockNumber: '0x0',
                    from: '0x7487d912d03ab9de786278f679592b3730bdd540',
                    gas: '0xbd30',
                    chainId: '0x0',
                    hash: '0x6994801b6f92f9a0a151ab4ac1c27d2dcf2ab61245b10ddf05504ae5384e759d',
                    nonce: '0x176bbcbf79a3a672',
                    transactionIndex: '0x1',
                    input: '0x799161d500000000000000000000000042f51a1de771c41157be6129ba7b1756da2f8290',
                    to: '0x6e1ffe60656421eb12de92433c5a319ba606bb81',
                    value: '0x0',
                    gasPrice: '0x0',
                    type: '0x0',
                    v: '0x0',
                    r: '0x0',
                    s: '0x0',
                    accessList: [],
                    maxFeePerGas: '0x0',
                    maxPriorityFeePerGas: '0x0',
                    yParity: '0x0'
                }
            ],
            miner: '0x0000000000000000000000000000000000000000',
            difficulty: '0x0',
            totalDifficulty: '0x0',
            uncles: [],
            sha3Uncles:
                '0x0000000000000000000000000000000000000000000000000000000000000000',
            nonce: '0x0000000000000000',
            logsBloom:
                '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
            extraData: '0x',
            baseFeePerGas: '0x0',
            mixHash:
                '0x0000000000000000000000000000000000000000000000000000000000000000'
        }
    }
];

/**
 * Transaction fixtures
 */
const transactionFixtures = [
    {
        testName: 'No clauses transaction',
        transaction: {
            id: '0xb2e3f6e9782f462d797b72f9cbf5a4c38ca20cabcc1a091f9de6d3e6736c1f7c',
            chainTag: 39,
            blockRef: '0x010b7b5e57827fe3',
            expiration: 18,
            type: 0,
            clauses: [],
            gasPriceCoef: 0,
            gas: 399535,
            origin: '0x8c59c63d6458c71b6ff88d57698437524a703084',
            gasPayer: null,
            nonce: '0x19b4782',
            dependsOn: null,
            size: 709,
            meta: {
                blockID:
                    '0x010b7b5f0192003f70bf2a6a502221e075cb32d676e3443614d21003cc2ee440',
                blockNumber: 17529695,
                blockTimestamp: 1705328340
            }
        } satisfies TransactionDetailNoRaw,
        expected: {
            blockHash:
                '0x010b7b5f0192003f70bf2a6a502221e075cb32d676e3443614d21003cc2ee440',
            blockNumber: '0x10b7b5f',
            from: '0x8c59c63d6458c71b6ff88d57698437524a703084',
            gas: '0x618af',
            chainId: '0x0',
            hash: '0xb2e3f6e9782f462d797b72f9cbf5a4c38ca20cabcc1a091f9de6d3e6736c1f7c',
            nonce: '0x19b4782',
            transactionIndex: '0x0',
            input: '',
            to: null,
            value: '',
            gasPrice: '0x0',
            type: '0x0',
            v: '0x0',
            r: '0x0',
            s: '0x0',
            accessList: [],
            maxFeePerGas: '0x0',
            maxPriorityFeePerGas: '0x0',
            yParity: '0x0'
        }
    }
];

export { blockFixtures, transactionFixtures };
