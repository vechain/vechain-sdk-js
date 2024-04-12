import {
    ProviderInternalBaseWallet,
    HttpClient,
    type SignTransactionOptions
} from '@vechain/sdk-network';
import { secp256k1 } from '@vechain/sdk-core';

/**
 * Url of the testnet fixture
 */
const testnetUrl = 'https://testnet.vechain.org';

/**
 * Url of the solo network fixture
 */
const soloUrl = 'http://localhost:8669';

/**
 * Url of the mainnet fixture
 */
const mainnetUrl = 'https://mainnet.vechain.org';

/**
 * Test Network instance fixture
 */
const testNetwork = new HttpClient(testnetUrl);

/**
 * Main network instance fixture
 */
const mainNetwork = new HttpClient(mainnetUrl);

/**
 * Solo network instance fixture
 */
const soloNetwork = new HttpClient(soloUrl);

/**
 * Simple test account fixture
 */
const testAccount = '0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa';

/**
 * Test accounts fixture
 */
const TEST_ACCOUNTS_THOR_SOLO = [
    /* ----------- NEW ACCOUNTS ----------- */
    /**
     * Each new account starts with
     * - VET: 500000000
     * - VTHO: at least 500000000 (VTHO is not constant due to generation when having VET)
     */
    {
        privateKey:
            '7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158',
        address: '0x3db469a79593dcc67f07de1869d6682fc1eaf535'
    },
    {
        privateKey:
            'ea5383ac1f9e625220039a4afac6a7f868bf1ad4f48ce3a1dd78bd214ee4ace5',
        address: '0x2669514f9fe96bc7301177ba774d3da8a06cace4'
    },
    {
        privateKey:
            '1758771c54938e977518e4ff1c297aca882f6598891df503030734532efa790e',
        address: '0x9e7911de289c3c856ce7f421034f66b6cde49c39'
    },
    {
        privateKey:
            '432f38bcf338c374523e83fdb2ebe1030aba63c7f1e81f7d76c5f53f4d42e766',
        address: '0x88b2551c3ed42ca663796c10ce68c88a65f73fe2'
    },
    {
        privateKey:
            '706e6acd567fdc22db54aead12cb39db01c4832f149f95299aa8dd8bef7d28ff',
        address: '0xf02f557c753edf5fcdcbfe4c1c3a448b3cc84d54'
    },
    {
        privateKey:
            'f9fc826b63a35413541d92d2bfb6661128cd5075fcdca583446d20c59994ba26',
        address: '0x7a28e7361fd10f4f058f9fefc77544349ecff5d6'
    },
    {
        privateKey:
            '0da72e8e26580d409d1837e23cc50c887358964152039e32af0c8a147c6b616d',
        address: '0xb717b660cd51109334bd10b2c168986055f58c1a'
    },
    {
        privateKey:
            '6e8ad4e4ffb888082d94975a58dc9a8179f8724ba22301cd8392ba5352af7e25',
        address: '0x62226ae029dabcf90f3cb66f091919d2687d5257'
    },
    {
        privateKey:
            '521b7793c6eb27d137b617627c6b85d57c0aa303380e9ca4e30a30302fbc6676',
        address: '0x062f167a905c1484de7e75b88edc7439f82117de'
    },
    {
        privateKey:
            'adc81265b0909dec70235ec973b1758e45ce5ce7cfe92eb96b79cd0ef07bc6bc',
        address: '0x3e3d79163b08502a086213cd09660721740443d7'
    },
    /* ----------- THOR SOLO GENESIS ACCOUNTS ----------- */
    /**
     * Each Thor Solo genesis account has
     * - VET: 500000000
     * - VTHO: at least 1365000000 (VTHO is not constant due to generation when having VET)
     */
    {
        privateKey:
            '99f0500549792796c14fed62011a51081dc5b5e68fe8bd8a13b86be829c4fd36',
        address: '0xf077b491b355e64048ce21e3a6fc4751eeea77fa'
    },
    {
        privateKey:
            '7b067f53d350f1cf20ec13df416b7b73e88a1dc7331bc904b92108b1e76a08b1',
        address: '0x435933c8064b4ae76be665428e0307ef2ccfbd68'
    },
    {
        privateKey:
            'f4a1a17039216f535d42ec23732c79943ffb45a089fbb78a14daad0dae93e991',
        address: '0x0f872421dc479f3c11edd89512731814d0598db5'
    },
    {
        privateKey:
            '35b5cc144faca7d7f220fca7ad3420090861d5231d80eb23e1013426847371c4',
        address: '0xf370940abdbd2583bc80bfc19d19bc216c88ccf0'
    },
    {
        privateKey:
            '10c851d8d6c6ed9e6f625742063f292f4cf57c2dbeea8099fa3aca53ef90aef1',
        address: '0x99602e4bbc0503b8ff4432bb1857f916c3653b85'
    },
    {
        privateKey:
            '2dd2c5b5d65913214783a6bd5679d8c6ef29ca9f2e2eae98b4add061d0b85ea0',
        address: '0x61e7d0c2b25706be3485980f39a3a994a8207acf'
    },
    {
        privateKey:
            'e1b72a1761ae189c10ec3783dd124b902ffd8c6b93cd9ff443d5490ce70047ff',
        address: '0x361277d1b27504f36a3b33d3a52d1f8270331b8c'
    },
    {
        privateKey:
            '35cbc5ac0c3a2de0eb4f230ced958fd6a6c19ed36b5d2b1803a9f11978f96072',
        address: '0xd7f75a0a1287ab2916848909c8531a0ea9412800'
    },
    {
        privateKey:
            'b639c258292096306d2f60bc1a8da9bc434ad37f15cd44ee9a2526685f592220',
        address: '0xabef6032b9176c186f6bf984f548bda53349f70a'
    },
    {
        privateKey:
            '9d68178cdc934178cca0a0051f40ed46be153cf23cb1805b59cc612c0ad2bbe0',
        address: '0x865306084235bf804c8bba8a8d56890940ca8f0b'
    }
];

