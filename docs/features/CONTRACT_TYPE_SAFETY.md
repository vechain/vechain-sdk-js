# Contract Type Safety and Parameter Extraction

## Overview

The VeChain SDK provides **full TypeScript type safety** for smart contract interactions by extracting types and parameter information directly from the ABI. This means you get compile-time type checking, IntelliSense support, and runtime parameter inspection.

## ✅ What You Get Automatically

When you load a contract using `thorClient.contracts.load(address, abi)`, the SDK automatically:

1. **Extracts argument types** from the ABI
2. **Extracts parameter names** from the ABI
3. **Provides TypeScript autocomplete** for all contract methods
4. **Validates types at compile-time** to prevent runtime errors
5. **Infers return types** based on the ABI

## Type Safety Features

### 1. Automatic Type Inference

```typescript
import { ThorClient } from '@vechain/sdk/thor';
import { Address } from '@vechain/sdk/common';

const ERC20_ABI = [
    {
        type: 'function',
        name: 'balanceOf',
        stateMutability: 'view',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [{ name: '', type: 'uint256' }]
    }
] as const; // Important: use 'as const' for type inference

const contract = thorClient.contracts.load(tokenAddress, ERC20_ABI);

// TypeScript knows this takes an address string and returns a bigint
const balance = await contract.read.balanceOf('0x...');
// balance is typed as: bigint

// ❌ TypeScript error: wrong type
// await contract.read.balanceOf(12345); // Error!
```

### 2. Method Categories

The contract object provides different method categories based on function mutability:

```typescript
// Read methods (view/pure functions)
contract.read.balanceOf(address); // Returns: Promise<bigint>
contract.read.totalSupply(); // Returns: Promise<bigint>

// Write methods (payable/nonpayable functions)
contract.transact.transfer(to, amount); // Returns: Promise<Hex>
contract.write.approve(spender, value); // Returns: Promise<Hex>

// Event filters
contract.filters.Transfer(from, to); // Returns: { address, topics }

// Clause builders
contract.clause.transfer(to, amount); // Returns: { to, data, value, comment }
```

## Parameter Information Methods

### 3. Get Parameter Details

Use `getParameterInfo()` to get detailed parameter information including names and types:

```typescript
const paramInfo = contract.getParameterInfo('transfer');

console.log(paramInfo);
// Output:
// {
//   inputs: [
//     { name: 'to', type: 'address', internalType: 'address' },
//     { name: 'amount', type: 'uint256', internalType: 'uint256' }
//   ],
//   outputs: [
//     { name: '', type: 'bool', internalType: 'bool' }
//   ],
//   stateMutability: 'nonpayable'
// }
```

**Use cases:**

- Building dynamic UIs
- Generating documentation
- Validating user input
- Creating form fields

### 4. Get Function Signatures

Get human-readable function signatures with parameter names:

```typescript
const signature = contract.getFunctionSignature('transfer');
console.log(signature);
// Output: "transfer(address to, uint256 amount) returns (bool)"
```

### 5. List All Functions

Get all available functions with their signatures:

```typescript
const functions = contract.listFunctions();
console.log(functions);
// Output:
// [
//   "transfer(address to, uint256 amount) returns (bool)",
//   "balanceOf(address account) returns (uint256)",
//   "approve(address spender, uint256 value) returns (bool)",
//   ...
// ]
```

### 6. Access Raw ABI

For advanced use cases, access the raw ABI:

```typescript
// Get function ABI
const functionAbi = contract.getFunctionAbi('transfer');
console.log(functionAbi);
// Returns: AbiFunction object with full details

// Get event ABI
const eventAbi = contract.getEventAbi('Transfer');
console.log(eventAbi);
// Returns: AbiEvent object with full details
```

## Complete Example: Dynamic Form Generation

Here's a complete example of using parameter information to build a dynamic form:

