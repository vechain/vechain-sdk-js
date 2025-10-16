import { Address, Hex } from '@common/vcdm';
import { Clause } from '@thor/thor-client/model/transactions/Clause';
import { encodeFunctionData, parseUnits } from 'viem';

/**
 * Standard ERC20 ABI for common operations
 */
const ERC20_ABI = [
    {
        type: 'function',
        name: 'transfer',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'to', type: 'address' },
            { name: 'amount', type: 'uint256' }
        ],
        outputs: [{ name: '', type: 'bool' }]
    },
    {
        type: 'function',
        name: 'approve',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'spender', type: 'address' },
            { name: 'amount', type: 'uint256' }
        ],
        outputs: [{ name: '', type: 'bool' }]
    },
    {
        type: 'function',
        name: 'transferFrom',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'from', type: 'address' },
            { name: 'to', type: 'address' },
            { name: 'amount', type: 'uint256' }
        ],
        outputs: [{ name: '', type: 'bool' }]
    }
] as const;

/**
 * Token unit enumeration for ERC20 tokens
 */
export enum TokenUnits {
    wei = 'wei',
    kwei = 'kwei',
    mwei = 'mwei',
    gwei = 'gwei',
    szabo = 'szabo',
    finney = 'finney',
    ether = 'ether'
}

/**
 * ERC20 Clause Builder
 * Provides utility methods to build transaction clauses for ERC20 token operations
 */
export class ERC20ClauseBuilder {
    /**
     * Build a clause for transferring ERC20 tokens
     *
     * @param tokenAddress - The address of the ERC20 token contract
     * @param recipient - The address to send tokens to
     * @param amount - The amount to send (in smallest unit, e.g., wei)
     * @param comment - Optional comment for the clause
     * @returns A Clause for the transfer operation
     *
     * @example
     * ```typescript
     * const clause = ERC20ClauseBuilder.transfer(
     *   Address.of('0x0000000000000000000000000000456e65726779'),
     *   Address.of('0x1234567890123456789012345678901234567890'),
     *   1000000000000000000n // 1 token with 18 decimals
     * );
     * ```
     */
    public static transfer(
        tokenAddress: Address,
        recipient: Address,
        amount: bigint,
        comment?: string
    ): Clause {
        const data = encodeFunctionData({
            abi: ERC20_ABI,
            functionName: 'transfer',
            args: [recipient.toString() as any, amount]
        });

        return new Clause(
            tokenAddress,
            0n, // No VET value sent with token transfer
            Hex.of(data),
            comment ?? null,
            null
        );
    }

    /**
     * Build a clause for transferring ERC20 tokens with unit conversion
     *
     * @param tokenAddress - The address of the ERC20 token contract
     * @param recipient - The address to send tokens to
     * @param amount - The amount to send (in the specified unit)
     * @param decimals - The number of decimals for the token (default: 18)
     * @param comment - Optional comment for the clause
     * @returns A Clause for the transfer operation
     *
     * @example
     * ```typescript
     * const clause = ERC20ClauseBuilder.transferWithDecimals(
     *   Address.of('0x0000000000000000000000000000456e65726779'),
     *   Address.of('0x1234567890123456789012345678901234567890'),
     *   '1.5', // 1.5 tokens
     *   18
     * );
     * ```
     */
    public static transferWithDecimals(
        tokenAddress: Address,
        recipient: Address,
        amount: string,
        decimals: number = 18,
        comment?: string
    ): Clause {
        const amountInWei = parseUnits(amount, decimals);
        return this.transfer(tokenAddress, recipient, amountInWei, comment);
    }

    /**
     * Build a clause for approving ERC20 token spending
     *
     * @param tokenAddress - The address of the ERC20 token contract
     * @param spender - The address to approve for spending
     * @param amount - The amount to approve (in smallest unit, e.g., wei)
     * @param comment - Optional comment for the clause
     * @returns A Clause for the approve operation
     *
     * @example
     * ```typescript
     * const clause = ERC20ClauseBuilder.approve(
     *   Address.of('0x0000000000000000000000000000456e65726779'),
     *   Address.of('0x1234567890123456789012345678901234567890'),
     *   1000000000000000000n // 1 token with 18 decimals
     * );
     * ```
     */
    public static approve(
        tokenAddress: Address,
        spender: Address,
        amount: bigint,
        comment?: string
    ): Clause {
        const data = encodeFunctionData({
            abi: ERC20_ABI,
            functionName: 'approve',
            args: [spender.toString() as any, amount]
        });

        return new Clause(
            tokenAddress,
            0n, // No VET value sent with approve
            Hex.of(data),
            comment ?? null,
            null
        );
    }