/**
 * Test accounts into wallet fixture
 */
const THOR_SOLO_ACCOUNTS_BASE_WALLET: ProviderInternalBaseWallet =
    new ProviderInternalBaseWallet(
        TEST_ACCOUNTS_THOR_SOLO.map((account) => ({
            privateKey: Buffer.from(account.privateKey, 'hex'),
            publicKey: Buffer.from(
                secp256k1.derivePublicKey(
                    Buffer.from(account.privateKey, 'hex')
                )
            ),
            address: account.address
        }))
    );

/**
 * Test accounts into wallet fixture with delegator
 */
const THOR_SOLO_ACCOUNTS_BASE_WALLET_WITH_DELEGATOR = (
    delegator: SignTransactionOptions
): ProviderInternalBaseWallet =>
    new ProviderInternalBaseWallet(
        TEST_ACCOUNTS_THOR_SOLO.map((account) => ({
            privateKey: Buffer.from(account.privateKey, 'hex'),
            publicKey: Buffer.from(
                secp256k1.derivePublicKey(
                    Buffer.from(account.privateKey, 'hex')
                )
            ),
            address: account.address
        })),
        {
            delegator
        }
    );

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
            chainId: '0x186aa',
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
                '0x010b7a6d6f04407ac2f72e505ff83d49db8d01607f8af41f508b2ca7eca0d450',
            blockNumber: '0x10b7a6d',
            from: '0x7487d912d03ab9de786278f679592b3730bdd540',
            gas: '0xbd30',
            chainId: '0x186aa',
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
        },
        {
            blockHash:
                '0x010b7a6d6f04407ac2f72e505ff83d49db8d01607f8af41f508b2ca7eca0d450',
            blockNumber: '0x10b7a6d',
            from: '0x7487d912d03ab9de786278f679592b3730bdd540',
            gas: '0xd14a',
            chainId: '0x186aa',
            hash: '0xb476d1a43b8632c25a581465c944a1cb5dd99e48d41d326a250847a0a279afa5',
            nonce: '0x7022eb9454a648b9',
            transactionIndex: '0x2',
            input: '0x2f2ff15d3c11d16cbaffd01df69ce1c404f6340ee057498f5f00246190ea54220576a84800000000000000000000000042f51a1de771c41157be6129ba7b1756da2f8290',
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
    miner: '0xb4094c25f86d628fdd571afc4077f0d0196afb48',
    difficulty: '0x0',
    totalDifficulty: '0x0',
    uncles: [],
    sha3Uncles:
        '0x0000000000000000000000000000000000000000000000000000000000000000',
    nonce: '0x0000000000000000',
    logsBloom:
        '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    extraData: '0x0',
    baseFeePerGas: '0x0',
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
    difficulty: '0x0',
    totalDifficulty: '0x0',
    uncles: [],
    sha3Uncles:
        '0x0000000000000000000000000000000000000000000000000000000000000000',
    nonce: '0x0000000000000000',
    logsBloom:
        '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    extraData: '0x0',
    baseFeePerGas: '0x0',
    mixHash:
        '0x0000000000000000000000000000000000000000000000000000000000000000'
};

