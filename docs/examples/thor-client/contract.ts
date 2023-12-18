import {
    HttpClient,
    ThorClient,
    ThorestClient
} from '@vechainfoundation/vechain-sdk-network';
import { expect } from 'expect';

// Url of the local solo network
const _testnetUrl = 'http://localhost:8669/';

// Solo network instance
const soloNetwork = new HttpClient(_testnetUrl);

// Thorest client solo instance
const thorestSoloClient = new ThorestClient(soloNetwork);

// Thor client solo instance
const thorSoloClient = new ThorClient(thorestSoloClient);

const privateKeyDeployer =
    '706e6acd567fdc22db54aead12cb39db01c4832f149f95299aa8dd8bef7d28ff'; // Private key of a test account with VTHO (energy) to pay for the deployment

const addressDeployer = '0xf02f557c753edf5fcdcbfe4c1c3a448b3cc84d54';

const contractBytecode: string =
    '0x608060405234801561001057600080fd5b50610150806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c806360fe47b11461003b5780636d4ce63c14610057575b600080fd5b610055600480360381019061005091906100c3565b610075565b005b61005f61007f565b60405161006c91906100ff565b60405180910390f35b8060008190555050565b60008054905090565b600080fd5b6000819050919050565b6100a08161008d565b81146100ab57600080fd5b50565b6000813590506100bd81610097565b92915050565b6000602082840312156100d9576100d8610088565b5b60006100e7848285016100ae565b91505092915050565b6100f98161008d565b82525050565b600060208201905061011460008301846100f0565b9291505056fea26469706673582212206fd02e4453276839e38700c049f3c14a66636c948f1c2466388da61fb7574f3164736f6c63430008170033';

const result = await thorSoloClient.contracts.deployContract(
    addressDeployer,
    privateKeyDeployer,
    contractBytecode
);

const receipt = await thorSoloClient.transactions.waitForTransaction(result.id);

expect(receipt.reverted).toEqual(false);
expect(receipt.outputs[0].contractAddress).toBeDefined();

thorSoloClient.destroy();
