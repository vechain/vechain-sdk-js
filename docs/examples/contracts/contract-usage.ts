import {
    ProviderInternalBaseWallet,
    type ProviderInternalWalletAccount,
    THOR_SOLO_URL,
    ThorClient,
    VeChainProvider
} from '@vechain/sdk-network';
import { expect } from 'expect';
import { HexUInt } from '@vechain/sdk-core';

// START_SNIPPET: ContractUsageSnippet

// 1 - Create thor client for solo network

const thorSoloClient = ThorClient.at(THOR_SOLO_URL);

// 2 - Prepare signer and provider

// Defining the deployer account, which has VTHO for deployment costs
const deployerAccount: ProviderInternalWalletAccount = {
    privateKey: HexUInt.of(
        '706e6acd567fdc22db54aead12cb39db01c4832f149f95299aa8dd8bef7d28ff'
    ).bytes,
    address: '0xf02f557c753edf5fcdcbfe4c1c3a448b3cc84d54'
};

// Define the provider
const provider = new VeChainProvider(
    thorSoloClient,
    new ProviderInternalBaseWallet([deployerAccount])
);

// Define signer
const signer = await provider.getSigner(deployerAccount.address);

// Provide contract bytecode and ABI
const contractBytecode: string =
    '0x60806040526000805534801561001457600080fd5b50610267806100246000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c80635b34b966146100465780638ada066e146100505780638bb5d9c31461006e575b600080fd5b61004e61008a565b005b6100586100dc565b6040516100659190610141565b60405180910390f35b6100886004803603810190610083919061018d565b6100e5565b005b60008081548092919061009c906101e9565b91905055507f3cf8b50771c17d723f2cb711ca7dadde485b222e13c84ba0730a14093fad6d5c6000546040516100d29190610141565b60405180910390a1565b60008054905090565b806000819055507f3cf8b50771c17d723f2cb711ca7dadde485b222e13c84ba0730a14093fad6d5c60005460405161011d9190610141565b60405180910390a150565b6000819050919050565b61013b81610128565b82525050565b60006020820190506101566000830184610132565b92915050565b600080fd5b61016a81610128565b811461017557600080fd5b50565b60008135905061018781610161565b92915050565b6000602082840312156101a3576101a261015c565b5b60006101b184828501610178565b91505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60006101f482610128565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8203610226576102256101ba565b5b60018201905091905056fea26469706673582212203717543ef8d5efefe479edccd3cf790230d0362107b487d53629ecbf94b9078f64736f6c63430008180033';

const contractAbi = [
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint256',
                name: 'newValue',
                type: 'uint256'
            }
        ],
        name: 'CounterIncremented',
        type: 'event'
    },
    {
        inputs: [],
        name: 'getCounter',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'incrementCounter',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256'
            }
        ],
        name: 'setCounter',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    }
] as const;

// 3 - Deploy contract

// Create the contract factory
let contractFactory = thorSoloClient.contracts.createContractFactory(
    contractAbi,
    contractBytecode,
    signer
);

// Start contract deployment
contractFactory = await contractFactory.startDeployment();

// Wait until contract is deployed
const contract = await contractFactory.waitForDeployment();

// 4 - Interact with contract

// read initial value
const initialValue = await contract.read.getCounter();
console.log(initialValue);

// increment the counter
const incrementCounter = await contract.transact.incrementCounter();

// wait for the transaction receipt (until it is not null)
for (let i = 0; i < 20; i++) {
    const result = await thorSoloClient.transactions.getTransactionReceipt(
        incrementCounter.id
    );

    if (result !== null) {
        break;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
}

// check if the value was set
const updatedValue = await contract.read.getCounter();
console.log(updatedValue);

// END_SNIPPET: ContractUsageSnippet

expect(initialValue).toEqual([BigInt(0)]);
expect(updatedValue).toEqual([BigInt(1)]);
