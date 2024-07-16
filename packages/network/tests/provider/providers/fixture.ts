import { Quantity, unitsUtils } from '@vechain/sdk-core';
import { zeroBlock } from '../rpc-mapper/methods/eth_getBlockByNumber/fixture';
import {
    validTransactionDetailTestnet,
    validTransactionHashTestnet
} from '../fixture';
import {
    TESTING_CONTRACT_ADDRESS,
    TESTING_CONTRACT_BYTECODE
} from '../../fixture';
import { THOR_SOLO_ACCOUNTS } from '@vechain/sdk-constant';

/**
 * Test cases for provider methods - Testnet
 */
const providerMethodsTestCasesTestnet = [
    {
        description:
            "Should be able to call eth_getBlockByNumber with '0x0' as the block number",
        method: 'eth_getBlockByNumber',
        params: [Quantity.of(0), false],
        expected: zeroBlock
    },
    {
        description: 'Should be able to call eth_chainId',
        method: 'eth_chainId',
        params: [],
        expected: '0x186aa'
    },
    {
        description: `Should be able to call eth_getTransactionByHash with ${validTransactionHashTestnet} as the transaction hash`,
        method: 'eth_getTransactionByHash',
        params: [validTransactionHashTestnet],
        expected: validTransactionDetailTestnet
    }
];

/**
 * Test cases for provider methods - Solo Network
 */
const providerMethodsTestCasesSolo = [
    {
        description:
            'Should be able to call eth_getBalance of an address with balance more than 0 VET',
        method: 'eth_getBalance',
        params: [THOR_SOLO_ACCOUNTS[0].address, 'latest'],
        expected: Quantity.of(unitsUtils.parseVET('500000000'))
    },
    {
        description: 'Should be able to call eth_getCode of a smart contract',
        method: 'eth_getCode',
        params: [TESTING_CONTRACT_ADDRESS, 'latest'],
        expected: TESTING_CONTRACT_BYTECODE
    }
];

const logsInput = {
    address: [
        '0x0000000000000000000000000000456e65726779',
        '0x0000000000000000000000000000456e65726779'
    ],
    fromBlock: Quantity.of(0),
    toBlock: Quantity.of(100000),
    topics: [
        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
        '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e',
        '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e'
    ]
};

/**
 * Test cases for provider methods - Mainnet
 */
const providerMethodsTestCasesMainnet = [
    {
        description:
            'Should be able to call eth_getStorageAt of a smart contract that has a storage slot not empty',
        method: 'eth_getStorageAt',
        params: [
            '0x93Ae8aab337E58A6978E166f8132F59652cA6C56', // Contract with non-null storage slot at position 1
            '0x1',
            '0x10afdf1' // Block n. 17497585
        ],
        expected:
            '0x0000000000000000000000000000000000000000000000000000000061474260'
    }
];

