import { InvalidDataType, ProviderRpcError } from '@vechain/sdk-errors';

/**
 * debug_traceTransaction positive cases fixture.
 */
const debugTraceTransactionPositiveCasesFixtureTestnet = [
    // Transaction 1 - callTracer - 0x2dbc8268a2dbf889abe828c0671cb9adce61f537aab8855480aff6967e0ed687
    {
        input: {
            params: [
                '0x2dbc8268a2dbf889abe828c0671cb9adce61f537aab8855480aff6967e0ed687',
                {
                    tracer: 'callTracer',
                    timeout: '10s',
                    tracerConfig: { onlyTopCall: true }
                }
            ],
            expected: {
                from: '0x7487d912d03ab9de786278f679592b3730bdd540',
                gas: '0x11c5',
                gasUsed: '0x0',
                to: '0x6e1ffe60656421eb12de92433c5a319ba606bb81',
                input: '0x02fe53050000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000f6e657742617365546f6b656e5552490000000000000000000000000000000000',
                value: '0x0',
                type: 'CALL',
                revertReason: ''
            }
        }
    },
    // Transaction 1 - prestateTracer - 0x2dbc8268a2dbf889abe828c0671cb9adce61f537aab8855480aff6967e0ed687
    {
        input: {
            params: [
                '0x2dbc8268a2dbf889abe828c0671cb9adce61f537aab8855480aff6967e0ed687',
                {
                    tracer: 'prestateTracer',
                    timeout: '10s',
                    tracerConfig: { onlyTopCall: true }
                }
            ],
            expected: {
                '0x6e1ffe60656421eb12de92433c5a319ba606bb81': {
                    balance: '0x0',
                    nonce: 0
                },
                '0x7487d912d03ab9de786278f679592b3730bdd540': {
                    balance: '0x422ca8b0a00a425000000',
                    nonce: 0
                },
                '0xb4094c25f86d628fdd571afc4077f0d0196afb48': {
                    balance: '0x14b3cf4cc2f3044b700000',
                    nonce: 0
                }
            }
        }
    },
    // Transaction 2 - callTracer - 0x05b31824569f2f2ec64c62c4e6396199f56ae872ff219288eb3293b4a36e7b0f
    {
        input: {
            params: [
                '0x05b31824569f2f2ec64c62c4e6396199f56ae872ff219288eb3293b4a36e7b0f',
                {
                    tracer: 'callTracer',
                    timeout: '10s',
                    tracerConfig: { onlyTopCall: true }
                }
            ],
            expected: {
                from: '0x105199a26b10e55300cb71b46c5b5e867b7df427',
                gas: '0x8b92',
                gasUsed: '0x50fa',
                to: '0xaa854565401724f7061e0c366ca132c87c1e5f60',
                input: '0xf14fcbc800d770b9faa11ba944366f3e7a14c166f780ece542e557e0b7fe4870fcbe8dbe',
                revertReason: '',
                value: '0x0',
                type: 'CALL'
            }
        }
    },
    // Transaction 2 - prestateTracer - 0x05b31824569f2f2ec64c62c4e6396199f56ae872ff219288eb3293b4a36e7b0f
    {
        input: {
            params: [
                '0x05b31824569f2f2ec64c62c4e6396199f56ae872ff219288eb3293b4a36e7b0f',
                {
                    tracer: 'prestateTracer',
                    timeout: '10s',
                    tracerConfig: { onlyTopCall: true }
                }
            ],
            expected: {
                '0x105199a26b10e55300cb71b46c5b5e867b7df427': {
                    balance: '0xd5e61f72b637eb415b00',
                    nonce: 0
                },
                '0xaa854565401724f7061e0c366ca132c87c1e5f60': {
                    balance: '0x0',
                    nonce: 0,
                    code: '0x60806040526004361061015f5760003560e01c80638d839ffe116100c0578063aeb8ce9b11610074578063d3419bf311610059578063d3419bf3146103ff578063f14fcbc814610433578063f2fde38b1461045357600080fd5b8063aeb8ce9b146103ab578063ce1e09c0146103cb57600080fd5b80639791c097116100a55780639791c09714610344578063a8e5fbc014610364578063acf1a8411461039857600080fd5b80638d839ffe146102f25780638da5cb5b1461032657600080fd5b806374694a2b11610117578063839df945116100fc578063839df9451461027257806383e7f6ff1461029f5780638a95b09f146102da57600080fd5b806374694a2b14610213578063808698531461022657600080fd5b80635d3590d5116101485780635d3590d5146101b057806365a69dcf146101d0578063715018a6146101fe57600080fd5b806301ffc9a7146101645780633ccfd60b14610199575b600080fd5b34801561017057600080fd5b5061018461017f36600461147a565b610473565b60405190151581526020015b60405180910390f35b3480156101a557600080fd5b506101ae61050c565b005b3480156101bc57600080fd5b506101ae6101cb3660046114d8565b610549565b3480156101dc57600080fd5b506101f06101eb366004611645565b6105e3565b604051908152602001610190565b34801561020a57600080fd5b506101ae6106d1565b6101ae610221366004611748565b6106e5565b34801561023257600080fd5b5061025a7f0000000000000000000000006878f1ad5e3015310cfe5b38d7b7071c5d8818ca81565b6040516001600160a01b039091168152602001610190565b34801561027e57600080fd5b506101f061028d366004611812565b60016020526000908152604090205481565b3480156102ab57600080fd5b506102bf6102ba36600461182b565b610a09565b60408051825181526020928301519281019290925201610190565b3480156102e657600080fd5b506101f06301e1338081565b3480156102fe57600080fd5b506101f07f000000000000000000000000000000000000000000000000000000000000000a81565b34801561033257600080fd5b506000546001600160a01b031661025a565b34801561035057600080fd5b5061018461035f366004611870565b610b5c565b34801561037057600080fd5b5061025a7f00000000000000000000000067d8d01cf0d6d9ed2c120fff1d4fa86fc10c9d8e81565b6101ae6103a63660046118a5565b610b71565b3480156103b757600080fd5b506101846103c6366004611870565b610d3a565b3480156103d757600080fd5b506101f07f000000000000000000000000000000000000000000000000000000000001518081565b34801561040b57600080fd5b5061025a7f0000000000000000000000001d7d3fbf20c05c45bafd22ca243ad643f81c862e81565b34801561043f57600080fd5b506101ae61044e366004611812565b610dfd565b34801561045f57600080fd5b506101ae61046e3660046118f1565b610e8b565b60007fffffffff0000000000000000000000000000000000000000000000000000000082167f01ffc9a700000000000000000000000000000000000000000000000000000000148061050657507fffffffff0000000000000000000000000000000000000000000000000000000082167fe2b3754c00000000000000000000000000000000000000000000000000000000145b92915050565b600080546040516001600160a01b03909116914780156108fc02929091818181858888f19350505050158015610546573d6000803e3d6000fd5b50565b610551610f18565b6040517fa9059cbb0000000000000000000000000000000000000000000000000000000081526001600160a01b0383811660048301526024820183905284169063a9059cbb906044016020604051808303816000875af11580156105b9573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105dd919061190c565b50505050565b885160208a01206000906001600160a01b03871615801561060657506001841515145b1561063d576040517f406d917600000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b841580159061065357506001600160a01b038716155b1561068a576040517fd3f605c400000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b808a8a8a8a8a8a8a8a6040516020016106ab999897969594939291906119e4565b604051602081830303815290604052805190602001209150509998505050505050505050565b6106d9610f18565b6106e36000610f72565b565b60006107288b8b8080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152508c9250610a09915050565b6020810151815191925061073b91611a5c565b34101561075b5760405163044044a560e21b815260040160405180910390fd5b6107fe8b8b8080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f82011690508083019250505050505050896107f98e8e8080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050508d8d8d8d8d8d8d8d6105e3565b610fda565b6040517fa40149820000000000000000000000000000000000000000000000000000000081526000906001600160a01b037f00000000000000000000000067d8d01cf0d6d9ed2c120fff1d4fa86fc10c9d8e169063a401498290610870908f908f908f908f908e908b90600401611a6f565b6020604051808303816000875af115801561088f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108b39190611ab9565b905084156108de576108de878d8d6040516108cf929190611ad2565b6040518091039020888861115d565b8315610927576109278c8c8080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152508b92503391506112379050565b896001600160a01b03168c8c604051610941929190611ad2565b60405180910390207f69e37f151eb98a09618ddaa80c8cfaf1ce5996867c489f45b555b412271ebf278e8e8660000151876020015187604051610988959493929190611ae2565b60405180910390a3602082015182516109a19190611a5c565b3411156109f3576020820151825133916108fc916109bf9190611a5c565b6109c99034611b13565b6040518115909202916000818181858888f193505050501580156109f1573d6000803e3d6000fd5b505b6109fb61050c565b505050505050505050505050565b6040805180820190915260008082526020820152825160208401206040517fd6e4fa86000000000000000000000000000000000000000000000000000000008152600481018290527f0000000000000000000000001d7d3fbf20c05c45bafd22ca243ad643f81c862e6001600160a01b03908116916350e9a7159187917f000000000000000000000000ca1b72286b96f30391abb96c7d5e3bf2d767927d9091169063d6e4fa8690602401602060405180830381865afa158015610ad1573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610af59190611ab9565b866040518463ffffffff1660e01b8152600401610b1493929190611b76565b6040805180830381865afa158015610b30573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b549190611b9b565b949350505050565b60006003610b69836112eb565b101592915050565b60008383604051610b83929190611ad2565b604080519182900382206020601f870181900481028401810190925285835292508291600091610bd091908890889081908401838280828437600092019190915250889250610a09915050565b8051909150341015610bf55760405163044044a560e21b815260040160405180910390fd5b6040517fc475abff00000000000000000000000000000000000000000000000000000000815260048101839052602481018590526000907f00000000000000000000000067d8d01cf0d6d9ed2c120fff1d4fa86fc10c9d8e6001600160a01b03169063c475abff906044016020604051808303816000875af1158015610c7f573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ca39190611ab9565b8251909150341115610ceb57815133906108fc90610cc19034611b13565b6040518115909202916000818181858888f19350505050158015610ce9573d6000803e3d6000fd5b505b837f3da24c024582931cfaf8267d8ed24d13a82a8068d5bd337d30ec45cea4e506ae88883485604051610d219493929190611bea565b60405180910390a2610d3161050c565b50505050505050565b80516020820120600090610d4d83610b5c565b8015610df657506040517f96e494e8000000000000000000000000000000000000000000000000000000008152600481018290527f000000000000000000000000ca1b72286b96f30391abb96c7d5e3bf2d767927d6001600160a01b0316906396e494e890602401602060405180830381865afa158015610dd2573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610df6919061190c565b9392505050565b6000818152600160205260409020544290610e39907f000000000000000000000000000000000000000000000000000000000001518090611a5c565b10610e78576040517f0a059d71000000000000000000000000000000000000000000000000000000008152600481018290526024015b60405180910390fd5b6000908152600160205260409020429055565b610e93610f18565b6001600160a01b038116610f0f5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f64647265737300000000000000000000000000000000000000000000000000006064820152608401610e6f565b61054681610f72565b6000546001600160a01b031633146106e35760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610e6f565b600080546001600160a01b038381167fffffffffffffffffffffffff0000000000000000000000000000000000000000831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6000818152600160205260409020544290611016907f000000000000000000000000000000000000000000000000000000000000000a90611a5c565b1115611051576040517f5320bcf900000000000000000000000000000000000000000000000000000000815260048101829052602401610e6f565b600081815260016020526040902054429061108d907f000000000000000000000000000000000000000000000000000000000001518090611a5c565b116110c7576040517fcb7690d700000000000000000000000000000000000000000000000000000000815260048101829052602401610e6f565b6110d083610d3a565b61110857826040517f477707e8000000000000000000000000000000000000000000000000000000008152600401610e6f9190611c11565b6000818152600160205260408120556301e13380821015611158576040517f9a71997b00000000000000000000000000000000000000000000000000000000815260048101839052602401610e6f565b505050565b604080517f96d8359d9b487eed6e0bc0a275d6e4a2b573d7870dd5e650c9b11e575c3b5d98602080830191909152818301869052825180830384018152606083019384905280519101207fe32954eb0000000000000000000000000000000000000000000000000000000090925285906001600160a01b0382169063e32954eb906111f090859088908890606401611c24565b6000604051808303816000875af115801561120f573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052610d319190810190611c47565b7f0000000000000000000000006878f1ad5e3015310cfe5b38d7b7071c5d8818ca6001600160a01b0316637a806d6b3383858760405160200161127a9190611d46565b6040516020818303038152906040526040518563ffffffff1660e01b81526004016112a89493929190611d87565b6020604051808303816000875af11580156112c7573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105dd9190611ab9565b8051600090819081905b8082101561147157600085838151811061131157611311611dc5565b01602001516001600160f81b03191690507f800000000000000000000000000000000000000000000000000000000000000081101561135c57611355600184611a5c565b925061145e565b7fe0000000000000000000000000000000000000000000000000000000000000006001600160f81b03198216101561139957611355600284611a5c565b7ff0000000000000000000000000000000000000000000000000000000000000006001600160f81b0319821610156113d657611355600384611a5c565b7ff8000000000000000000000000000000000000000000000000000000000000006001600160f81b03198216101561141357611355600484611a5c565b7ffc000000000000000000000000000000000000000000000000000000000000006001600160f81b03198216101561145057611355600584611a5c565b61145b600684611a5c565b92505b508261146981611ddb565b9350506112f5565b50909392505050565b60006020828403121561148c57600080fd5b81357fffffffff0000000000000000000000000000000000000000000000000000000081168114610df657600080fd5b80356001600160a01b03811681146114d357600080fd5b919050565b6000806000606084860312156114ed57600080fd5b6114f6846114bc565b9250611504602085016114bc565b9150604084013590509250925092565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f1916810167ffffffffffffffff8111828210171561155357611553611514565b604052919050565b600067ffffffffffffffff82111561157557611575611514565b50601f01601f191660200190565b600082601f83011261159457600080fd5b81356115a76115a28261155b565b61152a565b8181528460208386010111156115bc57600080fd5b816020850160208301376000918101602001919091529392505050565b60008083601f8401126115eb57600080fd5b50813567ffffffffffffffff81111561160357600080fd5b6020830191508360208260051b850101111561161e57600080fd5b9250929050565b801515811461054657600080fd5b803561ffff811681146114d357600080fd5b60008060008060008060008060006101008a8c03121561166457600080fd5b893567ffffffffffffffff8082111561167c57600080fd5b6116888d838e01611583565b9a5061169660208d016114bc565b995060408c0135985060608c013597506116b260808d016114bc565b965060a08c01359150808211156116c857600080fd5b506116d58c828d016115d9565b90955093505060c08a01356116e981611625565b91506116f760e08b01611633565b90509295985092959850929598565b60008083601f84011261171857600080fd5b50813567ffffffffffffffff81111561173057600080fd5b60208301915083602082850101111561161e57600080fd5b6000806000806000806000806000806101008b8d03121561176857600080fd5b8a3567ffffffffffffffff8082111561178057600080fd5b61178c8e838f01611706565b909c509a508a91506117a060208e016114bc565b995060408d0135985060608d013597506117bc60808e016114bc565b965060a08d01359150808211156117d257600080fd5b506117df8d828e016115d9565b90955093505060c08b01356117f381611625565b915061180160e08c01611633565b90509295989b9194979a5092959850565b60006020828403121561182457600080fd5b5035919050565b6000806040838503121561183e57600080fd5b823567ffffffffffffffff81111561185557600080fd5b61186185828601611583565b95602094909401359450505050565b60006020828403121561188257600080fd5b813567ffffffffffffffff81111561189957600080fd5b610b5484828501611583565b6000806000604084860312156118ba57600080fd5b833567ffffffffffffffff8111156118d157600080fd5b6118dd86828701611706565b909790965060209590950135949350505050565b60006020828403121561190357600080fd5b610df6826114bc565b60006020828403121561191e57600080fd5b8151610df681611625565b81835281816020850137506000828201602090810191909152601f909101601f19169091010190565b81835260006020808501808196508560051b810191508460005b878110156119d75782840389528135601e1988360301811261198d57600080fd5b8701858101903567ffffffffffffffff8111156119a957600080fd5b8036038213156119b857600080fd5b6119c3868284611929565b9a87019a955050509084019060010161196c565b5091979650505050505050565b60006101008b83526001600160a01b03808c1660208501528a60408501528960608501528089166080850152508060a0840152611a248184018789611952565b94151560c0840152505061ffff9190911660e090910152979650505050505050565b634e487b7160e01b600052601160045260246000fd5b8082018082111561050657610506611a46565b60a081526000611a8360a08301888a611929565b90506001600160a01b03808716602084015285604084015280851660608401525061ffff83166080830152979650505050505050565b600060208284031215611acb57600080fd5b5051919050565b8183823760009101908152919050565b608081526000611af6608083018789611929565b602083019590955250604081019290925260609091015292915050565b8181038181111561050657610506611a46565b60005b83811015611b41578181015183820152602001611b29565b50506000910152565b60008151808452611b62816020860160208601611b26565b601f01601f19169290920160200192915050565b606081526000611b896060830186611b4a565b60208301949094525060400152919050565b600060408284031215611bad57600080fd5b6040516040810181811067ffffffffffffffff82111715611bd057611bd0611514565b604052825181526020928301519281019290925250919050565b606081526000611bfe606083018688611929565b6020830194909452506040015292915050565b602081526000610df66020830184611b4a565b838152604060208201526000611c3e604083018486611952565b95945050505050565b60006020808385031215611c5a57600080fd5b825167ffffffffffffffff80821115611c7257600080fd5b818501915085601f830112611c8657600080fd5b815181811115611c9857611c98611514565b8060051b611ca785820161152a565b9182528381018501918581019089841115611cc157600080fd5b86860192505b83831015611d3957825185811115611cdf5760008081fd5b8601603f81018b13611cf15760008081fd5b878101516040611d036115a28361155b565b8281528d82848601011115611d185760008081fd5b611d27838c8301848701611b26565b85525050509186019190860190611cc7565b9998505050505050505050565b60008251611d58818460208701611b26565b7f2e76657400000000000000000000000000000000000000000000000000000000920191825250600401919050565b60006001600160a01b038087168352808616602084015280851660408401525060806060830152611dbb6080830184611b4a565b9695505050505050565b634e487b7160e01b600052603260045260246000fd5b600060018201611ded57611ded611a46565b506001019056fea26469706673582212201ddb2e8378e9113270df90ab3b1ba310944f246b8a6a417f217b26228618408c64736f6c63430008110033',
                    storage: {
                        '0xd3a9597d762c90a08ad071a9e0f55f89d8fc876627a7d7ae65dd76010e951e5c':
                            '0x0000000000000000000000000000000000000000000000000000000000000000'
                    }
                },
                '0xb4094c25f86d628fdd571afc4077f0d0196afb48': {
                    balance: '0x14b3cf4cc2f3044b700000',
                    nonce: 0
                }
            }
        }
    }
];

/**
 * debug_traceTransaction positive cases fixture.
 */
const debugTraceTransactionNegativeCasesFixtureTestnet = [
    // Transaction 1 Invalid transaction ID
    {
        input: {
            params: [
                'INVALID_TRANSACTION_ID',
                {
                    tracer: 'callTracer',
                    timeout: '10s',
                    tracerConfig: { onlyTopCall: true }
                }
            ],
            expectedError: InvalidDataType
        }
    },
    // Transaction not exists
    {
        input: {
            params: [
                '0x000000000000000000000004e600000000000000000000000000000000000000',
                {
                    tracer: 'callTracer',
                    timeout: '10s',
                    tracerConfig: { onlyTopCall: true }
                }
            ],
            expectedError: ProviderRpcError
        }
    }
];

export {
    debugTraceTransactionPositiveCasesFixtureTestnet,
    debugTraceTransactionNegativeCasesFixtureTestnet
};
