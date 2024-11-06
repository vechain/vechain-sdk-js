import { expect } from 'expect';
import {
    ProviderInternalBaseWallet,
    type ProviderInternalWalletAccount,
    THOR_SOLO_URL,
    ThorClient,
    VeChainProvider,
    type VeChainSigner
} from '@vechain/sdk-network';
import { HexUInt } from '@vechain/sdk-core';

// Deposit contract bytecode
const depositContractBytecode: string =
    '0x608060405234801561001057600080fd5b50610405806100206000396000f3fe6080604052600436106100345760003560e01c806327e235e314610039578063d0e30db014610076578063f8b2cb4f14610080575b600080fd5b34801561004557600080fd5b50610060600480360381019061005b9190610268565b6100bd565b60405161006d91906102ae565b60405180910390f35b61007e6100d5565b005b34801561008c57600080fd5b506100a760048036038101906100a29190610268565b6101bd565b6040516100b491906102ae565b60405180910390f35b60006020528060005260406000206000915090505481565b60003411610118576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161010f9061034c565b60405180910390fd5b346000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254610166919061039b565b925050819055503373ffffffffffffffffffffffffffffffffffffffff167fd15c9547ea5c06670c0010ce19bc32d54682a4b3801ece7f3ab0c3f17106b4bb346040516101b391906102ae565b60405180910390a2565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006102358261020a565b9050919050565b6102458161022a565b811461025057600080fd5b50565b6000813590506102628161023c565b92915050565b60006020828403121561027e5761027d610205565b5b600061028c84828501610253565b91505092915050565b6000819050919050565b6102a881610295565b82525050565b60006020820190506102c3600083018461029f565b92915050565b600082825260208201905092915050565b7f4465706f73697420616d6f756e74206d7573742062652067726561746572207460008201527f68616e2030000000000000000000000000000000000000000000000000000000602082015250565b60006103366025836102c9565b9150610341826102da565b604082019050919050565b6000602082019050818103600083015261036581610329565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60006103a682610295565b91506103b183610295565b92508282019050808211156103c9576103c861036c565b5b9291505056fea2646970667358221220fd4fcedf2b3aacc02a6c483409206998028d766cf51d642f6c5c35d6f81118e864736f6c63430008180033';

// Defining the deployer account, which has VTHO for deployment costs
const deployerAccount: ProviderInternalWalletAccount = {
    privateKey: HexUInt.of(
        '706e6acd567fdc22db54aead12cb39db01c4832f149f95299aa8dd8bef7d28ff'
    ).bytes,
    address: '0xf02f557c753edf5fcdcbfe4c1c3a448b3cc84d54'
};

const depositContractAbi = [
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'depositor',
                type: 'address'
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256'
            }
        ],
        name: 'DepositMade',
        type: 'event'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address'
            }
        ],
        name: 'balances',
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
        name: 'deposit',
        outputs: [],
        stateMutability: 'payable',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'addr',
                type: 'address'
            }
        ],
        name: 'getBalance',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    }
] as const;

// Create thor client for solo network
const thorSoloClient = ThorClient.at(THOR_SOLO_URL);
const provider = new VeChainProvider(
    thorSoloClient,
    new ProviderInternalBaseWallet([deployerAccount])
);
const signer = (await provider.getSigner(
    deployerAccount.address
)) as VeChainSigner;

// START_SNIPPET: DepositContractSnippet

// Creating the contract factory
const contractFactory = thorSoloClient.contracts.createContractFactory(
    depositContractAbi,
    depositContractBytecode,
    signer
);

const contract = await (
    await contractFactory.startDeployment()
).waitForDeployment();

await (await contract.transact.deposit({ value: 1000 })).wait();

const balance = await contract.read.getBalance(deployerAccount.address);

expect(balance).toEqual([BigInt(1000)]);

// END_SNIPPET: DepositContractSnippet
