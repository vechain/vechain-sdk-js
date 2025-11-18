/**
 * Example: Using ABIContract with executeCall
 *
 * This example demonstrates how to use ABIContract.getFunction()
 * to retrieve plain ABI function objects that are compatible with executeCall().
 *
 * The example queries the VTHO token contract on testnet to retrieve:
 * - Token name
 * - Token symbol
 * - Token decimals
 * - Total supply
 * - Balance of a specific address
 */

import { ThorClient } from '@thor/thor-client/ThorClient';
import { VTHO_ADDRESS } from '@thor/utils/const/network';
import { Address } from '@common';
import { ABIContract } from '@thor';

// Define the minimal ABI for the functions we want to call
const ERC20_MINIMAL_ABI = [
    {
        constant: true,
        inputs: [],
        name: 'name',
        outputs: [{ name: '', type: 'string' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'symbol',
        outputs: [{ name: '', type: 'string' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'decimals',
        outputs: [{ name: '', type: 'uint8' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [],
        name: 'totalSupply',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    },
    {
        constant: true,
        inputs: [{ name: 'account', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
    }
];

console.log('===================================');
console.log('ABIContract executeCall Example');
console.log('===================================\n');
console.log('This example demonstrates:');
console.log('  1. Creating an ABIContract instance');
console.log('  2. Using getFunction() to retrieve plain ABI objects');
console.log('  3. Using executeCall() with the retrieved ABI objects');
console.log('  4. Querying ERC20 token information');
console.log('===================================\n');

async function demonstrateExecuteCall(): Promise<void> {
    // Initialize ThorClient for testnet
    const thor = ThorClient.fromUrl('https://testnet.vechain.org');

    // Create ABIContract instance with the minimal ABI
    const contractABI = new ABIContract(ERC20_MINIMAL_ABI);

    // VTHO token address on testnet
    const vthoAddress = Address.of(VTHO_ADDRESS);

    console.log('Contract Address:', vthoAddress.toString());
    console.log('Network: VeChain Testnet\n');

    // Example 1: Get token name
    console.log('=== Example 1: Get Token Name ===');
    const nameFunction = contractABI.getFunction('name');
    console.log('Function ABI:', JSON.stringify(nameFunction, null, 2));

    const nameResult = await thor.contracts.executeCall(
        vthoAddress,
        nameFunction,
        []
    );

    console.log('nameResult', nameResult);
}

// Run the example
void (async () => {
    try {
        await demonstrateExecuteCall();
        console.log('✅ All examples completed successfully!');
    } catch (error) {
        console.error('\n❌ Error running examples:', error);
        if (error instanceof Error) {
            console.error('Message:', error.message);
            console.error('Stack:', error.stack);
        }
    }
})();

export { demonstrateExecuteCall };