const ERC20_BYTECODE: string =
    '0x60806040523480156200001157600080fd5b506040518060400160405280600b81526020017f53616d706c65546f6b656e0000000000000000000000000000000000000000008152506040518060400160405280600281526020017f535400000000000000000000000000000000000000000000000000000000000081525081600390816200008f91906200062c565b508060049081620000a191906200062c565b505050620000e633620000b9620000ec60201b60201c565b60ff16600a620000ca919062000896565b620f4240620000da9190620008e7565b620000f560201b60201c565b62000a3a565b60006012905090565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036200016a5760006040517fec442f0500000000000000000000000000000000000000000000000000000000815260040162000161919062000977565b60405180910390fd5b6200017e600083836200018260201b60201c565b5050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603620001d8578060026000828254620001cb919062000994565b92505081905550620002ae565b60008060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490508181101562000267578381836040517fe450d38c0000000000000000000000000000000000000000000000000000000081526004016200025e93929190620009e0565b60405180910390fd5b8181036000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550505b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603620002f9578060026000828254039250508190555062000346565b806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055505b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051620003a5919062000a1d565b60405180910390a3505050565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806200043457607f821691505b6020821081036200044a5762000449620003ec565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b600060088302620004b47fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8262000475565b620004c0868362000475565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b60006200050d620005076200050184620004d8565b620004e2565b620004d8565b9050919050565b6000819050919050565b6200052983620004ec565b62000541620005388262000514565b84845462000482565b825550505050565b600090565b6200055862000549565b620005658184846200051e565b505050565b5b818110156200058d57620005816000826200054e565b6001810190506200056b565b5050565b601f821115620005dc57620005a68162000450565b620005b18462000465565b81016020851015620005c1578190505b620005d9620005d08562000465565b8301826200056a565b50505b505050565b600082821c905092915050565b60006200060160001984600802620005e1565b1980831691505092915050565b60006200061c8383620005ee565b9150826002028217905092915050565b6200063782620003b2565b67ffffffffffffffff811115620006535762000652620003bd565b5b6200065f82546200041b565b6200066c82828562000591565b600060209050601f831160018114620006a457600084156200068f578287015190505b6200069b85826200060e565b8655506200070b565b601f198416620006b48662000450565b60005b82811015620006de57848901518255600182019150602085019450602081019050620006b7565b86831015620006fe5784890151620006fa601f891682620005ee565b8355505b6001600288020188555050505b505050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60008160011c9050919050565b6000808291508390505b6001851115620007a15780860481111562000779576200077862000713565b5b6001851615620007895780820291505b8081029050620007998562000742565b945062000759565b94509492505050565b600082620007bc57600190506200088f565b81620007cc57600090506200088f565b8160018114620007e55760028114620007f05762000826565b60019150506200088f565b60ff84111562000805576200080462000713565b5b8360020a9150848211156200081f576200081e62000713565b5b506200088f565b5060208310610133831016604e8410600b8410161715620008605782820a9050838111156200085a576200085962000713565b5b6200088f565b6200086f84848460016200074f565b9250905081840481111562000889576200088862000713565b5b81810290505b9392505050565b6000620008a382620004d8565b9150620008b083620004d8565b9250620008df7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8484620007aa565b905092915050565b6000620008f482620004d8565b91506200090183620004d8565b92508282026200091181620004d8565b915082820484148315176200092b576200092a62000713565b5b5092915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006200095f8262000932565b9050919050565b620009718162000952565b82525050565b60006020820190506200098e600083018462000966565b92915050565b6000620009a182620004d8565b9150620009ae83620004d8565b9250828201905080821115620009c957620009c862000713565b5b92915050565b620009da81620004d8565b82525050565b6000606082019050620009f7600083018662000966565b62000a066020830185620009cf565b62000a156040830184620009cf565b949350505050565b600060208201905062000a346000830184620009cf565b92915050565b610e558062000a4a6000396000f3fe608060405234801561001057600080fd5b50600436106100935760003560e01c8063313ce56711610066578063313ce5671461013457806370a082311461015257806395d89b4114610182578063a9059cbb146101a0578063dd62ed3e146101d057610093565b806306fdde0314610098578063095ea7b3146100b657806318160ddd146100e657806323b872dd14610104575b600080fd5b6100a0610200565b6040516100ad9190610aa9565b60405180910390f35b6100d060048036038101906100cb9190610b64565b610292565b6040516100dd9190610bbf565b60405180910390f35b6100ee6102b5565b6040516100fb9190610be9565b60405180910390f35b61011e60048036038101906101199190610c04565b6102bf565b60405161012b9190610bbf565b60405180910390f35b61013c6102ee565b6040516101499190610c73565b60405180910390f35b61016c60048036038101906101679190610c8e565b6102f7565b6040516101799190610be9565b60405180910390f35b61018a61033f565b6040516101979190610aa9565b60405180910390f35b6101ba60048036038101906101b59190610b64565b6103d1565b6040516101c79190610bbf565b60405180910390f35b6101ea60048036038101906101e59190610cbb565b6103f4565b6040516101f79190610be9565b60405180910390f35b60606003805461020f90610d2a565b80601f016020809104026020016040519081016040528092919081815260200182805461023b90610d2a565b80156102885780601f1061025d57610100808354040283529160200191610288565b820191906000526020600020905b81548152906001019060200180831161026b57829003601f168201915b5050505050905090565b60008061029d61047b565b90506102aa818585610483565b600191505092915050565b6000600254905090565b6000806102ca61047b565b90506102d7858285610495565b6102e2858585610529565b60019150509392505050565b60006012905090565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b60606004805461034e90610d2a565b80601f016020809104026020016040519081016040528092919081815260200182805461037a90610d2a565b80156103c75780601f1061039c576101008083540402835291602001916103c7565b820191906000526020600020905b8154815290600101906020018083116103aa57829003601f168201915b5050505050905090565b6000806103dc61047b565b90506103e9818585610529565b600191505092915050565b6000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b600033905090565b610490838383600161061d565b505050565b60006104a184846103f4565b90507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff81146105235781811015610513578281836040517ffb8f41b200000000000000000000000000000000000000000000000000000000815260040161050a93929190610d6a565b60405180910390fd5b6105228484848403600061061d565b5b50505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff160361059b5760006040517f96c6fd1e0000000000000000000000000000000000000000000000000000000081526004016105929190610da1565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff160361060d5760006040517fec442f050000000000000000000000000000000000000000000000000000000081526004016106049190610da1565b60405180910390fd5b6106188383836107f4565b505050565b600073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff160361068f5760006040517fe602df050000000000000000000000000000000000000000000000000000000081526004016106869190610da1565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16036107015760006040517f94280d620000000000000000000000000000000000000000000000000000000081526004016106f89190610da1565b60405180910390fd5b81600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555080156107ee578273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040516107e59190610be9565b60405180910390a35b50505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff160361084657806002600082825461083a9190610deb565b92505081905550610919565b60008060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050818110156108d2578381836040517fe450d38c0000000000000000000000000000000000000000000000000000000081526004016108c993929190610d6a565b60405180910390fd5b8181036000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550505b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff160361096257806002600082825403925050819055506109af565b806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055505b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051610a0c9190610be9565b60405180910390a3505050565b600081519050919050565b600082825260208201905092915050565b60005b83811015610a53578082015181840152602081019050610a38565b60008484015250505050565b6000601f19601f8301169050919050565b6000610a7b82610a19565b610a858185610a24565b9350610a95818560208601610a35565b610a9e81610a5f565b840191505092915050565b60006020820190508181036000830152610ac38184610a70565b905092915050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610afb82610ad0565b9050919050565b610b0b81610af0565b8114610b1657600080fd5b50565b600081359050610b2881610b02565b92915050565b6000819050919050565b610b4181610b2e565b8114610b4c57600080fd5b50565b600081359050610b5e81610b38565b92915050565b60008060408385031215610b7b57610b7a610acb565b5b6000610b8985828601610b19565b9250506020610b9a85828601610b4f565b9150509250929050565b60008115159050919050565b610bb981610ba4565b82525050565b6000602082019050610bd46000830184610bb0565b92915050565b610be381610b2e565b82525050565b6000602082019050610bfe6000830184610bda565b92915050565b600080600060608486031215610c1d57610c1c610acb565b5b6000610c2b86828701610b19565b9350506020610c3c86828701610b19565b9250506040610c4d86828701610b4f565b9150509250925092565b600060ff82169050919050565b610c6d81610c57565b82525050565b6000602082019050610c886000830184610c64565b92915050565b600060208284031215610ca457610ca3610acb565b5b6000610cb284828501610b19565b91505092915050565b60008060408385031215610cd257610cd1610acb565b5b6000610ce085828601610b19565b9250506020610cf185828601610b19565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60006002820490506001821680610d4257607f821691505b602082108103610d5557610d54610cfb565b5b50919050565b610d6481610af0565b82525050565b6000606082019050610d7f6000830186610d5b565b610d8c6020830185610bda565b610d996040830184610bda565b949350505050565b6000602082019050610db66000830184610d5b565b92915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000610df682610b2e565b9150610e0183610b2e565b9250828201905080821115610e1957610e18610dbc565b5b9291505056fea2646970667358221220912f5265edaea44910db734f0d00fccd257c78dba79c126931551eaad1a334f764736f6c63430008170033';

