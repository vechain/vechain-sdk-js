import { HttpClient } from '@vechain/vechain-sdk-network';

/**
 * Url of the testnet fixture
 */
const testnetUrl = 'https://testnet.vechain.org';

/**
 * Url of the solo network fixture
 */
const soloUrl = 'http://localhost:8669';

/**
 * Network instance fixture
 */
const testNetwork = new HttpClient(testnetUrl);

/**
 * Solo network instance fixture
 */
const soloNetwork = new HttpClient(soloUrl);

/**
 * Simple test account fixture
 */
const testAccount = '0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa';

/**
 * Block with transactions expanded fixture
 */
const blockWithTransactionsExpanded = {
    hash: '0x010b7a6d6f04407ac2f72e505ff83d49db8d01607f8af41f508b2ca7eca0d450',
    parentHash:
        '0x010b7a6c0bb58653b6f8498fc1607e5536c1fa69217cad09f6eb13084263af8c',
    number: '0x10b7a6d',
    size: '0x426',
    stateRoot:
        '0xa143fee4f9fb346d39c677c64a97253b2630634163cb4f70b2f2ee51881f3a82',
    receiptsRoot:
        '0xe77f938c98f4c4aa4237b6d0c7bc3dd8b8fd5b3db6dfb000ab6f646115baa3ee',
    transactionsRoot:
        '0x23128986cb0a75f076a3614881b1a5779571ba0a2627fc3f0f58244c45074af4',
    timestamp: '0x65a53560',
    gasLimit: '0x1c9c380',
    gasUsed: '0x1ace8',
    transactions: [
        {
            blockHash:
                '0x010b7a6d6f04407ac2f72e505ff83d49db8d01607f8af41f508b2ca7eca0d450',
            blockNumber: '0x10b7a6d',
            from: '0x7487d912d03ab9de786278f679592b3730bdd540',
            gas: '0x7436',
            chainId:
                '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127',
            hash: '0xd331443a31ef1f32e2c4510710e62561012de11ef404c35086629436e4d5dded',
            nonce: '0xb8314776ce0bf5df',
            transactionIndex: '0x0',
            input: '0xd547741f3c11d16cbaffd01df69ce1c404f6340ee057498f5f00246190ea54220576a84800000000000000000000000042f51a1de771c41157be6129ba7b1756da2f8290',
            to: '0x6e1ffe60656421eb12de92433c5a319ba606bb81',
            value: '0x0',
            gasPrice: '0x',
            type: '0x',
            v: '0x',
            r: '0x',
            s: '0x',
            accessList: [],
            maxFeePerGas: '0x',
            maxPriorityFeePerGas: '0x',
            yParity: '0x'
        },
        {
            blockHash:
                '0x010b7a6d6f04407ac2f72e505ff83d49db8d01607f8af41f508b2ca7eca0d450',
            blockNumber: '0x10b7a6d',
            from: '0x7487d912d03ab9de786278f679592b3730bdd540',
            gas: '0xbd30',
            chainId:
                '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127',
            hash: '0x6994801b6f92f9a0a151ab4ac1c27d2dcf2ab61245b10ddf05504ae5384e759d',
            nonce: '0x176bbcbf79a3a672',
            transactionIndex: '0x1',
            input: '0x799161d500000000000000000000000042f51a1de771c41157be6129ba7b1756da2f8290',
            to: '0x6e1ffe60656421eb12de92433c5a319ba606bb81',
            value: '0x0',
            gasPrice: '0x',
            type: '0x',
            v: '0x',
            r: '0x',
            s: '0x',
            accessList: [],
            maxFeePerGas: '0x',
            maxPriorityFeePerGas: '0x',
            yParity: '0x'
        },
        {
            blockHash:
                '0x010b7a6d6f04407ac2f72e505ff83d49db8d01607f8af41f508b2ca7eca0d450',
            blockNumber: '0x10b7a6d',
            from: '0x7487d912d03ab9de786278f679592b3730bdd540',
            gas: '0xd14a',
            chainId:
                '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127',
            hash: '0xb476d1a43b8632c25a581465c944a1cb5dd99e48d41d326a250847a0a279afa5',
            nonce: '0x7022eb9454a648b9',
            transactionIndex: '0x2',
            input: '0x2f2ff15d3c11d16cbaffd01df69ce1c404f6340ee057498f5f00246190ea54220576a84800000000000000000000000042f51a1de771c41157be6129ba7b1756da2f8290',
            to: '0x6e1ffe60656421eb12de92433c5a319ba606bb81',
            value: '0x0',
            gasPrice: '0x',
            type: '0x',
            v: '0x',
            r: '0x',
            s: '0x',
            accessList: [],
            maxFeePerGas: '0x',
            maxPriorityFeePerGas: '0x',
            yParity: '0x'
        }
    ],
    miner: '0xb4094c25f86d628fdd571afc4077f0d0196afb48',
    difficulty: '0x',
    totalDifficulty: '0x',
    uncles: [],
    sha3Uncles:
        '0x0000000000000000000000000000000000000000000000000000000000000000',
    nonce: '0x0000000000000000',
    logsBloom:
        '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    extraData: '0x',
    baseFeePerGas: '0x',
    mixHash:
        '0x0000000000000000000000000000000000000000000000000000000000000000'
};

/**
 * Block with transactions not expanded fixture
 */
const blockWithTransactionsNotExpanded = {
    hash: '0x010b7a6d6f04407ac2f72e505ff83d49db8d01607f8af41f508b2ca7eca0d450',
    parentHash:
        '0x010b7a6c0bb58653b6f8498fc1607e5536c1fa69217cad09f6eb13084263af8c',
    number: '0x10b7a6d',
    size: '0x426',
    stateRoot:
        '0xa143fee4f9fb346d39c677c64a97253b2630634163cb4f70b2f2ee51881f3a82',
    receiptsRoot:
        '0xe77f938c98f4c4aa4237b6d0c7bc3dd8b8fd5b3db6dfb000ab6f646115baa3ee',
    transactionsRoot:
        '0x23128986cb0a75f076a3614881b1a5779571ba0a2627fc3f0f58244c45074af4',
    timestamp: '0x65a53560',
    gasLimit: '0x1c9c380',
    gasUsed: '0x1ace8',
    transactions: [
        '0xd331443a31ef1f32e2c4510710e62561012de11ef404c35086629436e4d5dded',
        '0x6994801b6f92f9a0a151ab4ac1c27d2dcf2ab61245b10ddf05504ae5384e759d',
        '0xb476d1a43b8632c25a581465c944a1cb5dd99e48d41d326a250847a0a279afa5'
    ],
    miner: '0xb4094c25f86d628fdd571afc4077f0d0196afb48',
    difficulty: '0x',
    totalDifficulty: '0x',
    uncles: [],
    sha3Uncles:
        '0x0000000000000000000000000000000000000000000000000000000000000000',
    nonce: '0x0000000000000000',
    logsBloom:
        '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    extraData: '0x',
    baseFeePerGas: '0x',
    mixHash:
        '0x0000000000000000000000000000000000000000000000000000000000000000'
};

export {
    testnetUrl,
    soloUrl,
    testNetwork,
    soloNetwork,
    testAccount,
    blockWithTransactionsExpanded,
    blockWithTransactionsNotExpanded
};
