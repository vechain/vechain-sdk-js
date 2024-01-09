import { expect } from 'expect';
import { HttpClient, ThorClient } from '@vechain/vechain-sdk-network';
import { contract, unitsUtils } from '@vechain/vechain-sdk-core';

// In this example we simulate a transaction of sending 1 VET to another account
// And we demonstrate (1) how we can check the expected gas cost and (2) whether the transaction is successful

// 1 - Create thor client for solo network
const _soloUrl = 'http://localhost:8669';
const soloNetwork = new HttpClient(_soloUrl);
const thorSoloClient = new ThorClient(soloNetwork);

// 2(a) - create the transaction for a VET transfer
const transaction1 = {
    clauses: [
        contract.clauseBuilder.transferVET(
            '0xb717b660cd51109334bd10b2c168986055f58c1a',
            unitsUtils.parseVET('1')
        )
    ],
    // Please note - this field one of the optional fields that may be passed (see SimulateTransactionOptions),
    // and is only required if you want to simulate a transaction
    simulateTransactionOptions: {
        caller: '0x7a28e7361fd10f4f058f9fefc77544349ecff5d6'
    }
};

// 2(b) - define the expected result
const expected1 = [
    {
        data: '0x',
        events: [],
        transfers: [
            {
                sender: '0x7a28e7361fd10f4f058f9fefc77544349ecff5d6',
                recipient: '0xb717b660cd51109334bd10b2c168986055f58c1a',
                amount: '0xde0b6b3a7640000' // hex represenation of 1000000000000000000 wei (1 VET)
            }
        ],
        gasUsed: 0,
        reverted: false,
        vmError: ''
    }
];

// 3 - Simulate the transaction
const simulatedTx1 = await thorSoloClient.transactions.simulateTransaction(
    transaction1.clauses,
    {
        ...transaction1.simulateTransactionOptions
    }
);

// 4 - Check the result - i.e. the gas used is returned and the transfer values are correct
// Note: VET transfers do not consume gas (no EVM computation)
expect(simulatedTx1[0].gasUsed).toEqual(expected1[0].gasUsed);
expect(simulatedTx1[0].transfers).toEqual(expected1[0].transfers);

// In this next example we simulate a Simulate smart contract deployment
// And we demonstrate how we can check the expected gas cost and whether the transaction would succeed