const ERC721_BYTECODE: string =
    '0x60806040523480156200001157600080fd5b506040518060400160405280600981526020017f53616d706c654e465400000000000000000000000000000000000000000000008152506040518060400160405280600481526020017f534e46540000000000000000000000000000000000000000000000000000000081525081600090816200008f919062000324565b508060019081620000a1919062000324565b5050506200040b565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806200012c57607f821691505b602082108103620001425762000141620000e4565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b600060088302620001ac7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff826200016d565b620001b886836200016d565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b600062000205620001ff620001f984620001d0565b620001da565b620001d0565b9050919050565b6000819050919050565b6200022183620001e4565b6200023962000230826200020c565b8484546200017a565b825550505050565b600090565b6200025062000241565b6200025d81848462000216565b505050565b5b8181101562000285576200027960008262000246565b60018101905062000263565b5050565b601f821115620002d4576200029e8162000148565b620002a9846200015d565b81016020851015620002b9578190505b620002d1620002c8856200015d565b83018262000262565b50505b505050565b600082821c905092915050565b6000620002f960001984600802620002d9565b1980831691505092915050565b6000620003148383620002e6565b9150826002028217905092915050565b6200032f82620000aa565b67ffffffffffffffff8111156200034b576200034a620000b5565b5b62000357825462000113565b6200036482828562000289565b600060209050601f8311600181146200039c576000841562000387578287015190505b62000393858262000306565b86555062000403565b601f198416620003ac8662000148565b60005b82811015620003d657848901518255600182019150602085019450602081019050620003af565b86831015620003f65784890151620003f2601f891682620002e6565b8355505b6001600288020188555050505b505050505050565b611ea0806200041b6000396000f3fe608060405234801561001057600080fd5b50600436106100ea5760003560e01c8063691c65d41161008c578063a22cb46511610066578063a22cb4651461026f578063b88d4fde1461028b578063c87b56dd146102a7578063e985e9c5146102d7576100ea565b8063691c65d4146101f157806370a082311461022157806395d89b4114610251576100ea565b8063095ea7b3116100c8578063095ea7b31461016d57806323b872dd1461018957806342842e0e146101a55780636352211e146101c1576100ea565b806301ffc9a7146100ef57806306fdde031461011f578063081812fc1461013d575b600080fd5b61010960048036038101906101049190611673565b610307565b60405161011691906116bb565b60405180910390f35b6101276103e9565b6040516101349190611766565b60405180910390f35b610157600480360381019061015291906117be565b61047b565b604051610164919061182c565b60405180910390f35b61018760048036038101906101829190611873565b610497565b005b6101a3600480360381019061019e91906118b3565b6104ad565b005b6101bf60048036038101906101ba91906118b3565b6105af565b005b6101db60048036038101906101d691906117be565b6105cf565b6040516101e8919061182c565b60405180910390f35b61020b60048036038101906102069190611906565b6105e1565b6040516102189190611942565b60405180910390f35b61023b60048036038101906102369190611906565b610610565b6040516102489190611942565b60405180910390f35b6102596106ca565b6040516102669190611766565b60405180910390f35b61028960048036038101906102849190611989565b61075c565b005b6102a560048036038101906102a09190611afe565b610772565b005b6102c160048036038101906102bc91906117be565b61078f565b6040516102ce9190611766565b60405180910390f35b6102f160048036038101906102ec9190611b81565b6107f8565b6040516102fe91906116bb565b60405180910390f35b60007f80ac58cd000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191614806103d257507f5b5e139f000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916145b806103e257506103e18261088c565b5b9050919050565b6060600080546103f890611bf0565b80601f016020809104026020016040519081016040528092919081815260200182805461042490611bf0565b80156104715780601f1061044657610100808354040283529160200191610471565b820191906000526020600020905b81548152906001019060200180831161045457829003601f168201915b5050505050905090565b6000610486826108f6565b506104908261097e565b9050919050565b6104a982826104a46109bb565b6109c3565b5050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff160361051f5760006040517f64a0ae92000000000000000000000000000000000000000000000000000000008152600401610516919061182c565b60405180910390fd5b6000610533838361052e6109bb565b6109d5565b90508373ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16146105a9578382826040517f64283d7b0000000000000000000000000000000000000000000000000000000081526004016105a093929190611c21565b60405180910390fd5b50505050565b6105ca83838360405180602001604052806000815250610772565b505050565b60006105da826108f6565b9050919050565b600080600660008154809291906105f790611c87565b9190505590506106078382610bef565b80915050919050565b60008073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036106835760006040517f89c62b6400000000000000000000000000000000000000000000000000000000815260040161067a919061182c565b60405180910390fd5b600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b6060600180546106d990611bf0565b80601f016020809104026020016040519081016040528092919081815260200182805461070590611bf0565b80156107525780601f1061072757610100808354040283529160200191610752565b820191906000526020600020905b81548152906001019060200180831161073557829003601f168201915b5050505050905090565b61076e6107676109bb565b8383610c0d565b5050565b61077d8484846104ad565b61078984848484610d7c565b50505050565b606061079a826108f6565b5060006107a5610f33565b905060008151116107c557604051806020016040528060008152506107f0565b806107cf84610f4a565b6040516020016107e0929190611d0b565b6040516020818303038152906040525b915050919050565b6000600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16905092915050565b60007f01ffc9a7000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149050919050565b60008061090283611018565b9050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff160361097557826040517f7e27328900000000000000000000000000000000000000000000000000000000815260040161096c9190611942565b60405180910390fd5b80915050919050565b60006004600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b600033905090565b6109d08383836001611055565b505050565b6000806109e184611018565b9050600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614610a2357610a2281848661121a565b5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614610ab457610a65600085600080611055565b6001600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825403925050819055505b600073ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff1614610b37576001600360008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055505b846002600086815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550838573ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a4809150509392505050565b610c098282604051806020016040528060008152506112de565b5050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610c7e57816040517f5b08ba18000000000000000000000000000000000000000000000000000000008152600401610c75919061182c565b60405180910390fd5b80600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c3183604051610d6f91906116bb565b60405180910390a3505050565b60008373ffffffffffffffffffffffffffffffffffffffff163b1115610f2d578273ffffffffffffffffffffffffffffffffffffffff1663150b7a02610dc06109bb565b8685856040518563ffffffff1660e01b8152600401610de29493929190611d84565b6020604051808303816000875af1925050508015610e1e57506040513d601f19601f82011682018060405250810190610e1b9190611de5565b60015b610ea2573d8060008114610e4e576040519150601f19603f3d011682016040523d82523d6000602084013e610e53565b606091505b506000815103610e9a57836040517f64a0ae92000000000000000000000000000000000000000000000000000000008152600401610e91919061182c565b60405180910390fd5b805181602001fd5b63150b7a0260e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191614610f2b57836040517f64a0ae92000000000000000000000000000000000000000000000000000000008152600401610f22919061182c565b60405180910390fd5b505b50505050565b606060405180602001604052806000815250905090565b606060006001610f59846112fa565b01905060008167ffffffffffffffff811115610f7857610f776119d3565b5b6040519080825280601f01601f191660200182016040528015610faa5781602001600182028036833780820191505090505b509050600082602001820190505b60011561100d578080600190039150507f3031323334353637383961626364656600000000000000000000000000000000600a86061a8153600a858161100157611000611e12565b5b04945060008503610fb8575b819350505050919050565b60006002600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b808061108e5750600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614155b156111c257600061109e846108f6565b9050600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415801561110957508273ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614155b801561111c575061111a81846107f8565b155b1561115e57826040517fa9fbf51f000000000000000000000000000000000000000000000000000000008152600401611155919061182c565b60405180910390fd5b81156111c057838573ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45b505b836004600085815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050505050565b61122583838361144d565b6112d957600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff160361129a57806040517f7e2732890000000000000000000000000000000000000000000000000000000081526004016112919190611942565b60405180910390fd5b81816040517f177e802f0000000000000000000000000000000000000000000000000000000081526004016112d0929190611e41565b60405180910390fd5b505050565b6112e8838361150e565b6112f56000848484610d7c565b505050565b600080600090507a184f03e93ff9f4daa797ed6e38ed64bf6a1f0100000000000000008310611358577a184f03e93ff9f4daa797ed6e38ed64bf6a1f010000000000000000838161134e5761134d611e12565b5b0492506040810190505b6d04ee2d6d415b85acef81000000008310611395576d04ee2d6d415b85acef8100000000838161138b5761138a611e12565b5b0492506020810190505b662386f26fc1000083106113c457662386f26fc1000083816113ba576113b9611e12565b5b0492506010810190505b6305f5e10083106113ed576305f5e10083816113e3576113e2611e12565b5b0492506008810190505b612710831061141257612710838161140857611407611e12565b5b0492506004810190505b60648310611435576064838161142b5761142a611e12565b5b0492506002810190505b600a8310611444576001810190505b80915050919050565b60008073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415801561150557508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff1614806114c657506114c584846107f8565b5b8061150457508273ffffffffffffffffffffffffffffffffffffffff166114ec8361097e565b73ffffffffffffffffffffffffffffffffffffffff16145b5b90509392505050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036115805760006040517f64a0ae92000000000000000000000000000000000000000000000000000000008152600401611577919061182c565b60405180910390fd5b600061158e838360006109d5565b9050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16146116025760006040517f73c6ac6e0000000000000000000000000000000000000000000000000000000081526004016115f9919061182c565b60405180910390fd5b505050565b6000604051905090565b600080fd5b600080fd5b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b6116508161161b565b811461165b57600080fd5b50565b60008135905061166d81611647565b92915050565b60006020828403121561168957611688611611565b5b60006116978482850161165e565b91505092915050565b60008115159050919050565b6116b5816116a0565b82525050565b60006020820190506116d060008301846116ac565b92915050565b600081519050919050565b600082825260208201905092915050565b60005b838110156117105780820151818401526020810190506116f5565b60008484015250505050565b6000601f19601f8301169050919050565b6000611738826116d6565b61174281856116e1565b93506117528185602086016116f2565b61175b8161171c565b840191505092915050565b60006020820190508181036000830152611780818461172d565b905092915050565b6000819050919050565b61179b81611788565b81146117a657600080fd5b50565b6000813590506117b881611792565b92915050565b6000602082840312156117d4576117d3611611565b5b60006117e2848285016117a9565b91505092915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000611816826117eb565b9050919050565b6118268161180b565b82525050565b6000602082019050611841600083018461181d565b92915050565b6118508161180b565b811461185b57600080fd5b50565b60008135905061186d81611847565b92915050565b6000806040838503121561188a57611889611611565b5b60006118988582860161185e565b92505060206118a9858286016117a9565b9150509250929050565b6000806000606084860312156118cc576118cb611611565b5b60006118da8682870161185e565b93505060206118eb8682870161185e565b92505060406118fc868287016117a9565b9150509250925092565b60006020828403121561191c5761191b611611565b5b600061192a8482850161185e565b91505092915050565b61193c81611788565b82525050565b60006020820190506119576000830184611933565b92915050565b611966816116a0565b811461197157600080fd5b50565b6000813590506119838161195d565b92915050565b600080604083850312156119a05761199f611611565b5b60006119ae8582860161185e565b92505060206119bf85828601611974565b9150509250929050565b600080fd5b600080fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b611a0b8261171c565b810181811067ffffffffffffffff82111715611a2a57611a296119d3565b5b80604052505050565b6000611a3d611607565b9050611a498282611a02565b919050565b600067ffffffffffffffff821115611a6957611a686119d3565b5b611a728261171c565b9050602081019050919050565b82818337600083830152505050565b6000611aa1611a9c84611a4e565b611a33565b905082815260208101848484011115611abd57611abc6119ce565b5b611ac8848285611a7f565b509392505050565b600082601f830112611ae557611ae46119c9565b5b8135611af5848260208601611a8e565b91505092915050565b60008060008060808587031215611b1857611b17611611565b5b6000611b268782880161185e565b9450506020611b378782880161185e565b9350506040611b48878288016117a9565b925050606085013567ffffffffffffffff811115611b6957611b68611616565b5b611b7587828801611ad0565b91505092959194509250565b60008060408385031215611b9857611b97611611565b5b6000611ba68582860161185e565b9250506020611bb78582860161185e565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60006002820490506001821680611c0857607f821691505b602082108103611c1b57611c1a611bc1565b5b50919050565b6000606082019050611c36600083018661181d565b611c436020830185611933565b611c50604083018461181d565b949350505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000611c9282611788565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8203611cc457611cc3611c58565b5b600182019050919050565b600081905092915050565b6000611ce5826116d6565b611cef8185611ccf565b9350611cff8185602086016116f2565b80840191505092915050565b6000611d178285611cda565b9150611d238284611cda565b91508190509392505050565b600081519050919050565b600082825260208201905092915050565b6000611d5682611d2f565b611d608185611d3a565b9350611d708185602086016116f2565b611d798161171c565b840191505092915050565b6000608082019050611d99600083018761181d565b611da6602083018661181d565b611db36040830185611933565b8181036060830152611dc58184611d4b565b905095945050505050565b600081519050611ddf81611647565b92915050565b600060208284031215611dfb57611dfa611611565b5b6000611e0984828501611dd0565b91505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b6000604082019050611e56600083018561181d565b611e636020830184611933565b939250505056fea2646970667358221220af86505f0580469a6f5c34114f42782e33b1678efb535f9aeaeb0817e598ec2c64736f6c63430008160033';

