import {
    ProviderInternalBaseWallet,
    type ProviderInternalWalletAccount,
    THOR_SOLO_URL,
    ThorClient,
    VeChainProvider,
    type VeChainSigner
} from '@vechain/sdk-network';
import { expect } from 'expect';
import { HexUInt, type DeployParams } from '@vechain/sdk-core';

// START_SNIPPET: ContractSnippet

// 1 - Create thor client for solo network

const thorSoloClient = ThorClient.fromUrl(THOR_SOLO_URL);

// 2 - Deploy contract

// Defining the deployer account, which has VTHO for deployment costs
const deployerAccount: ProviderInternalWalletAccount = {
    privateKey: HexUInt.of(
        '706e6acd567fdc22db54aead12cb39db01c4832f149f95299aa8dd8bef7d28ff'
    ).bytes,
    address: '0xf02f557c753edf5fcdcbfe4c1c3a448b3cc84d54'
};

// Define the provider and the signer
const provider = new VeChainProvider(
    thorSoloClient,
    new ProviderInternalBaseWallet([deployerAccount])
);
const signer = (await provider.getSigner(
    deployerAccount.address
)) as VeChainSigner;

const contractBytecode: string =
    '0x608060405234801561001057600080fd5b506040516102063803806102068339818101604052810190610032919061007a565b80600081905550506100a7565b600080fd5b6000819050919050565b61005781610044565b811461006257600080fd5b50565b6000815190506100748161004e565b92915050565b6000602082840312156100905761008f61003f565b5b600061009e84828501610065565b91505092915050565b610150806100b66000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c806360fe47b11461003b5780636d4ce63c14610057575b600080fd5b610055600480360381019061005091906100c3565b610075565b005b61005f61007f565b60405161006c91906100ff565b60405180910390f35b8060008190555050565b60008054905090565b600080fd5b6000819050919050565b6100a08161008d565b81146100ab57600080fd5b50565b6000813590506100bd81610097565b92915050565b6000602082840312156100d9576100d8610088565b5b60006100e7848285016100ae565b91505092915050565b6100f98161008d565b82525050565b600060208201905061011460008301846100f0565b9291505056fea2646970667358221220785262acbf50fa50a7b4dc8d8087ca8904c7e6b847a13674503fdcbac903b67e64736f6c63430008170033';

const deployedContractAbi = [
    {
        inputs: [],
        name: 'get',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [{ internalType: 'uint256', name: 'x', type: 'uint256' }],
        name: 'set',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    }
] as const;

// Creating the contract factory
let contractFactory = thorSoloClient.contracts.createContractFactory(
    deployedContractAbi,
    contractBytecode,
    signer
);

// Deploy parameters to be used for the contract creation
const deployParams: DeployParams = { types: 'uint', values: ['100'] };

// Deploying the contract
contractFactory = await contractFactory.startDeployment(deployParams);

// Awaiting the contract deployment
const contract = await contractFactory.waitForDeployment();

// Awaiting the transaction receipt to confirm successful contract deployment
const receipt = contract.deployTransactionReceipt;

// END_SNIPPET: ContractSnippet

expect(receipt.reverted).toEqual(false);
expect(receipt.outputs[0].contractAddress).toBeDefined();
