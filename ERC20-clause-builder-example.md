# ERC20 Clause Builder Example

The `ERC20ClauseBuilder` provides a simple and type-safe way to build transaction clauses for ERC20 token operations.

## Features

- **Standard ERC20 Operations**: Transfer, approve, and transferFrom
- **Unit Conversion**: Automatic conversion from human-readable amounts (e.g., "1.5") to wei
- **Type Safety**: Fully typed with VeChain SDK types
- **Reusable**: Works with any ERC20-compatible token (VET, VTHO, or custom tokens)

## Usage Examples

### Basic Transfer

```typescript
import { ERC20ClauseBuilder, VTHO_TOKEN_ADDRESS } from '@vechain/sdk';
import { Address } from '@vechain/sdk/vcdm';

// Transfer 1 VTHO (assuming 18 decimals)
const clause = ERC20ClauseBuilder.transfer(
    VTHO_TOKEN_ADDRESS,
    Address.of('0x1234567890123456789012345678901234567890'),
    1000000000000000000n // 1 token in wei
);
```

### Transfer with Decimal Conversion

```typescript
// Transfer 1.5 VTHO with automatic unit conversion
const clause = ERC20ClauseBuilder.transferWithDecimals(
    VTHO_TOKEN_ADDRESS,
    Address.of('0x1234567890123456789012345678901234567890'),
    '1.5', // Human-readable amount
    18 // Token decimals
);
```

### Approve Token Spending

```typescript
// Approve a spender to use 100 VTHO
const clause = ERC20ClauseBuilder.approveWithDecimals(
    VTHO_TOKEN_ADDRESS,
    Address.of('0xSpenderAddress...'),
    '100',
    18
);
```

### Transfer From (for approved tokens)

```typescript
// Transfer tokens from another address (requires prior approval)
const clause = ERC20ClauseBuilder.transferFromWithDecimals(
    VTHO_TOKEN_ADDRESS,
    Address.of('0xFromAddress...'),
    Address.of('0xToAddress...'),
    '50',
    18
);
```

### Using with Custom ERC20 Tokens

```typescript
// Works with any ERC20-compatible token
const customTokenAddress = Address.of('0xYourCustomTokenAddress...');
const clause = ERC20ClauseBuilder.transferWithDecimals(
    customTokenAddress,
    Address.of('0xRecipient...'),
    '10.5',
    18 // Or whatever decimals your token uses
);
```

### Building a Transaction with Multiple Clauses

```typescript
import { ThorClient } from '@vechain/sdk';

// Create multiple ERC20 clauses
const clause1 = ERC20ClauseBuilder.transferWithDecimals(
    VTHO_TOKEN_ADDRESS,
    Address.of('0xRecipient1...'),
    '1',
    18
);

const clause2 = ERC20ClauseBuilder.transferWithDecimals(
    VTHO_TOKEN_ADDRESS,
    Address.of('0xRecipient2...'),
    '2',
    18
);

// Send transaction with multiple clauses
const result = await thorClient.contracts.executeMultipleClausesTransaction(
    [
        {
            to: clause1.to!,
            data: clause1.data!.toString(),
            value: clause1.value
        },
        {
            to: clause2.to!,
            data: clause2.data!.toString(),
            value: clause2.value
        }
    ],
    signer
);
```

## Token Addresses

The `ERC20ClauseBuilder` module exports commonly used token addresses:

- `VET_TOKEN_ADDRESS`: Native VET token (0x0000000000000000000000000000000000000000)
- `VTHO_TOKEN_ADDRESS`: VTHO energy token (0x0000000000000000000000000000456e65726779)

## Benefits Over VET/VTHO Classes

1. **More Flexible**: Works with any ERC20 token, not just VET and VTHO
2. **Simpler API**: Static methods instead of class instantiation
3. **Standard Compliance**: Uses standard ERC20 interface
4. **Better Composition**: Easy to combine with other clause types
5. **Unit Conversion**: Built-in support for human-readable amounts

## Migration from VET/VTHO Classes

**Before:**

```typescript
import { VET, Units } from '@vechain/sdk';

const vet = VET.of(1, Units.ether);
const value = vet.bi; // Get bigint value
```

**After:**

```typescript
import { ERC20ClauseBuilder, VET_TOKEN_ADDRESS } from '@vechain/sdk';

// For clauses:
const clause = ERC20ClauseBuilder.transferWithDecimals(
    VET_TOKEN_ADDRESS,
    recipientAddress,
    '1',
    18
);

// For raw values:
const value = BigInt('1000000000000000000'); // 1 token with 18 decimals
// Or use viem's parseUnits:
import { parseUnits } from 'viem';
const value = parseUnits('1', 18);
```