const ERC20_ABI = [
    { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
    {
        inputs: [
            { internalType: 'address', name: 'spender', type: 'address' },
            { internalType: 'uint256', name: 'allowance', type: 'uint256' },
            { internalType: 'uint256', name: 'needed', type: 'uint256' }
        ],
        name: 'ERC20InsufficientAllowance',
        type: 'error'
    },
    {
        inputs: [
            { internalType: 'address', name: 'sender', type: 'address' },
            { internalType: 'uint256', name: 'balance', type: 'uint256' },
            { internalType: 'uint256', name: 'needed', type: 'uint256' }
        ],
        name: 'ERC20InsufficientBalance',
        type: 'error'
    },
    {
        inputs: [
            { internalType: 'address', name: 'approver', type: 'address' }
        ],
        name: 'ERC20InvalidApprover',
        type: 'error'
    },
    {
        inputs: [
            { internalType: 'address', name: 'receiver', type: 'address' }
        ],
        name: 'ERC20InvalidReceiver',
        type: 'error'
    },
    {
        inputs: [{ internalType: 'address', name: 'sender', type: 'address' }],
        name: 'ERC20InvalidSender',
        type: 'error'
    },
    {
        inputs: [{ internalType: 'address', name: 'spender', type: 'address' }],
        name: 'ERC20InvalidSpender',
        type: 'error'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'owner',
                type: 'address'
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'spender',
                type: 'address'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'value',
                type: 'uint256'
            }
        ],
        name: 'Approval',
        type: 'event'
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'from',
                type: 'address'
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'to',
                type: 'address'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'value',
                type: 'uint256'
            }
        ],
        name: 'Transfer',
        type: 'event'
    },
    {
        inputs: [
            { internalType: 'address', name: 'owner', type: 'address' },
            { internalType: 'address', name: 'spender', type: 'address' }
        ],
        name: 'allowance',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'address', name: 'spender', type: 'address' },
            { internalType: 'uint256', name: 'value', type: 'uint256' }
        ],
        name: 'approve',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'decimals',
        outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'name',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'symbol',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'totalSupply',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'address', name: 'to', type: 'address' },
            { internalType: 'uint256', name: 'value', type: 'uint256' }
        ],
        name: 'transfer',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            { internalType: 'address', name: 'from', type: 'address' },
            { internalType: 'address', name: 'to', type: 'address' },
            { internalType: 'uint256', name: 'value', type: 'uint256' }
        ],
        name: 'transferFrom',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function'
    }
] as const;

const TEST_ACCOUNT: { privateKey: string; address: string } = {
    privateKey:
        '706e6acd567fdc22db54aead12cb39db01c4832f149f95299aa8dd8bef7d28ff',
    address: '0xf02f557c753edf5fcdcbfe4c1c3a448b3cc84d54'
};

export {
    providerMethodsTestCasesTestnet,
    providerMethodsTestCasesSolo,
    providerMethodsTestCasesMainnet,
    logsInput,
    ERC20_BYTECODE,
    ERC20_ABI,
    ERC721_BYTECODE,
    TEST_ACCOUNT
};
