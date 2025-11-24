/* eslint-disable */
// TODO: Contracts module is pending rework - lint errors will be fixed during refactor
import { Address, type AddressLike, Hex } from '@common/vcdm';
import { Clause } from '@thor/thor-client/model/transactions/Clause';
import { encodeFunctionData, parseUnits } from 'viem';
import { ERC20_ABI } from '@thor/utils';


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
        tokenAddress: AddressLike,
        recipient: AddressLike,
        amount: bigint,
        comment?: string
    ): Clause {
        const normalizedTokenAddress = Address.of(tokenAddress);
        const normalizedRecipient = Address.of(recipient);

        const data = encodeFunctionData({
            abi: ERC20_ABI,
            functionName: 'transfer',
            args: [normalizedRecipient.toString() as any, amount]
        });

        return new Clause(
            normalizedTokenAddress,
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
        tokenAddress: AddressLike,
        recipient: AddressLike,
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
        tokenAddress: AddressLike,
        spender: AddressLike,
        amount: bigint,
        comment?: string
    ): Clause {
        const normalizedTokenAddress = Address.of(tokenAddress);
        const normalizedSpender = Address.of(spender);

        const data = encodeFunctionData({
            abi: ERC20_ABI,
            functionName: 'approve',
            args: [normalizedSpender.toString() as any, amount]
        });

        return new Clause(
            normalizedTokenAddress,
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
        tokenAddress: AddressLike,
        spender: AddressLike,
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
        tokenAddress: AddressLike,
        from: AddressLike,
        to: AddressLike,
        amount: bigint,
        comment?: string
    ): Clause {
        const normalizedTokenAddress = Address.of(tokenAddress);
        const normalizedFrom = Address.of(from);
        const normalizedTo = Address.of(to);

        const data = encodeFunctionData({
            abi: ERC20_ABI,
            functionName: 'transferFrom',
            args: [
                normalizedFrom.toString() as any,
                normalizedTo.toString() as any,
                amount
            ]
        });

        return new Clause(
            normalizedTokenAddress,
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
        tokenAddress: AddressLike,
        from: AddressLike,
        to: AddressLike,
        amount: string,
        decimals: number = 18,
        comment?: string
    ): Clause {
        const amountInWei = parseUnits(amount, decimals);
        return this.transferFrom(tokenAddress, from, to, amountInWei, comment);
    }
}