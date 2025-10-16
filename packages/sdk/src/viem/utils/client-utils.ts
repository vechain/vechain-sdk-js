/* eslint-disable */
// TODO: Contracts module is pending rework - lint errors will be fixed during refactor
/**
 * Utility functions for detecting and working with viem clients
 */

/**
 * Interface for a public client
 */
export interface PublicClientInterface {
    call: Function;
    estimateGas: Function;
    createEventFilter: Function;
    getLogs: Function;
    simulateCalls: Function;
    watchEvent: Function;
    thorNetworks: string;
}

/**
 * Interface for a wallet client
 */
export interface WalletClientInterface {
    account: { digits: string; sign: number };
    sendTransaction: Function;
    thorNetworks: string;
}

/**
 * Checks if an object has a public client
 * @param obj - The object to check
 * @returns True if public client is available
 */
export function hasPublicClient(
    obj: any
): obj is { publicClient: PublicClientInterface } {
    return !!(
        obj as any & {
            publicClient?: PublicClientInterface;
        }
    ).publicClient;
}

/**
 * Checks if an object has a wallet client
 * @param obj - The object to check
 * @returns True if wallet client is available
 */
export function hasWalletClient(
    obj: any
): obj is { walletClient: WalletClientInterface } {
    return !!(
        obj as any & {
            walletClient?: WalletClientInterface;
        }
    ).walletClient;
}

/**
 * Gets the public client from an object
 * @param obj - The object to get the public client from
 * @returns The public client or undefined
 */
export function getPublicClient(obj: any): PublicClientInterface | undefined {
    return (
        obj as any & {
            publicClient?: PublicClientInterface;
        }
    ).publicClient;
}

/**
 * Gets the wallet client from an object
 * @param obj - The object to get the wallet client from
 * @returns The wallet client or undefined
 */
export function getWalletClient(obj: any): WalletClientInterface | undefined {
    return (
        obj as any & {
            walletClient?: WalletClientInterface;
        }
    ).walletClient;
}