    /**
     * Build a clause for approving ERC20 token spending with unit conversion
     *
     * @param tokenAddress - The address of the ERC20 token contract
     * @param spender - The address to approve for spending
     * @param amount - The amount to approve (in the specified unit)
     * @param decimals - The number of decimals for the token (default: 18)
     * @param comment - Optional comment for the clause
     * @returns A Clause for the approve operation
     *
     * @example
     * ```typescript
     * const clause = ERC20ClauseBuilder.approveWithDecimals(
     *   Address.of('0x0000000000000000000000000000456e65726779'),
     *   Address.of('0x1234567890123456789012345678901234567890'),
     *   '1.5', // 1.5 tokens
     *   18
     * );
     * ```
     */
    public static approveWithDecimals(
        tokenAddress: Address,
        spender: Address,
        amount: string,
        decimals: number = 18,
        comment?: string
    ): Clause {
        const amountInWei = parseUnits(amount, decimals);
        return this.approve(tokenAddress, spender, amountInWei, comment);
    }

    /**
     * Build a clause for transferring ERC20 tokens from another address
     *
     * @param tokenAddress - The address of the ERC20 token contract
     * @param from - The address to transfer tokens from
     * @param to - The address to transfer tokens to
     * @param amount - The amount to transfer (in smallest unit, e.g., wei)
     * @param comment - Optional comment for the clause
     * @returns A Clause for the transferFrom operation
     *
     * @example
     * ```typescript
     * const clause = ERC20ClauseBuilder.transferFrom(
     *   Address.of('0x0000000000000000000000000000456e65726779'),
     *   Address.of('0x1111111111111111111111111111111111111111'),
     *   Address.of('0x2222222222222222222222222222222222222222'),
     *   1000000000000000000n // 1 token with 18 decimals
     * );
     * ```
     */
    public static transferFrom(
        tokenAddress: Address,
        from: Address,
        to: Address,
        amount: bigint,
        comment?: string
    ): Clause {
        const data = encodeFunctionData({
            abi: ERC20_ABI,
            functionName: 'transferFrom',
            args: [from.toString() as any, to.toString() as any, amount]
        });

        return new Clause(
            tokenAddress,
            0n, // No VET value sent with transferFrom
            Hex.of(data),
            comment ?? null,
            null
        );
    }

    /**
     * Build a clause for transferring ERC20 tokens from another address with unit conversion
     *
     * @param tokenAddress - The address of the ERC20 token contract
     * @param from - The address to transfer tokens from
     * @param to - The address to transfer tokens to
     * @param amount - The amount to transfer (in the specified unit)
     * @param decimals - The number of decimals for the token (default: 18)
     * @param comment - Optional comment for the clause
     * @returns A Clause for the transferFrom operation
     *
     * @example
     * ```typescript
     * const clause = ERC20ClauseBuilder.transferFromWithDecimals(
     *   Address.of('0x0000000000000000000000000000456e65726779'),
     *   Address.of('0x1111111111111111111111111111111111111111'),
     *   Address.of('0x2222222222222222222222222222222222222222'),
     *   '1.5', // 1.5 tokens
     *   18
     * );
     * ```
     */
    public static transferFromWithDecimals(
        tokenAddress: Address,
        from: Address,
        to: Address,
        amount: string,
        decimals: number = 18,
        comment?: string
    ): Clause {
        const amountInWei = parseUnits(amount, decimals);
        return this.transferFrom(tokenAddress, from, to, amountInWei, comment);
    }
}

/**
 * VET token address (native token)
 */
export const VET_TOKEN_ADDRESS = Address.of(
    '0x0000000000000000000000000000000000000000'
);

/**
 * VTHO token address (energy token)
 */
export const VTHO_TOKEN_ADDRESS = Address.of(
    '0x0000000000000000000000000000456e65726779'
);
