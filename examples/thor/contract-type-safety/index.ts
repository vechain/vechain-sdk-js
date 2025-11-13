/**
 * Example: Contract Type Safety and Parameter Information
 *
 * This example demonstrates how the Contract class automatically extracts
 * argument types and names from the ABI, providing full TypeScript type safety.
 */

import { ThorClient, VTHO_ADDRESS, ERC20_ABI } from '@vechain/sdk-temp/thor';
import { Address, FetchHttpClient } from '@vechain/sdk-temp/common';

async function demonstrateTypeSafety(): Promise<void> {
    // Initialize ThorClient for testnet
    const thorClient = ThorClient.at(
        FetchHttpClient.at(new URL('https://testnet.vechain.org'))
    );

    // VTHO address on testnet
    const tokenAddress = Address.of(VTHO_ADDRESS);

    // 1. Load contract with typed ABI - this gives you full type safety
    const contract = thorClient.contracts.load(tokenAddress, ERC20_ABI);

    console.log('=== 1. Type Safety in Action ===');
    // TypeScript knows the exact parameter types!
    // ✅ Correct usage - TypeScript validates the types
    const balance = await contract.read.balanceOf(
        Address.of('0x1234567890123456789012345678901234567890') // address type
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
    allFunctions.forEach((fn) => {
        console.log('  -', fn);
    });
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
        console.log(`  Label: ${param.name ?? index}}`);
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

console.log('===================================');
console.log('Contract Type Safety Examples');
console.log('===================================\n');

// Run the examples
demonstrateTypeSafety().catch(console.error);
