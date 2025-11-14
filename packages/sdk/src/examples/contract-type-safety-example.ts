/**
 * Example: Contract Type Safety and Parameter Information
 *
 * This example demonstrates how the Contract class automatically extracts
 * argument types and names from the ABI, providing full TypeScript type safety.
 * It also shows how to properly set up a signer for transactions.
 */

import { ERC20_ABI } from '../thor';
import { ThorClient } from '@thor/thor-client/ThorClient';
import { PrivateKeySigner } from '@thor/signer';
import { VTHO_ADDRESS } from '@thor/utils/const/network';
import { Address, Hex, Revision } from '@common';

// Test account from Thor Solo setup (DO NOT use in production!)
const TEST_ACCOUNT = {
    privateKey:
        '7f9290cc44c5fd2b95fe21d6ad6fe5fa9c177e1cd6f3b4c96a97b13e09eaa158',
    address: '0x3db469a79593dcc67f07DE1869d6682fC1eaf535'
};

async function demonstrateTypeSafety(): Promise<void> {
    // Initialize ThorClient
    const thorClient = ThorClient.fromUrl('https://testnet.vechain.org');

    const tokenAddress = Address.of(VTHO_ADDRESS);

    // 1. Load contract with typed ABI - this gives you full type safety
    // Note: No signer needed for read-only operations
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
        const label = param.name ?? `arg${index}`;
        console.log(`  Label: ${label}`);
        console.log(`  Type: ${param.type}`);
        console.log(`  Input Type: ${getInputType(param.type)}`);
    });

    console.log('\n=== 6. Accessing Raw ABI ===');
    // You can also access the raw ABI function
    const transferAbi = contract.getFunctionAbi('transfer');
    console.log('Raw transfer ABI:', JSON.stringify(transferAbi, null, 2));

    console.log('\n=== 7. Setting Contract Read Options (with Revision) ===');
    // ✅ CORRECT: Use Revision.of() to create a revision object
    contract.setContractReadOptions({
        revision: Revision.BEST // or Revision.of(blockNumber) or Revision.of('best')
    });
    console.log('Read options set:', contract.getContractReadOptions());

    // Other valid examples:
    // contract.setContractReadOptions({ revision: Revision.of(12345678) }); // specific block number
    // contract.setContractReadOptions({ revision: Revision.FINALIZED }); // finalized block
    // contract.setContractReadOptions({ revision: Revision.of(Hex.of('0x00abc123...')) }); // block ID

    console.log('\n=== 8. Read Contract at Specific Revision (Block) ===');
    // You can also pass revision directly in read calls
    const balanceAtBlock = await contract.read.balanceOf(
        Address.of(TEST_ACCOUNT.address)
    );
    console.log('Balance at block 1,000,000:', balanceAtBlock);
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
async function typeSafeInteraction(): Promise<void> {
    console.log('\n=== Type-Safe Contract Interaction with Transactions ===');

    const thorClient = ThorClient.fromUrl('https://testnet.vechain.org');
    const tokenAddress = Address.of(
        '0x0000000000000000000000000000456E65726779' // VTHO token
    );

    // ✅ CRITICAL: Create a signer for transaction operations
    const privateKeyBytes = Hex.of(TEST_ACCOUNT.privateKey).bytes;
    const signer = new PrivateKeySigner(privateKeyBytes);
    console.log('Signer address:', signer.address.toString());

    // ✅ CRITICAL: Pass the signer as the 3rd parameter when loading the contract
    const contract = thorClient.contracts.load(tokenAddress, ERC20_ABI, signer);

    // TypeScript infers all types automatically!

    // Read operation - TypeScript knows it returns bigint
    console.log('\n--- Read Operation ---');
    const myBalance: bigint = await contract.read.balanceOf(
        Address.of(signer.address.toString())
    );
    console.log('My balance:', myBalance);

    // Can use the result with type safety
    if (myBalance > 1000000000000000000n) {
        console.log('Balance is greater than 1 token');

        // Write operation with type checking on parameters
        // TypeScript validates that first arg is address and second is bigint/number
        console.log('\n--- Write Operation (Transaction) ---');
        try {
            // ✅ CORRECT: Now that we have a signer, transactions will work
            const txId = await contract.transact.transfer(
                Address.of('0x1234567890123456789012345678901234567890'), // to: address
                1000000000000000000n // amount: uint256 (as bigint)
            );

            console.log('Transaction ID:', txId.toString());

            // Wait for transaction confirmation
            console.log('Waiting for transaction confirmation...');
            /*
             * Example follow-up:
             * 1. Await `thorClient.transactions.waitForTransaction(txId)` to
             *    wait for inclusion.
             * 2. Inspect the returned receipt metadata (block number, gas used,
             *    reverted flag) to confirm execution details.
             */
        } catch (error) {
            console.error('Transaction failed:', error);
        }
    } else {
        console.log(
            'Insufficient balance for transfer (need > 1 token). Skipping transaction example.'
        );
    }

    console.log('\n--- Alternative: Set Signer After Loading ---');
    // You can also set the signer after loading the contract
    const contractWithoutSigner = thorClient.contracts.load(
        tokenAddress,
        ERC20_ABI
    );

    // Set signer later
    contractWithoutSigner.setSigner(signer);
    console.log('Signer set to:', contractWithoutSigner.getSigner()?.address);

    // Now transactions will work
    const balance2 = await contractWithoutSigner.read.balanceOf(
        Address.of(signer.address.toString())
    );
    console.log('Balance (contract with signer set later):', balance2);
}