/**
 * Valid transaction hash fixture
 */
const validTransactionHashTestnet =
    '0xb2e3f6e9782f462d797b72f9cbf5a4c38ca20cabcc1a091f9de6d3e6736c1f7c';

/**
 * Valid transaction detail fixture of the `validTransactionHashTestnet` transaction
 */
const validTransactionDetailTestnet = {
    blockHash:
        '0x010b7b5f0192003f70bf2a6a502221e075cb32d676e3443614d21003cc2ee440',
    blockNumber: '0x10b7b5f',
    from: '0x8c59c63d6458c71b6ff88d57698437524a703084',
    gas: '0x618af',
    chainId: '0x186aa',
    hash: '0xb2e3f6e9782f462d797b72f9cbf5a4c38ca20cabcc1a091f9de6d3e6736c1f7c',
    nonce: '0x19b4782',
    transactionIndex: '0x0',
    input: '0xf14fcbc8ad2a4a05c94893cc69b721955da2fb2e93ba001224f6ec7250ad110765065541',
    to: '0xaeb29614bb9af450a7fff539bbba319455a1aca7',
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
};

/**
 * `TestingContract.sol` deployed contract address on thor-solo snapshot.
 */
const TESTING_CONTRACT_ADDRESS: string =
    '0xb2c20a6de401003a671659b10629eb82ff254fb8';

/**
 * `TestingContract.sol` contract bytecode on Solo Network
 */