// 1(a) - create the transaction to simulate a smart deployment
const transaction3 = {
    clauses: [
        {
            to: null,
            value: '0',
            /**
             * Sample contract bytecode (Without constructor arguments)
             *
             * @remarks - When deploying a contract that requires constructor arguments, the encoded constructor must be appended to the bytecode
             *            Otherwise the contract might revert if the constructor arguments are required.
             */
            data: '0x60806040526040518060400160405280600681526020017f48656c6c6f210000000000000000000000000000000000000000000000000000815250600090816200004a9190620002d9565b503480156200005857600080fd5b50620003c0565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60006002820490506001821680620000e157607f821691505b602082108103620000f757620000f662000099565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b600060088302620001617fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8262000122565b6200016d868362000122565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b6000620001ba620001b4620001ae8462000185565b6200018f565b62000185565b9050919050565b6000819050919050565b620001d68362000199565b620001ee620001e582620001c1565b8484546200012f565b825550505050565b600090565b62000205620001f6565b62000212818484620001cb565b505050565b5b818110156200023a576200022e600082620001fb565b60018101905062000218565b5050565b601f82111562000289576200025381620000fd565b6200025e8462000112565b810160208510156200026e578190505b620002866200027d8562000112565b83018262000217565b50505b505050565b600082821c905092915050565b6000620002ae600019846008026200028e565b1980831691505092915050565b6000620002c983836200029b565b9150826002028217905092915050565b620002e4826200005f565b67ffffffffffffffff8111156200030057620002ff6200006a565b5b6200030c8254620000c8565b620003198282856200023e565b600060209050601f8311600181146200035157600084156200033c578287015190505b620003488582620002bb565b865550620003b8565b601f1984166200036186620000fd565b60005b828110156200038b5784890151825560018201915060208501945060208101905062000364565b86831015620003ab5784890151620003a7601f8916826200029b565b8355505b6001600288020188555050505b505050505050565b61081480620003d06000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c80631718ad881461004657806319ff1d211461007657806349da5de414610094575b600080fd5b610060600480360381019061005b91906102c1565b6100b0565b60405161006d919061037e565b60405180910390f35b61007e6101b5565b60405161008b919061037e565b60405180910390f35b6100ae60048036038101906100a99190610405565b610243565b005b606081600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603610122576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016101199061049e565b60405180910390fd5b6000805461012f906104ed565b80601f016020809104026020016040519081016040528092919081815260200182805461015b906104ed565b80156101a85780601f1061017d576101008083540402835291602001916101a8565b820191906000526020600020905b81548152906001019060200180831161018b57829003601f168201915b5050505050915050919050565b600080546101c2906104ed565b80601f01602080910402602001604051908101604052809291908181526020018280546101ee906104ed565b801561023b5780601f106102105761010080835404028352916020019161023b565b820191906000526020600020905b81548152906001019060200180831161021e57829003601f168201915b505050505081565b81816000918261025492919061070e565b505050565b600080fd5b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061028e82610263565b9050919050565b61029e81610283565b81146102a957600080fd5b50565b6000813590506102bb81610295565b92915050565b6000602082840312156102d7576102d6610259565b5b60006102e5848285016102ac565b91505092915050565b600081519050919050565b600082825260208201905092915050565b60005b8381101561032857808201518184015260208101905061030d565b60008484015250505050565b6000601f19601f8301169050919050565b6000610350826102ee565b61035a81856102f9565b935061036a81856020860161030a565b61037381610334565b840191505092915050565b600060208201905081810360008301526103988184610345565b905092915050565b600080fd5b600080fd5b600080fd5b60008083601f8401126103c5576103c46103a0565b5b8235905067ffffffffffffffff8111156103e2576103e16103a5565b5b6020830191508360018202830111156103fe576103fd6103aa565b5b9250929050565b6000806020838503121561041c5761041b610259565b5b600083013567ffffffffffffffff81111561043a5761043961025e565b5b610446858286016103af565b92509250509250929050565b7f496e76616c696420616464726573730000000000000000000000000000000000600082015250565b6000610488600f836102f9565b915061049382610452565b602082019050919050565b600060208201905081810360008301526104b78161047b565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061050557607f821691505b602082108103610518576105176104be565b5b50919050565b600082905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b6000600883026105ba7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8261057d565b6105c4868361057d565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b600061060b610606610601846105dc565b6105e6565b6105dc565b9050919050565b6000819050919050565b610625836105f0565b61063961063182610612565b84845461058a565b825550505050565b600090565b61064e610641565b61065981848461061c565b505050565b5b8181101561067d57610672600082610646565b60018101905061065f565b5050565b601f8211156106c25761069381610558565b61069c8461056d565b810160208510156106ab578190505b6106bf6106b78561056d565b83018261065e565b50505b505050565b600082821c905092915050565b60006106e5600019846008026106c7565b1980831691505092915050565b60006106fe83836106d4565b9150826002028217905092915050565b610718838361051e565b67ffffffffffffffff81111561073157610730610529565b5b61073b82546104ed565b610746828285610681565b6000601f8311600181146107755760008415610763578287013590505b61076d85826106f2565b8655506107d5565b601f19841661078386610558565b60005b828110156107ab57848901358255600182019150602085019450602081019050610786565b868310156107c857848901356107c4601f8916826106d4565b8355505b6001600288020188555050505b5050505050505056fea2646970667358221220131b1aac58b5047d715ef4f6d1b050c9a836905c50de69cf41edc485446e5f5f64736f6c63430008110033'
        }
    ]
};