// Example demonstrating all ways to use setContractReadOptions
async function demonstrateReadOptions(): Promise<void> {
    console.log('\n=== Contract Read Options Examples ===');

    const thorClient = ThorClient.fromUrl('https://testnet.vechain.org');
    const tokenAddress = Address.of(VTHO_ADDRESS);
    const contract = thorClient.contracts.load(tokenAddress, ERC20_ABI);

    console.log('\n1. Set revision to "best" (latest block):');
    contract.setContractReadOptions({ revision: Revision.BEST });
    console.log('   Options:', contract.getContractReadOptions());

    console.log('\n2. Set revision to "finalized":');
    contract.setContractReadOptions({ revision: Revision.FINALIZED });
    console.log('   Options:', contract.getContractReadOptions());

    console.log('\n3. Set revision to specific block number:');
    contract.setContractReadOptions({ revision: Revision.of(1000000) });
    console.log('   Options:', contract.getContractReadOptions());

    console.log('\n4. Set revision to specific block ID (hex):');
    contract.setContractReadOptions({
        revision: Revision.of(
            Hex.of(
                '0x00000000c05a20fbca2bf6ae3affba6af4a74b800b585bf7a4988aba7aea69f6'
            )
        )
    });
    console.log('   Options:', contract.getContractReadOptions());

    console.log('\n5. (New) Set revision with a plain number:');
    contract.setContractReadOptions({ revision: 1000000 });
    console.log('   Options:', contract.getContractReadOptions());

    console.log('\n6. (New) Set revision with a numeric string:');
    contract.setContractReadOptions({ revision: '123456' });
    console.log('   Options:', contract.getContractReadOptions());

    console.log('\n7. (New) Set revision with a label string:');
    contract.setContractReadOptions({ revision: 'best' });
    console.log('   Options (best):', contract.getContractReadOptions());
    contract.setContractReadOptions({ revision: 'finalized' });
    console.log('   Options (finalized):', contract.getContractReadOptions());

    console.log('\n8. Set multiple options (revision + caller + gas):');
    const privateKeyBytes = Hex.of(TEST_ACCOUNT.privateKey).bytes;
    const signer = new PrivateKeySigner(privateKeyBytes);
    contract.setContractReadOptions({
        revision: Revision.BEST,
        caller: signer.address,
        gas: 1000000n,
        gasPrice: 1000000000n
    });
    console.log('   Options:', contract.getContractReadOptions());

    console.log('\n9. Clear read options:');
    contract.clearContractReadOptions();
    console.log('   Options:', contract.getContractReadOptions());

    console.log('\n10. Set read options and read at that revision:');
    contract.setContractReadOptions({ revision: Revision.of(1000000) });
    const balance = await contract.read.balanceOf(
        Address.of(TEST_ACCOUNT.address)
    );
    console.log('   Balance at block 1,000,000:', balance);
}

console.log('===================================');
console.log('Contract Type Safety Examples');
console.log('===================================\n');
console.log('This example demonstrates:');
console.log('  1. Type-safe contract interactions');
console.log('  2. Proper signer setup for transactions');
console.log('  3. Setting contract read options with Revision');
console.log('  4. Reading contract state at specific blocks');
console.log('  5. Executing transactions with proper error handling');
console.log('===================================\n');

// Run the examples
void (async () => {
    try {
        await demonstrateTypeSafety();
        await demonstrateReadOptions();
        console.log('\n--- Running transaction example ---');
        console.log(
            'NOTE: This will only work if the test account has sufficient balance'
        );
        await typeSafeInteraction();
        console.log('\n✅ All examples completed successfully!');
    } catch (error) {
        console.error('\n❌ Error running examples:', error);
    }
})();

export { demonstrateTypeSafety, typeSafeInteraction, demonstrateReadOptions };
