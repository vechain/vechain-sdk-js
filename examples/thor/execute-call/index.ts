import { ThorClient, ABIContract, ThorNetworks } from '@vechain/sdk-temp/thor';

// Create testnet thor client
const thor = ThorClient.at(ThorNetworks.TESTNET);

// Define the ABI for the energy contract (VTHO)
// Using 'as const' for better type inference
const contractABI = new ABIContract([
    {
        constant: true,
        inputs: [],
        name: 'name',
        outputs: [
            {
                name: '',
                type: 'string'
            }
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    }
] as const);

// VTHO (Energy) contract address on VeChain
const energyContractAddress = '0x0000000000000000000000000000456e65726779';

// Use ABIContract.getFunction() to get the function ABI - the recommended v3 way
const nameFunction = contractABI.getFunction('name');

// Execute the read-only contract call
const name = await thor.contracts.executeCall(
    energyContractAddress,
    nameFunction, // Pass the plain ABI object from getFunction()
    [] // No arguments for this function
);

console.log('Contract Name:', name.result.plain);

