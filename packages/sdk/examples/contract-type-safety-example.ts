/**
 * Example: Contract Type Safety and Parameter Information
 *
 * This example demonstrates how the Contract class automatically extracts
 * argument types and names from the ABI, providing full TypeScript type safety.
 */

import { ThorClient } from '../src/thor';
import { Address } from '../src/common';

// Example ERC-20 Token ABI (simplified)
const ERC20_ABI = [
    {
        type: 'function',
        name: 'transfer',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'to', type: 'address', internalType: 'address' },
            { name: 'amount', type: 'uint256', internalType: 'uint256' }
        ],
        outputs: [{ name: '', type: 'bool', internalType: 'bool' }]
    },
    {
        type: 'function',
        name: 'balanceOf',
        stateMutability: 'view',
        inputs: [{ name: 'account', type: 'address', internalType: 'address' }],
        outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }]
    },
    {
        type: 'function',
        name: 'approve',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'spender', type: 'address', internalType: 'address' },
            { name: 'value', type: 'uint256', internalType: 'uint256' }
        ],
        outputs: [{ name: '', type: 'bool', internalType: 'bool' }]
    }
] as const; // Important: use 'as const' for proper type inference

async function demonstrateTypeSafety() {
    // Initialize ThorClient
    const thorClient = ThorClient.fromUrl('https://testnet.vechain.org');

    const tokenAddress = Address.of(
        '0x0000000000000000000000000000456E65726779'
    );

    // 1. Load contract with typed ABI - this gives you full type safety
    const contract = thorClient.contracts.load(tokenAddress, ERC20_ABI);

    console.log('=== 1. Type Safety in Action ===');
    // TypeScript knows the exact parameter types!
    // ✅ Correct usage - TypeScript validates the types
    const balance = await contract.read.balanceOf(
        '0x1234567890123456789012345678901234567890' // address type
    );
    console.log('Balance:', balance); // TypeScript knows this is bigint

    // ❌ This would give a TypeScript error:
    // contract.read.balanceOf(12345); // Error: Argument of type 'number' is not assignable to parameter of type 'address'

    console.log('\n=== 2. Get Parameter Information ===');
    // Get detailed parameter info including names and types
    const transferInfo = contract.getParameterInfo('transfer');
    console.log('Transfer function parameters:');
    console.log('Inputs:', transferInfo.inputs);
    // Output: [
    //   { name: 'to', type: 'address', internalType: 'address' },
    //   { name: 'amount', type: 'uint256', internalType: 'uint256' }
    // ]
    console.log('Outputs:', transferInfo.outputs);
    // Output: [{ name: '', type: 'bool', internalType: 'bool' }]
    console.log('State Mutability:', transferInfo.stateMutability);
    // Output: 'nonpayable'

    console.log('\n=== 3. Get Function Signatures ===');
    // Get human-readable function signature with parameter names
    const signature = contract.getFunctionSignature('transfer');
    console.log('Transfer signature:', signature);
    // Output: "transfer(address to, uint256 amount) returns (bool)"

    console.log('\n=== 4. List All Functions ===');
    // Get all available functions with their signatures
    const allFunctions = contract.listFunctions();
    console.log('Available functions:');
    allFunctions.forEach((fn) => console.log('  -', fn));
    // Output:
    //   - transfer(address to, uint256 amount) returns (bool)
    //   - balanceOf(address account) returns (uint256)
    //   - approve(address spender, uint256 value) returns (bool)

    console.log('\n=== 5. Dynamic UI Building Example ===');
    // Use parameter info to build dynamic forms
    const approveInfo = contract.getParameterInfo('approve');
    console.log('\nBuilding form for approve function:');
    approveInfo.inputs.forEach((param, index) => {
        console.log(`Field ${index + 1}:`);
        console.log(`  Label: ${param.name || `arg${index}`}`);
        console.log(`  Type: ${param.type}`);
        console.log(`  Input Type: ${getInputType(param.type)}`);
    });

    console.log('\n=== 6. Accessing Raw ABI ===');
    // You can also access the raw ABI function
    const transferAbi = contract.getFunctionAbi('transfer');
    console.log('Raw transfer ABI:', JSON.stringify(transferAbi, null, 2));
}

// Helper function for dynamic UI
function getInputType(solidityType: string): string {
    if (solidityType === 'address') return 'text (hex address)';
    if (solidityType.startsWith('uint') || solidityType.startsWith('int'))
        return 'number';
    if (solidityType === 'bool') return 'checkbox';
    if (solidityType === 'string') return 'text';
    if (solidityType === 'bytes' || solidityType.startsWith('bytes'))
        return 'text (hex)';
    return 'text';
}

// Example of type-safe contract interaction with proper types
async function typeSafeInteraction() {
    const thorClient = ThorClient.fromUrl('https://testnet.vechain.org');
    const tokenAddress = Address.of(
        '0x0000000000000000000000000000456E65726779'
    );
    const contract = thorClient.contracts.load(tokenAddress, ERC20_ABI);

    // TypeScript infers all types automatically!

    // Read operation - TypeScript knows it returns bigint
    const balance: bigint = await contract.read.balanceOf(
        '0x1234567890123456789012345678901234567890'
    );

    // Can use the result with type safety
    if (balance > 1000000000000000000n) {
        console.log('Balance is greater than 1 token');
    }

    // Write operation with type checking on parameters
    // TypeScript validates that first arg is address and second is bigint/number
    const result = await contract.transact.transfer(
        '0x1234567890123456789012345678901234567890', // to: address
        1000000000000000000n // amount: uint256 (as bigint)
    );

    console.log('Transaction ID:', result.id);

    // Wait for transaction
    const receipt = await result.wait();
    console.log('Transaction confirmed in block:', receipt?.meta.blockNumber);
}

console.log('===================================');
console.log('Contract Type Safety Examples');
console.log('===================================\n');

// Run the examples
demonstrateTypeSafety().catch(console.error);

export { demonstrateTypeSafety, typeSafeInteraction };
