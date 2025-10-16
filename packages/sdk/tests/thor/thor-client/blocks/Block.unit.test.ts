import { describe, expect, test } from '@jest/globals';
import {
    ExpandedBlockResponse,
    RawBlockResponse,
    RegularBlockResponse
} from '@thor/thorest/blocks/response';
import {
    type RegularBlockResponseJSON,
    type ExpandedBlockResponseJSON,
    type RawBlockJSON
} from '@thor/thorest/json';
import { Block } from '@thor/thor-client/model/blocks/Block';
import {
    BlockTransaction,
    ExpandedBlock,
    RawBlock
} from '@thor/thor-client/model';
import { BlockRef, Hex } from '@common/vcdm';

// test response for a regular block
const regularBlockPayload: RegularBlockResponseJSON = {
    number: 22949072,
    id: '0x015e2cd091c90918f652bd9778e4eeaed20cc6062603fe80b0f256262922deec',
    size: 24080,
    parentID:
        '0x015e2ccf284fe12bcf284c5dba35cc53acc48ecd82756cb2878e00bc85a26a79',
    timestamp: 1760021310,
    gasLimit: '40000000',
    beneficiary: '0xdfc37a728cd3b263223d5cbeffd336ba812f1120',
    gasUsed: '4173176',
    totalScore: 2242252163,
    txsRoot:
        '0x2327bcd6bb9a613d2963e74364588c5867fca8378de5d1e9b83f724148a6c5eb',
    txsFeatures: 1,
    stateRoot:
        '0xea757708c45b872ee2fcc9027cee3c8decba2fcf55f7c88b927a8da34c5e9d9c',
    receiptsRoot:
        '0x09e3b0097cf9a387e1c007878e44c078c3dd70115ef5dcc6223dd7ede2ba517d',
    com: true,
    signer: '0x117683ddb6d2254084257617a9d54faf5dee0f67',
    isTrunk: true,
    isFinalized: false,
    baseFeePerGas: '0x9184e72a000',
    transactions: [
        '0x4310ac5cf7a03bf7b2ed4cc7e25a21340491340bab47af844800a0c514af4e76',
        '0x6fd258fa4aa6195c1143c9e51dc06d93e3b0f6ef057052ba1458ce193acbe850',
        '0x7f8329c49b7b6e6eb203ddb1452f8545425134d5e2e9d7c59c9ea92d4e4f020b',
        '0x02b9c66ae43273241888d0facf5c432f1638b95ced1fcdabec2491ee50841e0c',
        '0x4df579834e20de3a31f2dc8914f5f7beadadce68e1ec69c71cd57e066f6c846b',
        '0x0a7d71f9c7a294200b65ef2afb5cd0c4c4fe91e17106297371052d9935176ac5',
        '0x95e695f11d3fb0fdd6d25c1b7faf21f1e39931a7fdb18620587caee9fc82fa1a',
        '0xc52afcb4d0bc1f2e5423a3aea43616ca8fd1b425b8f5c4e9262d9320104b3d76',
        '0x9fdf74b292b6a81acc3af68e37217f6949d615af4c54ecb304bef568dfe9b029',
        '0x526093b2e752892075f93cff8520c1a81c12b2493d64803332158ac8604e14cb',
        '0xe190d96fff2103eeb0e9e32f4118fbc8bd6b03b4ca943292ff723cc429041783',
        '0x08826bb6f4decebbbcc8edf78d68b54b7c71d4f315ef50eec7f9357e47698495',
        '0x4fd54f876add9a32f2883b4d93f9ad808a245aa7a896cb516f9f41d161b8cd12',
        '0xb96cfaf10d4ddaddb7ee8d905c38009181ba76cf0f653e7452035fb32557f334',
        '0xed6a4c705baa733f4cc06ac1e89b64314bc4c1de9af56489ffc566d3028d18f8',
        '0x4b667ec7aa3bd636295d0e902b46185195eb8b140027b3762b79a716bd0370c1',
        '0xab36fcc61f6908ac1e1449c255b0efac2b07f73e1ad4fdce0579efacbf6661ad',
        '0x694f798fb8ff3eb5264d1175c2dbd9d969f66344d2036ba17078caf229135cf9',
        '0x0f35323527e0dea0b58ebd25b4f3c4b5163508b822ccb2c41f1548dd8bcacfa9'
    ]
} satisfies RegularBlockResponseJSON;

