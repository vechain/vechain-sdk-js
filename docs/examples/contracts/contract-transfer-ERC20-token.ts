import { VIP180_ABI } from '@vechain/sdk-core';
import {
    type Contract,
    HttpClient,
    ThorClient,
    type TransactionReceipt
} from '@vechain/sdk-network';
import { expect } from 'expect';

const erc20ContractBytecode: string =
    '0x60806040523480156200001157600080fd5b506040518060400160405280600b81526020017f53616d706c65546f6b656e0000000000000000000000000000000000000000008152506040518060400160405280600281526020017f535400000000000000000000000000000000000000000000000000000000000081525081600390816200008f91906200062c565b508060049081620000a191906200062c565b505050620000e633620000b9620000ec60201b60201c565b60ff16600a620000ca919062000896565b620f4240620000da9190620008e7565b620000f560201b60201c565b62000a3a565b60006012905090565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036200016a5760006040517fec442f0500000000000000000000000000000000000000000000000000000000815260040162000161919062000977565b60405180910390fd5b6200017e600083836200018260201b60201c565b5050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603620001d8578060026000828254620001cb919062000994565b92505081905550620002ae565b60008060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490508181101562000267578381836040517fe450d38c0000000000000000000000000000000000000000000000000000000081526004016200025e93929190620009e0565b60405180910390fd5b8181036000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550505b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603620002f9578060026000828254039250508190555062000346565b806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055505b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051620003a5919062000a1d565b60405180910390a3505050565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806200043457607f821691505b6020821081036200044a5762000449620003ec565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b600060088302620004b47fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8262000475565b620004c0868362000475565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b60006200050d620005076200050184620004d8565b620004e2565b620004d8565b9050919050565b6000819050919050565b6200052983620004ec565b62000541620005388262000514565b84845462000482565b825550505050565b600090565b6200055862000549565b620005658184846200051e565b505050565b5b818110156200058d57620005816000826200054e565b6001810190506200056b565b5050565b601f821115620005dc57620005a68162000450565b620005b18462000465565b81016020851015620005c1578190505b620005d9620005d08562000465565b8301826200056a565b50505b505050565b600082821c905092915050565b60006200060160001984600802620005e1565b1980831691505092915050565b60006200061c8383620005ee565b9150826002028217905092915050565b6200063782620003b2565b67ffffffffffffffff811115620006535762000652620003bd565b5b6200065f82546200041b565b6200066c82828562000591565b600060209050601f831160018114620006a457600084156200068f578287015190505b6200069b85826200060e565b8655506200070b565b601f198416620006b48662000450565b60005b82811015620006de57848901518255600182019150602085019450602081019050620006b7565b86831015620006fe5784890151620006fa601f891682620005ee565b8355505b6001600288020188555050505b505050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60008160011c9050919050565b6000808291508390505b6001851115620007a15780860481111562000779576200077862000713565b5b6001851615620007895780820291505b8081029050620007998562000742565b945062000759565b94509492505050565b600082620007bc57600190506200088f565b81620007cc57600090506200088f565b8160018114620007e55760028114620007f05762000826565b60019150506200088f565b60ff84111562000805576200080462000713565b5b8360020a9150848211156200081f576200081e62000713565b5b506200088f565b5060208310610133831016604e8410600b8410161715620008605782820a9050838111156200085a576200085962000713565b5b6200088f565b6200086f84848460016200074f565b9250905081840481111562000889576200088862000713565b5b81810290505b9392505050565b6000620008a382620004d8565b9150620008b083620004d8565b9250620008df7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8484620007aa565b905092915050565b6000620008f482620004d8565b91506200090183620004d8565b92508282026200091181620004d8565b915082820484148315176200092b576200092a62000713565b5b5092915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006200095f8262000932565b9050919050565b620009718162000952565b82525050565b60006020820190506200098e600083018462000966565b92915050565b6000620009a182620004d8565b9150620009ae83620004d8565b9250828201905080821115620009c957620009c862000713565b5b92915050565b620009da81620004d8565b82525050565b6000606082019050620009f7600083018662000966565b62000a066020830185620009cf565b62000a156040830184620009cf565b949350505050565b600060208201905062000a346000830184620009cf565b92915050565b610e558062000a4a6000396000f3fe608060405234801561001057600080fd5b50600436106100935760003560e01c8063313ce56711610066578063313ce5671461013457806370a082311461015257806395d89b4114610182578063a9059cbb146101a0578063dd62ed3e146101d057610093565b806306fdde0314610098578063095ea7b3146100b657806318160ddd146100e657806323b872dd14610104575b600080fd5b6100a0610200565b6040516100ad9190610aa9565b60405180910390f35b6100d060048036038101906100cb9190610b64565b610292565b6040516100dd9190610bbf565b60405180910390f35b6100ee6102b5565b6040516100fb9190610be9565b60405180910390f35b61011e60048036038101906101199190610c04565b6102bf565b60405161012b9190610bbf565b60405180910390f35b61013c6102ee565b6040516101499190610c73565b60405180910390f35b61016c60048036038101906101679190610c8e565b6102f7565b6040516101799190610be9565b60405180910390f35b61018a61033f565b6040516101979190610aa9565b60405180910390f35b6101ba60048036038101906101b59190610b64565b6103d1565b6040516101c79190610bbf565b60405180910390f35b6101ea60048036038101906101e59190610cbb565b6103f4565b6040516101f79190610be9565b60405180910390f35b60606003805461020f90610d2a565b80601f016020809104026020016040519081016040528092919081815260200182805461023b90610d2a565b80156102885780601f1061025d57610100808354040283529160200191610288565b820191906000526020600020905b81548152906001019060200180831161026b57829003601f168201915b5050505050905090565b60008061029d61047b565b90506102aa818585610483565b600191505092915050565b6000600254905090565b6000806102ca61047b565b90506102d7858285610495565b6102e2858585610529565b60019150509392505050565b60006012905090565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b60606004805461034e90610d2a565b80601f016020809104026020016040519081016040528092919081815260200182805461037a90610d2a565b80156103c75780601f1061039c576101008083540402835291602001916103c7565b820191906000526020600020905b8154815290600101906020018083116103aa57829003601f168201915b5050505050905090565b6000806103dc61047b565b90506103e9818585610529565b600191505092915050565b6000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b600033905090565b610490838383600161061d565b505050565b60006104a184846103f4565b90507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff81146105235781811015610513578281836040517ffb8f41b200000000000000000000000000000000000000000000000000000000815260040161050a93929190610d6a565b60405180910390fd5b6105228484848403600061061d565b5b50505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff160361059b5760006040517f96c6fd1e0000000000000000000000000000000000000000000000000000000081526004016105929190610da1565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff160361060d5760006040517fec442f050000000000000000000000000000000000000000000000000000000081526004016106049190610da1565b60405180910390fd5b6106188383836107f4565b505050565b600073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff160361068f5760006040517fe602df050000000000000000000000000000000000000000000000000000000081526004016106869190610da1565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16036107015760006040517f94280d620000000000000000000000000000000000000000000000000000000081526004016106f89190610da1565b60405180910390fd5b81600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555080156107ee578273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040516107e59190610be9565b60405180910390a35b50505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff160361084657806002600082825461083a9190610deb565b92505081905550610919565b60008060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050818110156108d2578381836040517fe450d38c0000000000000000000000000000000000000000000000000000000081526004016108c993929190610d6a565b60405180910390fd5b8181036000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550505b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff160361096257806002600082825403925050819055506109af565b806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055505b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051610a0c9190610be9565b60405180910390a3505050565b600081519050919050565b600082825260208201905092915050565b60005b83811015610a53578082015181840152602081019050610a38565b60008484015250505050565b6000601f19601f8301169050919050565b6000610a7b82610a19565b610a858185610a24565b9350610a95818560208601610a35565b610a9e81610a5f565b840191505092915050565b60006020820190508181036000830152610ac38184610a70565b905092915050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610afb82610ad0565b9050919050565b610b0b81610af0565b8114610b1657600080fd5b50565b600081359050610b2881610b02565b92915050565b6000819050919050565b610b4181610b2e565b8114610b4c57600080fd5b50565b600081359050610b5e81610b38565b92915050565b60008060408385031215610b7b57610b7a610acb565b5b6000610b8985828601610b19565b9250506020610b9a85828601610b4f565b9150509250929050565b60008115159050919050565b610bb981610ba4565b82525050565b6000602082019050610bd46000830184610bb0565b92915050565b610be381610b2e565b82525050565b6000602082019050610bfe6000830184610bda565b92915050565b600080600060608486031215610c1d57610c1c610acb565b5b6000610c2b86828701610b19565b9350506020610c3c86828701610b19565b9250506040610c4d86828701610b4f565b9150509250925092565b600060ff82169050919050565b610c6d81610c57565b82525050565b6000602082019050610c886000830184610c64565b92915050565b600060208284031215610ca457610ca3610acb565b5b6000610cb284828501610b19565b91505092915050565b60008060408385031215610cd257610cd1610acb565b5b6000610ce085828601610b19565b9250506020610cf185828601610b19565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60006002820490506001821680610d4257607f821691505b602082108103610d5557610d54610cfb565b5b50919050565b610d6481610af0565b82525050565b6000606082019050610d7f6000830186610d5b565b610d8c6020830185610bda565b610d996040830184610bda565b949350505050565b6000602082019050610db66000830184610d5b565b92915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000610df682610b2e565b9150610e0183610b2e565b9250828201905080821115610e1957610e18610dbc565b5b9291505056fea2646970667358221220912f5265edaea44910db734f0d00fccd257c78dba79c126931551eaad1a334f764736f6c63430008170033';

