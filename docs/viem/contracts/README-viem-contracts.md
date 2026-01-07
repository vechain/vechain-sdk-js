# VeChain Viem Contracts Examples

This directory contains examples demonstrating the improved VeChain SDK Viem Contracts module.

## Examples

### 1. Simple Quick Start (`viem-contracts-simple.ts`)

A minimal example showing the most common use case - reading from a contract.

**Features:**
- Basic contract setup
- Reading contract state
- Error handling

**Run:**
```bash
# From root
npx tsx packages/sdk/examples/viem-contracts-simple.ts

# Or from packages/sdk
npx tsx examples/viem-contracts-simple.ts
```

### 2. Comprehensive Examples (`viem-contracts-example.ts`)

A complete guide covering all features of the contracts module.

**Topics Covered:**
- ✅ Creating contracts with ABI arrays
- ✅ Using compiled contract JSON (auto-extracts ABI)
- ✅ Read operations (view/pure functions)
- ✅ Write operations (state-changing functions)
- ✅ Validation and error handling
- ✅ Argument count validation
- ✅ Gas parameter validation

**Run:**
```bash
# From root
npx tsx packages/sdk/examples/viem-contracts-example.ts

# Or from packages/sdk
npx tsx examples/viem-contracts-example.ts
```

## Key Improvements

The new contracts module includes several critical improvements:

### 🛡️ Type Safety
- **No more `as any` casts** - proper TypeScript interfaces throughout
- Type-safe method calls with compile-time checking
- Better IDE autocomplete and IntelliSense

### ✅ Comprehensive Validation

**Address Validation:**
- Length check (exactly 42 characters)
- Format validation (0x + 40 hex chars)
- Zero address prevention

**Parameter Validation:**
- Argument count matches ABI
- Gas limits are reasonable
- Values are non-negative
- ABI is not empty

**Error Messages:**
- Clear, actionable error messages
- Context information for debugging
- No silent failures

### 🔧 Better Error Handling
- Replaced generic `Error` with `IllegalArgumentError`
- Rich error context with debugging information
- Validates method existence before calling

### 📦 Flexible ABI Input

Both formats are supported:

```typescript
// Option 1: Just the ABI array
const contract = getContract({
    address: contractAddress,
    abi: [{type: 'function', name: 'transfer', ...}],
    publicClient
});

// Option 2: Full compiled contract JSON
const contract = getContract({
    address: contractAddress,
    abi: {
        abi: [{type: 'function', ...}],
        bytecode: '0x...',
        metadata: {...}
    },
    publicClient
});
```

The ABI is automatically extracted from compiled contract JSON!

## Usage Patterns

### Read-Only Operations (View/Pure Functions)

```typescript
const contract = getContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    publicClient  // Only publicClient needed for reads
});

const balance = await contract.read.balanceOf([userAddress]);
const symbol = await contract.read.symbol([]);
```

### Write Operations (State-Changing Functions)

```typescript
const contract = getContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    walletClient  // walletClient needed for writes
});

const txRequest = contract.write.transfer({
    args: [recipientAddress, amount],
    value: 0n,
    gas: 50000n,
    gasPriceCoef: 0n
});

// Submit txRequest to blockchain...
```

### Both Read and Write

```typescript
const contract = getContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    publicClient,   // For read operations
    walletClient    // For write operations
});

// Can do both!
const balance = await contract.read.balanceOf([userAddress]);
const txRequest = contract.write.transfer({...});
```

## Common Issues & Solutions

### Issue: "No HTTP client or network URL available"

**Cause:** Neither publicClient nor walletClient has proper network configuration.

**Solution:**
```typescript
const publicClient = {
    httpClient: new FetchHttpClient('https://testnet.vechain.org'),
    network: 'https://testnet.vechain.org'
};
```

### Issue: "Expected X arguments, got Y"

**Cause:** Wrong number of arguments passed to contract method.

**Solution:** Check the ABI and pass the correct number of arguments:
```typescript
// ❌ Wrong
await contract.read.balanceOf(['0x123', 'extraArg']);

// ✅ Correct
await contract.read.balanceOf(['0x123']);
```

### Issue: "Gas limit exceeds maximum reasonable value"

**Cause:** Gas limit too high (> 10,000,000).

**Solution:**
```typescript
// ❌ Wrong
contract.write.transfer({ gas: 20_000_000n });

// ✅ Correct
contract.write.transfer({ gas: 50_000n });
```

### Issue: "Invalid contract address format"

**Cause:** Address doesn't match required format.

**Solution:**
```typescript
// ❌ Wrong
Address.of('0x123');  // Too short

// ✅ Correct
Address.of('0x0000000000000000000000000000456E65726779');  // 42 chars
```

## Testing

These examples are designed to work with VeChain testnet. To test with mainnet:

```typescript
const httpClient = new FetchHttpClient('https://mainnet.vechain.org');
```

## Resources

- [VeChain SDK Documentation](https://docs.vechain.org/sdk)
- [Viem Documentation](https://viem.sh)
- [VeChain Developer Portal](https://docs.vechain.org)

## Contributing

Found an issue or have a suggestion? Please open an issue or PR on the VeChain SDK repository.