// 1(b) - define the expected result
const expected3 = [
    {
        // compiled bytecode  of the smart contract
        data: '0x608060405234801561001057600080fd5b50600436106100415760003560e01c80631718ad881461004657806319ff1d211461007657806349da5de414610094575b600080fd5b610060600480360381019061005b91906102c1565b6100b0565b60405161006d919061037e565b60405180910390f35b61007e6101b5565b60405161008b919061037e565b60405180910390f35b6100ae60048036038101906100a99190610405565b610243565b005b606081600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603610122576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016101199061049e565b60405180910390fd5b6000805461012f906104ed565b80601f016020809104026020016040519081016040528092919081815260200182805461015b906104ed565b80156101a85780601f1061017d576101008083540402835291602001916101a8565b820191906000526020600020905b81548152906001019060200180831161018b57829003601f168201915b5050505050915050919050565b600080546101c2906104ed565b80601f01602080910402602001604051908101604052809291908181526020018280546101ee906104ed565b801561023b5780601f106102105761010080835404028352916020019161023b565b820191906000526020600020905b81548152906001019060200180831161021e57829003601f168201915b505050505081565b81816000918261025492919061070e565b505050565b600080fd5b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061028e82610263565b9050919050565b61029e81610283565b81146102a957600080fd5b50565b6000813590506102bb81610295565b92915050565b6000602082840312156102d7576102d6610259565b5b60006102e5848285016102ac565b91505092915050565b600081519050919050565b600082825260208201905092915050565b60005b8381101561032857808201518184015260208101905061030d565b60008484015250505050565b6000601f19601f8301169050919050565b6000610350826102ee565b61035a81856102f9565b935061036a81856020860161030a565b61037381610334565b840191505092915050565b600060208201905081810360008301526103988184610345565b905092915050565b600080fd5b600080fd5b600080fd5b60008083601f8401126103c5576103c46103a0565b5b8235905067ffffffffffffffff8111156103e2576103e16103a5565b5b6020830191508360018202830111156103fe576103fd6103aa565b5b9250929050565b6000806020838503121561041c5761041b610259565b5b600083013567ffffffffffffffff81111561043a5761043961025e565b5b610446858286016103af565b92509250509250929050565b7f496e76616c696420616464726573730000000000000000000000000000000000600082015250565b6000610488600f836102f9565b915061049382610452565b602082019050919050565b600060208201905081810360008301526104b78161047b565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061050557607f821691505b602082108103610518576105176104be565b5b50919050565b600082905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b6000600883026105ba7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8261057d565b6105c4868361057d565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b600061060b610606610601846105dc565b6105e6565b6105dc565b9050919050565b6000819050919050565b610625836105f0565b61063961063182610612565b84845461058a565b825550505050565b600090565b61064e610641565b61065981848461061c565b505050565b5b8181101561067d57610672600082610646565b60018101905061065f565b5050565b601f8211156106c25761069381610558565b61069c8461056d565b810160208510156106ab578190505b6106bf6106b78561056d565b83018261065e565b50505b505050565b600082821c905092915050565b60006106e5600019846008026106c7565b1980831691505092915050565b60006106fe83836106d4565b9150826002028217905092915050565b610718838361051e565b67ffffffffffffffff81111561073157610730610529565b5b61073b82546104ed565b610746828285610681565b6000601f8311600181146107755760008415610763578287013590505b61076d85826106f2565b8655506107d5565b601f19841661078386610558565b60005b828110156107ab57848901358255600182019150602085019450602081019050610786565b868310156107c857848901356107c4601f8916826106d4565b8355505b6001600288020188555050505b5050505050505056fea2646970667358221220131b1aac58b5047d715ef4f6d1b050c9a836905c50de69cf41edc485446e5f5f64736f6c63430008110033',
        events: [
            // Standard event emitted when simulating a deployment of a smart contract for VechainThor
            {
                address: '0x841a6556c524d47030762eb14dc4af897e605d9b',
                topics: [
                    '0xb35bf4274d4295009f1ec66ed3f579db287889444366c03d3a695539372e8951'
                ],
                data: '0x0000000000000000000000000000000000000000000000000000000000000000'
            }
        ],
        transfers: [],
        gasUsed: 434928, // The required gas to deploy the contract
        reverted: false,
        vmError: ''
    }
];

// 2 - Simulate the transaction
const simulatedTx3 = await thorSoloClient.transactions.simulateTransaction(
    transaction3.clauses
);

// 3 - Check the result
expect(JSON.stringify(simulatedTx3)).toStrictEqual(JSON.stringify(expected3));