// Defining the private key for the deployer account, which has VTHO for deployment costs
const privateKeyDeployer =
    '706e6acd567fdc22db54aead12cb39db01c4832f149f95299aa8dd8bef7d28ff';

// Create thor client for solo network
const _soloUrl = 'http://localhost:8669/';
const soloNetwork = new HttpClient(_soloUrl);
const thorSoloClient = new ThorClient(soloNetwork);

// Defining a function for deploying the ERC20 contract
const setupERC20Contract = async (): Promise<Contract> => {
    const contractFactory = thorSoloClient.contracts.createContractFactory(
        VIP180_ABI,
        erc20ContractBytecode,
        privateKeyDeployer
    );

    // Deploying the contract
    await contractFactory.startDeployment();

    // Waiting for the contract to be deployed
    return await contractFactory.waitForDeployment();
};

// Setting up the ERC20 contract and getting its address
const contract = await setupERC20Contract();

// START_SNIPPET: ERC20FunctionCallSnippet

const transferResult = await contract.transact.transfer(
    '0x9e7911de289c3c856ce7f421034f66b6cde49c39',
    10000
);

// Wait for the transfer transaction to complete and obtain its receipt
const transactionReceiptTransfer =
    (await transferResult.wait()) as TransactionReceipt;

// Asserting that the transaction has not been reverted
expect(transactionReceiptTransfer.reverted).toEqual(false);

// END_SNIPPET: ERC20FunctionCallSnippet