// test response for an expanded block
const expandedBlockPayload: ExpandedBlockResponseJSON = {
    number: 22949072,
    id: '0x015e2cd091c90918f652bd9778e4eeaed20cc6062603fe80b0f256262922deec',
    size: 24080,
    parentID:
        '0x015e2ccf284fe12bcf284c5dba35cc53acc48ecd82756cb2878e00bc85a26a79',
    timestamp: 1760021310,
    gasLimit: '40000000',
    beneficiary: '0xdfc37a728cd3b263223d5cbeffd336ba812f1120',
    gasUsed: '4173176',
    totalScore: 2242252163,
    txsRoot:
        '0x2327bcd6bb9a613d2963e74364588c5867fca8378de5d1e9b83f724148a6c5eb',
    txsFeatures: 1,
    stateRoot:
        '0xea757708c45b872ee2fcc9027cee3c8decba2fcf55f7c88b927a8da34c5e9d9c',
    receiptsRoot:
        '0x09e3b0097cf9a387e1c007878e44c078c3dd70115ef5dcc6223dd7ede2ba517d',
    com: true,
    signer: '0x117683ddb6d2254084257617a9d54faf5dee0f67',
    isTrunk: true,
    isFinalized: false,
    baseFeePerGas: '0x9184e72a000',
    transactions: [
        {
            id: '0x4310ac5cf7a03bf7b2ed4cc7e25a21340491340bab47af844800a0c514af4e76',
            type: 81,
            chainTag: 74,
            blockRef: '0x015e2ccf284fe12b',
            expiration: 32,
            clauses: [
                {
                    to: '0xb6f43457600b1f3b7b98fc4394a9f1134ffc721d',
                    value: '0x0',
                    data: '0xe7568221000000000000000000000000f248369f450e304163bdf9239ea19fb952b9634c00000000000000000000000000000000000000000000000000e14211b8b906a200000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000014c7b2276657273696f6e223a322c226465736372697074696f6e223a225468697320697320612070686f746f206f662061207265757361626c65206375702c20726561642061626f757420746865207374756479206f6e20696d706163747320686572653a2068747470733a2f2f6b6565706375702d73747564792e73332e65752d6e6f7274682d312e616d617a6f6e6177732e636f6d2f4b6565704375702b4c43412b5265706f72742e706466222c2270726f6f66223a7b22696d616765223a2268747470733a2f2f626c75727265642d6d756773686f74732e73332e65752d6e6f7274682d312e616d617a6f6e6177732e636f6d2f313736303032313330353330375f696d6167652e706e67227d2c22696d70616374223a7b22636172626f6e223a33372c22656e65726779223a3236332c2274696d626572223a32332c22706c6173746963223a337d7d0000000000000000000000000000000000000000'
                }
            ],
            maxFeePerGas: '0xa3d6ca4699c',
            maxPriorityFeePerGas: '0xdb89ee99c',
            gas: '258324',
            origin: '0xbfe2122a82c0aea091514f57c7713c3118101eda',
            delegator: null,
            nonce: '0xe622334219e4d935',
            dependsOn: null,
            size: 689,
            gasUsed: 157216,
            gasPayer: '0xbfe2122a82c0aea091514f57c7713c3118101eda',
            paid: '0x15f259b4f23d5b80',
            reward: '0x20ea8438295b80',
            reverted: false,
            outputs: [
                {
                    contractAddress: null,
                    events: [
                        {
                            address:
                                '0x6bee7ddab6c99d5b2af0554eaea484ce18f52631',
                            topics: [
                                '0x4811710b0c25cc7e05baf214b3a939cf893f1cbff4d0b219e680f069a4f204a2',
                                '0x2fc30c2ad41a2994061efaf218f1d52dc92bc4a31a0f02a4916490076a7a393a',
                                '0x000000000000000000000000f248369f450e304163bdf9239ea19fb952b9634c',
                                '0x000000000000000000000000b6f43457600b1f3b7b98fc4394a9f1134ffc721d'
                            ],
                            data: '0x00000000000000000000000000000000000000000000000000e14211b8b906a20000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000014c7b2276657273696f6e223a322c226465736372697074696f6e223a225468697320697320612070686f746f206f662061207265757361626c65206375702c20726561642061626f757420746865207374756479206f6e20696d706163747320686572653a2068747470733a2f2f6b6565706375702d73747564792e73332e65752d6e6f7274682d312e616d617a6f6e6177732e636f6d2f4b6565704375702b4c43412b5265706f72742e706466222c2270726f6f66223a7b22696d616765223a2268747470733a2f2f626c75727265642d6d756773686f74732e73332e65752d6e6f7274682d312e616d617a6f6e6177732e636f6d2f313736303032313330353330375f696d6167652e706e67227d2c22696d70616374223a7b22636172626f6e223a33372c22656e65726779223a3236332c2274696d626572223a32332c22706c6173746963223a337d7d0000000000000000000000000000000000000000'
                        },
                        {
                            address:
                                '0x5ef79995fe8a89e0812330e4378eb2660cede699',
                            topics: [
                                '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                                '0x0000000000000000000000006bee7ddab6c99d5b2af0554eaea484ce18f52631',
                                '0x000000000000000000000000f248369f450e304163bdf9239ea19fb952b9634c'
                            ],
                            data: '0x00000000000000000000000000000000000000000000000000e14211b8b906a2'
                        },
                        {
                            address:
                                '0x35a267671d8edd607b2056a9a13e7ba7cf53c8b3',
                            topics: [
                                '0x51ea9b7b791d42c8517fa7a13074dced51d4cc9afa4bdf03ea0371a0244f1331',
                                '0x000000000000000000000000f248369f450e304163bdf9239ea19fb952b9634c',
                                '0x2fc30c2ad41a2994061efaf218f1d52dc92bc4a31a0f02a4916490076a7a393a',
                                '0x0000000000000000000000000000000000000000000000000000000000000043'
                            ],
                            data: '0x000000000000000000000000f248369f450e304163bdf9239ea19fb952b9634c0000000000000000000000000000000000000000000000000000000000000064'
                        },
                        {
                            address:
                                '0xb6f43457600b1f3b7b98fc4394a9f1134ffc721d',
                            topics: [
                                '0xeb38c32b45ff6288c16088268c0924167329b73855d3b7de03f8abd4c680680b',
                                '0x000000000000000000000000f248369f450e304163bdf9239ea19fb952b9634c'
                            ],
                            data: '0x00000000000000000000000000000000000000000000000000e14211b8b906a200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001'
                        }
                    ],
                    transfers: []
                }
            ]
        },
        {
            id: '0x6fd258fa4aa6195c1143c9e51dc06d93e3b0f6ef057052ba1458ce193acbe850',
            type: 81,
            chainTag: 74,
            blockRef: '0x015e2ccf284fe12b',
            expiration: 32,
            clauses: [
                {
                    to: '0x8a8b4f43afc23bb62d600a27f71179fea6877c3a',
                    value: '0x0',
                    data: '0x904b5f5a00000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000180000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000002e0000000000000000000000000000000000000000000000000000000000000036000000000000000000000000000000000000000000000000000000000000003a0f5893b5fbb8c2768c371ffce5a7298ee045698b342e43ddcad3eb420729c9736000000000000000000000000b0f402f240151388d559469e5cf4475694aca9a600000000000000000000000000000000000000000000000007a1fe16027700000000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000001330382d31302d323032352031353a31353a303000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000005696d61676500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000007568747470733a2f2f73746f726167652e676f6f676c65617069732e636f6d2f676372656365697074732d7075626c69632f323032352d31302d30392f313736303032313330345f3078623066343032663234303135313338386435353934363965356366343437353639346163613961362e6a70670000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000006636172626f6e00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000089800000000000000000000000000000000000000000000000000000000000000355468652075736572206d6164652061207075726368617365206661766f72696e67207375737461696e61626c652063686f696365730000000000000000000000'
                }
            ],
            maxFeePerGas: '0xa3d6ca4699c',
            maxPriorityFeePerGas: '0xdb89ee99c',
            gas: 414871,
            origin: '0xf901020a285e4980b1e8cdcfa7645970bf37c56c',
            delegator: null,
            nonce: '0x4a545c05bb1e',
            dependsOn: null,
            size: 1167,
            gasUsed: 399871,
            gasPayer: '0xf901020a285e4980b1e8cdcfa7645970bf37c56c',
            paid: '0x37d1fdfafa904e64',
            reward: '0x53b86be4c2ee64',
            reverted: false,
            outputs: [
                {
                    contractAddress: null,
                    events: [
                        {
                            address:
                                '0x6bee7ddab6c99d5b2af0554eaea484ce18f52631',
                            topics: [
                                '0x4811710b0c25cc7e05baf214b3a939cf893f1cbff4d0b219e680f069a4f204a2',
                                '0x9643ed1637948cc571b23f836ade2bdb104de88e627fa6e8e3ffef1ee5a1739a',
                                '0x000000000000000000000000b0f402f240151388d559469e5cf4475694aca9a6',
                                '0x0000000000000000000000008a8b4f43afc23bb62d600a27f71179fea6877c3a'
                            ],
                            data: '0x00000000000000000000000000000000000000000000000007a1fe1602770000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000fa7b2276657273696f6e223a20322c226465736372697074696f6e223a20225468652075736572206d6164652061207075726368617365206661766f72696e67207375737461696e61626c652063686f69636573222c2270726f6f66223a207b22696d616765223a2268747470733a2f2f73746f726167652e676f6f676c65617069732e636f6d2f676372656365697074732d7075626c69632f323032352d31302d30392f313736303032313330345f3078623066343032663234303135313338386435353934363965356366343437353639346163613961362e6a7067227d2c22696d70616374223a207b22636172626f6e223a323230307d7d000000000000'
                        },
                        {
                            address:
                                '0x5ef79995fe8a89e0812330e4378eb2660cede699',
                            topics: [
                                '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                                '0x0000000000000000000000006bee7ddab6c99d5b2af0554eaea484ce18f52631',
                                '0x000000000000000000000000b0f402f240151388d559469e5cf4475694aca9a6'
                            ],
                            data: '0x00000000000000000000000000000000000000000000000007a1fe1602770000'
                        },
                        {
                            address:
                                '0x35a267671d8edd607b2056a9a13e7ba7cf53c8b3',
                            topics: [
                                '0x51ea9b7b791d42c8517fa7a13074dced51d4cc9afa4bdf03ea0371a0244f1331',
                                '0x000000000000000000000000b0f402f240151388d559469e5cf4475694aca9a6',
                                '0x9643ed1637948cc571b23f836ade2bdb104de88e627fa6e8e3ffef1ee5a1739a',
                                '0x0000000000000000000000000000000000000000000000000000000000000043'
                            ],
                            data: '0x000000000000000000000000b0f402f240151388d559469e5cf4475694aca9a60000000000000000000000000000000000000000000000000000000000000064'
                        },
                        {
                            address:
                                '0x8a8b4f43afc23bb62d600a27f71179fea6877c3a',
                            topics: [
                                '0xd3e460efbe4cdc5266b612e0092b0ac427d0e403f61a190156f6336d46398de3'
                            ],
                            data: '0xf5893b5fbb8c2768c371ffce5a7298ee045698b342e43ddcad3eb420729c973600000000000000000000000000000000000000000000000007a1fe1602770000000000000000000000000000b0f402f240151388d559469e5cf4475694aca9a6'
                        }
                    ],
                    transfers: []
                }
            ]
        }
    ]
};