const TESTING_CONTRACT_BYTECODE =
    '0x608060405234801561001057600080fd5b50600436106102065760003560e01c80636188a79b1161011a578063bd255307116100ad578063da46084a1161007c578063da46084a146106a1578063e1967eae146106d1578063eb03555c146106ef578063f8b2cb4f1461071f578063fb3a4b941461074f57610206565b8063bd25530714610607578063c4e41b2214610637578063c7bce69d14610655578063cf98821c1461067157610206565b80637634787f116100e95780637634787f1461056f578063b2d144001461059f578063b6b55f25146105bb578063bd220e65146105d757610206565b80636188a79b146104d75780636765f626146105075780636a98ff2b1461052357806375f7286c1461055357610206565b80632e1a7d4d1161019d578063448dc9661161016c578063448dc96614610406578063459346c7146104245780634888df8d146104545780634d56c873146104725780635fb5fe3b146104a757610206565b80632e1a7d4d1461036c57806333956403146103885780633793077c146103b85780633f92958f146103d657610206565b806311c4ea65116101d957806311c4ea65146102b757806315a23066146102ee5780631d4a06de1461030c57806327e235e31461033c57610206565b806301cb08c51461020b57806301ec27bd146102275780630a9f3f05146102575780631083ac9214610287575b600080fd5b6102256004803603810190610220919061126e565b610759565b005b610241600480360381019061023c9190611457565b6107bb565b60405161024e919061156b565b60405180910390f35b610271600480360381019061026c919061126e565b6107cb565b60405161027e919061159c565b60405180910390f35b6102a1600480360381019061029c919061126e565b61086f565b6040516102ae919061159c565b60405180910390f35b6102d160048036038101906102cc91906117e9565b610879565b6040516102e5989796959493929190611b07565b60405180910390f35b6102f66108bf565b604051610303919061159c565b60405180910390f35b61032660048036038101906103219190611b9c565b610956565b6040516103339190611be5565b60405180910390f35b61035660048036038101906103519190611c07565b610960565b604051610363919061159c565b60405180910390f35b6103866004803603810190610381919061126e565b610978565b005b6103a2600480360381019061039d9190611c6c565b610a9a565b6040516103af9190611ca8565b60405180910390f35b6103c0610aa4565b6040516103cd919061159c565b60405180910390f35b6103f060048036038101906103eb919061126e565b610b3b565b6040516103fd9190611cc3565b60405180910390f35b61040e610bdf565b60405161041b9190611d19565b60405180910390f35b61043e60048036038101906104399190611d6a565b610c76565b60405161044b9190611da6565b60405180910390f35b61045c610c80565b6040516104699190611cc3565b60405180910390f35b61048c60048036038101906104879190611edc565b610d17565b60405161049e96959493929190611fb4565b60405180910390f35b6104c160048036038101906104bc9190611c07565b610d41565b6040516104ce9190612015565b60405180910390f35b6104f160048036038101906104ec9190612030565b610d4b565b6040516104fe919061205d565b60405180910390f35b610521600480360381019061051c919061126e565b610d55565b005b61053d60048036038101906105389190612119565b610d9b565b60405161054a9190611cc3565b60405180910390f35b61056d6004803603810190610568919061126e565b610e3f565b005b6105896004803603810190610584919061126e565b610e85565b6040516105969190612015565b60405180910390f35b6105b960048036038101906105b4919061126e565b610f29565b005b6105d560048036038101906105d0919061126e565b610f70565b005b6105f160048036038101906105ec919061126e565b61100e565b6040516105fe9190612162565b60405180910390f35b610621600480360381019061061c919061217d565b6110b2565b60405161062e91906121aa565b60405180910390f35b61063f6110c2565b60405161064c919061159c565b60405180910390f35b61066f600480360381019061066a919061126e565b611159565b005b61068b600480360381019061068691906121c5565b61116d565b604051610698919061220e565b60405180910390f35b6106bb60048036038101906106b69190612230565b611177565b6040516106c8919061225d565b60405180910390f35b6106d961118d565b6040516106e6919061159c565b60405180910390f35b61070960048036038101906107049190612278565b611193565b6040516107169190611cc3565b60405180910390f35b61073960048036038101906107349190611c07565b61119d565b604051610746919061159c565b60405180910390f35b6107576111e6565b005b60006001549050816001819055503373ffffffffffffffffffffffffffffffffffffffff1681837f300d5da673e2547b3469e683ff2c8c7efd661c408f45cd0be5a951392a00cfa3426040516107af919061159c565b60405180910390a45050565b6107c36111e8565b819050919050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16633b80eea2836040518263ffffffff1660e01b8152600401610827919061159c565b602060405180830381865afa158015610844573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061086891906122ba565b9050919050565b6000819050919050565b60008060006060610888611202565b60606108926111e8565b60008f8f8f8f8f8f8f8f975097509750975097509750975097509850985098509850985098509850989050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663605df59c6040518163ffffffff1660e01b8152600401602060405180830381865afa15801561092d573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061095191906122ba565b905090565b6060819050919050565b60026020528060005260406000206000915090505481565b80600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410156109fa576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016109f190612333565b60405180910390fd5b80600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254610a499190612382565b925050819055503373ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f19350505050158015610a96573d6000803e3d6000fd5b5050565b6000819050919050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663cbf6ddce6040518163ffffffff1660e01b8152600401602060405180830381865afa158015610b12573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b3691906122ba565b905090565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663d527e344836040518263ffffffff1660e01b8152600401610b97919061159c565b602060405180830381865afa158015610bb4573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610bd891906123cb565b9050919050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663e80558316040518163ffffffff1660e01b8152600401602060405180830381865afa158015610c4d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c719190612424565b905090565b6000819050919050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16639ac53dbb6040518163ffffffff1660e01b8152600401602060405180830381865afa158015610cee573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d1291906123cb565b905090565b6000806000806000808b8b8b8b8b8b95509550955095509550955096509650965096509650969050565b6000819050919050565b6000819050919050565b600a8111610d98576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d8f9061249d565b60405180910390fd5b50565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166337245814836040518263ffffffff1660e01b8152600401610df79190612512565b602060405180830381865afa158015610e14573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610e3891906123cb565b9050919050565b602a8114610e82576040517f8d6ea8be000000000000000000000000000000000000000000000000000000008152600401610e7990612580565b60405180910390fd5b50565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166340f9fafe836040518263ffffffff1660e01b8152600401610ee1919061159c565b602060405180830381865afa158015610efe573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f2291906125b5565b9050919050565b6005811015610f6d576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f649061262e565b60405180910390fd5b50565b8060008111610fb4576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610fab9061269a565b60405180910390fd5b81600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825461100391906126ba565b925050819055505050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166341f90721836040518263ffffffff1660e01b815260040161106a919061159c565b602060405180830381865afa158015611087573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906110ab9190612703565b9050919050565b6110ba611202565b819050919050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166318160ddd6040518163ffffffff1660e01b8152600401602060405180830381865afa158015611130573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061115491906122ba565b905090565b6000811461116a57611169612730565b5b50565b6060819050919050565b6000600182611186919061275f565b9050919050565b60015481565b6000819050919050565b6000600260008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565bfe5b604051806040016040528060008152602001606081525090565b6040518060600160405280600390602082028036833780820191505090505090565b6000604051905090565b600080fd5b600080fd5b6000819050919050565b61124b81611238565b811461125657600080fd5b50565b60008135905061126881611242565b92915050565b6000602082840312156112845761128361122e565b5b600061129284828501611259565b91505092915050565b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6112e9826112a0565b810181811067ffffffffffffffff82111715611308576113076112b1565b5b80604052505050565b600061131b611224565b905061132782826112e0565b919050565b600080fd5b600080fd5b600080fd5b600067ffffffffffffffff821115611356576113556112b1565b5b61135f826112a0565b9050602081019050919050565b82818337600083830152505050565b600061138e6113898461133b565b611311565b9050828152602081018484840111156113aa576113a9611336565b5b6113b584828561136c565b509392505050565b600082601f8301126113d2576113d1611331565b5b81356113e284826020860161137b565b91505092915050565b6000604082840312156114015761140061129b565b5b61140b6040611311565b9050600061141b84828501611259565b600083015250602082013567ffffffffffffffff81111561143f5761143e61132c565b5b61144b848285016113bd565b60208301525092915050565b60006020828403121561146d5761146c61122e565b5b600082013567ffffffffffffffff81111561148b5761148a611233565b5b611497848285016113eb565b91505092915050565b6114a981611238565b82525050565b600081519050919050565b600082825260208201905092915050565b60005b838110156114e95780820151818401526020810190506114ce565b60008484015250505050565b6000611500826114af565b61150a81856114ba565b935061151a8185602086016114cb565b611523816112a0565b840191505092915050565b600060408301600083015161154660008601826114a0565b506020830151848203602086015261155e82826114f5565b9150508091505092915050565b60006020820190508181036000830152611585818461152e565b905092915050565b61159681611238565b82525050565b60006020820190506115b1600083018461158d565b92915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006115e2826115b7565b9050919050565b6115f2816115d7565b81146115fd57600080fd5b50565b60008135905061160f816115e9565b92915050565b6000819050919050565b61162881611615565b811461163357600080fd5b50565b6000813590506116458161161f565b92915050565b600067ffffffffffffffff821115611666576116656112b1565b5b602082029050919050565b600080fd5b60006116896116848461164b565b611311565b905080602084028301858111156116a3576116a2611671565b5b835b818110156116cc57806116b88882611259565b8452602084019350506020810190506116a5565b5050509392505050565b600082601f8301126116eb576116ea611331565b5b60036116f8848285611676565b91505092915050565b600067ffffffffffffffff82111561171c5761171b6112b1565b5b602082029050602081019050919050565b600061174061173b84611701565b611311565b9050808382526020820190506020840283018581111561176357611762611671565b5b835b8181101561178c57806117788882611259565b845260208401935050602081019050611765565b5050509392505050565b600082601f8301126117ab576117aa611331565b5b81356117bb84826020860161172d565b91505092915050565b600381106117d157600080fd5b50565b6000813590506117e3816117c4565b92915050565b600080600080600080600080610140898b03121561180a5761180961122e565b5b60006118188b828c01611259565b98505060206118298b828c01611600565b975050604061183a8b828c01611636565b965050606089013567ffffffffffffffff81111561185b5761185a611233565b5b6118678b828c016113bd565b95505060806118788b828c016116d6565b94505060e089013567ffffffffffffffff81111561189957611898611233565b5b6118a58b828c01611796565b93505061010089013567ffffffffffffffff8111156118c7576118c6611233565b5b6118d38b828c016113eb565b9250506101206118e58b828c016117d4565b9150509295985092959890939650565b6118fe816115d7565b82525050565b61190d81611615565b82525050565b600082825260208201905092915050565b600061192f826114af565b6119398185611913565b93506119498185602086016114cb565b611952816112a0565b840191505092915050565b600060039050919050565b600081905092915050565b6000819050919050565b600061198983836114a0565b60208301905092915050565b6000602082019050919050565b6119ab8161195d565b6119b58184611968565b92506119c082611973565b8060005b838110156119f15781516119d8878261197d565b96506119e383611995565b9250506001810190506119c4565b505050505050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b6000602082019050919050565b6000611a3d826119f9565b611a478185611a04565b9350611a5283611a15565b8060005b83811015611a83578151611a6a888261197d565b9750611a7583611a25565b925050600181019050611a56565b5085935050505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b60038110611ad057611acf611a90565b5b50565b6000819050611ae182611abf565b919050565b6000611af182611ad3565b9050919050565b611b0181611ae6565b82525050565b600061014082019050611b1d600083018b61158d565b611b2a602083018a6118f5565b611b376040830189611904565b8181036060830152611b498188611924565b9050611b5860808301876119a2565b81810360e0830152611b6a8186611a32565b9050818103610100830152611b7f818561152e565b9050611b8f610120830184611af8565b9998505050505050505050565b600060208284031215611bb257611bb161122e565b5b600082013567ffffffffffffffff811115611bd057611bcf611233565b5b611bdc848285016113bd565b91505092915050565b60006020820190508181036000830152611bff8184611924565b905092915050565b600060208284031215611c1d57611c1c61122e565b5b6000611c2b84828501611600565b91505092915050565b60008115159050919050565b611c4981611c34565b8114611c5457600080fd5b50565b600081359050611c6681611c40565b92915050565b600060208284031215611c8257611c8161122e565b5b6000611c9084828501611c57565b91505092915050565b611ca281611c34565b82525050565b6000602082019050611cbd6000830184611c99565b92915050565b6000602082019050611cd86000830184611904565b92915050565b60007fffffffffffffffff00000000000000000000000000000000000000000000000082169050919050565b611d1381611cde565b82525050565b6000602082019050611d2e6000830184611d0a565b92915050565b6000819050919050565b611d4781611d34565b8114611d5257600080fd5b50565b600081359050611d6481611d3e565b92915050565b600060208284031215611d8057611d7f61122e565b5b6000611d8e84828501611d55565b91505092915050565b611da081611d34565b82525050565b6000602082019050611dbb6000830184611d97565b92915050565b600060ff82169050919050565b611dd781611dc1565b8114611de257600080fd5b50565b600081359050611df481611dce565b92915050565b600061ffff82169050919050565b611e1181611dfa565b8114611e1c57600080fd5b50565b600081359050611e2e81611e08565b92915050565b600063ffffffff82169050919050565b611e4d81611e34565b8114611e5857600080fd5b50565b600081359050611e6a81611e44565b92915050565b600067ffffffffffffffff82169050919050565b611e8d81611e70565b8114611e9857600080fd5b50565b600081359050611eaa81611e84565b92915050565b611eb9816115b7565b8114611ec457600080fd5b50565b600081359050611ed681611eb0565b92915050565b60008060008060008060c08789031215611ef957611ef861122e565b5b6000611f0789828a01611de5565b9650506020611f1889828a01611e1f565b9550506040611f2989828a01611e5b565b9450506060611f3a89828a01611e9b565b9350506080611f4b89828a01611ec7565b92505060a0611f5c89828a01611259565b9150509295509295509295565b611f7281611dc1565b82525050565b611f8181611dfa565b82525050565b611f9081611e34565b82525050565b611f9f81611e70565b82525050565b611fae816115b7565b82525050565b600060c082019050611fc96000830189611f69565b611fd66020830188611f78565b611fe36040830187611f87565b611ff06060830186611f96565b611ffd6080830185611fa5565b61200a60a083018461158d565b979650505050505050565b600060208201905061202a60008301846118f5565b92915050565b6000602082840312156120465761204561122e565b5b6000612054848285016117d4565b91505092915050565b60006020820190506120726000830184611af8565b92915050565b600067ffffffffffffffff821115612093576120926112b1565b5b61209c826112a0565b9050602081019050919050565b60006120bc6120b784612078565b611311565b9050828152602081018484840111156120d8576120d7611336565b5b6120e384828561136c565b509392505050565b600082601f830112612100576120ff611331565b5b81356121108482602086016120a9565b91505092915050565b60006020828403121561212f5761212e61122e565b5b600082013567ffffffffffffffff81111561214d5761214c611233565b5b612159848285016120eb565b91505092915050565b60006020820190506121776000830184611f96565b92915050565b6000606082840312156121935761219261122e565b5b60006121a1848285016116d6565b91505092915050565b60006060820190506121bf60008301846119a2565b92915050565b6000602082840312156121db576121da61122e565b5b600082013567ffffffffffffffff8111156121f9576121f8611233565b5b61220584828501611796565b91505092915050565b600060208201905081810360008301526122288184611a32565b905092915050565b6000602082840312156122465761224561122e565b5b600061225484828501611de5565b91505092915050565b60006020820190506122726000830184611f69565b92915050565b60006020828403121561228e5761228d61122e565b5b600061229c84828501611636565b91505092915050565b6000815190506122b481611242565b92915050565b6000602082840312156122d0576122cf61122e565b5b60006122de848285016122a5565b91505092915050565b7f496e73756666696369656e742062616c616e6365000000000000000000000000600082015250565b600061231d601483611913565b9150612328826122e7565b602082019050919050565b6000602082019050818103600083015261234c81612310565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600061238d82611238565b915061239883611238565b92508282039050818111156123b0576123af612353565b5b92915050565b6000815190506123c58161161f565b92915050565b6000602082840312156123e1576123e061122e565b5b60006123ef848285016123b6565b91505092915050565b61240181611cde565b811461240c57600080fd5b50565b60008151905061241e816123f8565b92915050565b60006020828403121561243a5761243961122e565b5b60006124488482850161240f565b91505092915050565b7f56616c7565206d7573742062652067726561746572207468616e203130000000600082015250565b6000612487601d83611913565b915061249282612451565b602082019050919050565b600060208201905081810360008301526124b68161247a565b9050919050565b600081519050919050565b600082825260208201905092915050565b60006124e4826124bd565b6124ee81856124c8565b93506124fe8185602086016114cb565b612507816112a0565b840191505092915050565b6000602082019050818103600083015261252c81846124d9565b905092915050565b7f56616c7565206973206e6f742034320000000000000000000000000000000000600082015250565b600061256a600f83611913565b915061257582612534565b602082019050919050565b600060208201905081810360008301526125998161255d565b9050919050565b6000815190506125af816115e9565b92915050565b6000602082840312156125cb576125ca61122e565b5b60006125d9848285016125a0565b91505092915050565b7f56616c7565206d757374206265206174206c6561737420350000000000000000600082015250565b6000612618601883611913565b9150612623826125e2565b602082019050919050565b600060208201905081810360008301526126478161260b565b9050919050565b7f56616c7565206d75737420626520706f73697469766500000000000000000000600082015250565b6000612684601683611913565b915061268f8261264e565b602082019050919050565b600060208201905081810360008301526126b381612677565b9050919050565b60006126c582611238565b91506126d083611238565b92508282019050808211156126e8576126e7612353565b5b92915050565b6000815190506126fd81611e84565b92915050565b6000602082840312156127195761271861122e565b5b6000612727848285016126ee565b91505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052600160045260246000fd5b600061276a82611dc1565b915061277583611dc1565b9250828201905060ff81111561278e5761278d612353565b5b9291505056fea264697066735822122090e8d98dff56f009773585884be02c1824429b468490cc66cf321ad52458c8b864736f6c63430008130033';

export {
    testnetUrl,
    soloUrl,
    testNetwork,
    soloNetwork,
    testAccount,
    blockWithTransactionsExpanded,
    blockWithTransactionsNotExpanded,
    validTransactionHashTestnet,
    validTransactionDetailTestnet,
    TEST_ACCOUNTS_THOR_SOLO,
    THOR_SOLO_ACCOUNTS_BASE_WALLET,
    THOR_SOLO_ACCOUNTS_BASE_WALLET_WITH_DELEGATOR,
    TESTING_CONTRACT_ADDRESS,
    TESTING_CONTRACT_BYTECODE,
    mainNetwork,
    mainnetUrl
};