```typescript
import { ThorClient } from '@vechain/sdk/thor';
import { Address } from '@vechain/sdk/common';

const ERC20_ABI = [
    /* ... */
] as const;

function buildContractForm(contract: Contract, functionName: string) {
    const paramInfo = contract.getParameterInfo(functionName);

    console.log(`Form for ${functionName}:`);
    console.log(`Function: ${contract.getFunctionSignature(functionName)}`);
    console.log('---');

    paramInfo.inputs.forEach((param, index) => {
        console.log(`Field ${index + 1}:`);
        console.log(`  Label: ${param.name || `Parameter ${index + 1}`}`);
        console.log(`  Type: ${param.type}`);
        console.log(`  Solidity Type: ${param.internalType || param.type}`);
        console.log(`  Required: Yes`);

        // Determine input type
        let inputType = 'text';
        if (param.type === 'address') inputType = 'text (hex address)';
        if (param.type.startsWith('uint') || param.type.startsWith('int')) {
            inputType = 'number';
        }
        if (param.type === 'bool') inputType = 'checkbox';

        console.log(`  HTML Input Type: ${inputType}`);
        console.log('');
    });

    console.log(
        `Returns: ${paramInfo.outputs.map((o) => o.type).join(', ') || 'void'}`
    );
    console.log(`State Mutability: ${paramInfo.stateMutability}`);
}

// Usage
const thorClient = ThorClient.fromUrl('https://testnet.vechain.org');
const tokenAddress = Address.of('0x0000000000000000000000000000456E65726779');
const contract = thorClient.contracts.load(tokenAddress, ERC20_ABI);

buildContractForm(contract, 'transfer');
// Output:
// Form for transfer:
// Function: transfer(address to, uint256 amount) returns (bool)
// ---
// Field 1:
//   Label: to
//   Type: address
//   Solidity Type: address
//   Required: Yes
//   HTML Input Type: text (hex address)
//
// Field 2:
//   Label: amount
//   Type: uint256
//   Solidity Type: uint256
//   Required: Yes
//   HTML Input Type: number
//
// Returns: bool
// State Mutability: nonpayable
```

## TypeScript Type Mappings

The SDK automatically maps Solidity types to TypeScript types:

| Solidity Type            | TypeScript Type | Example                |
| ------------------------ | --------------- | ---------------------- |
| `address`                | `string`        | `"0x..."`              |
| `uint256`, `uint8`, etc. | `bigint`        | `1000000000000000000n` |
| `int256`, `int8`, etc.   | `bigint`        | `-1000n`               |
| `bool`                   | `boolean`       | `true` / `false`       |
| `string`                 | `string`        | `"Hello"`              |
| `bytes`, `bytes32`, etc. | `string`        | `"0xabcd..."`          |
| Array types `T[]`        | `T[]`           | `["0x...", "0x..."]`   |
| Tuple `(T1, T2)`         | `[T1, T2]`      | `["0x...", 100n]`      |

## Best Practices

### 1. Always Use `as const` on ABI

```typescript
// ✅ Good - enables full type inference
const ABI = [
    { type: 'function', name: 'transfer', ... }
] as const;

// ❌ Bad - loses type information
const ABI = [
    { type: 'function', name: 'transfer', ... }
];
```

### 2. Use Parameter Names from ABI

```typescript
// Get parameter info for better code documentation
const { inputs } = contract.getParameterInfo('transfer');
const [toParam, amountParam] = inputs;

console.log(`Send ${amountParam.name} tokens to ${toParam.name}`);
// Output: "Send amount tokens to to"
```

### 3. Validate User Input Against ABI

```typescript
function validateInput(
    contract: Contract,
    functionName: string,
    userInputs: any[]
) {
    const { inputs } = contract.getParameterInfo(functionName);

    if (userInputs.length !== inputs.length) {
        throw new Error(
            `Expected ${inputs.length} arguments, got ${userInputs.length}`
        );
    }

    inputs.forEach((param, i) => {
        const value = userInputs[i];

        // Validate address format
        if (param.type === 'address' && !value.match(/^0x[0-9a-fA-F]{40}$/)) {
            throw new Error(`Invalid address for parameter ${param.name || i}`);
        }

        // Validate number types
        if (
            param.type.startsWith('uint') &&
            typeof value !== 'bigint' &&
            typeof value !== 'number'
        ) {
            throw new Error(`Invalid number for parameter ${param.name || i}`);
        }
    });
}
```

## Summary

The VeChain SDK's contract type system provides:

✅ **Automatic type extraction** from ABI  
✅ **Parameter names** from ABI  
✅ **Compile-time type checking**  
✅ **Runtime parameter inspection**  
✅ **IntelliSense support** in IDEs  
✅ **Function signature formatting**  
✅ **Dynamic UI generation** capabilities

All of this works automatically when you load a contract with `thorClient.contracts.load(address, abi)` - no additional configuration needed!