/**
 * @group unit
 */
describe('Block class unit tests', () => {
    test('can instanciate a regular block', () => {
        // create a new instance of the class from the thorest response
        const block = Block.fromResponse(
            new RegularBlockResponse(regularBlockPayload)
        );
        expect(block).toBeInstanceOf(Block);
        expect(block?.id.toString()).toBe(regularBlockPayload.id);
        expect(block?.transactions.at(0)?.toString()).toBe(
            regularBlockPayload.transactions[0]
        );
        expect(block?.baseFeePerGas?.toString()).toBe(
            Hex.of(regularBlockPayload.baseFeePerGas ?? '0x0').bi.toString()
        );
    });
    test('can instanciate an expanded block', () => {
        // create a new instance of the class from the thorest response
        const block = ExpandedBlock.fromResponse(
            new ExpandedBlockResponse(expandedBlockPayload)
        );
        expect(block).toBeInstanceOf(ExpandedBlock);
        expect(block?.isFinalized).toEqual(false);
        expect(block?.transactions.at(0)).toBeInstanceOf(BlockTransaction);
    });
    test('can instanciate a raw block', () => {
        const payload: RawBlockJSON = {
            raw: '0xabcdef'
        };
        // create a new instance of the class from the thorest response
        const block = RawBlock.fromResponse(new RawBlockResponse(payload));
        expect(block).toBeInstanceOf(RawBlock);
        expect(block?.raw.toString()).toEqual('0xabcdef');
    });
    test('can get the block ref', () => {
        // create a new instance of the class from the thorest response
        const block = Block.fromResponse(
            new RegularBlockResponse(regularBlockPayload)
        );
        const blockRef = block?.getBlockRef();
        expect(blockRef).toBeInstanceOf(BlockRef);
        expect(blockRef?.toString()).toEqual('0x015e2cd091c90918');
    });
});
