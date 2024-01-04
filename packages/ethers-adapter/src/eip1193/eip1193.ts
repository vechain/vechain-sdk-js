// import { type EIP1193Provider } from './types';

/**
 * Implements the [EIP-1193 Provider](https://eips.ethereum.org/EIPS/eip-1193) API.
 *
 * The EIP-1193 provides a standard interface for DApps to access Ethereum clients.
 *
 * The utils into vechain-sdk is to both:
 * - provide a standard interface for DApps to access VeChain clients compatible with EIP-1193
 * - provide a standard JSON-RPC interface for DApps to access VeChain clients (we know vechain uses RESTful API)
 *
 * ------- TEMPORARY COMMENT -------
 * Probably we can remove this file and use directly the `BackwardsCompatibilityProviderAdapter` of hardhat
 * ------------------------------
 */
// interface EIP1193JSONRPCProvider extends EIP1193Provider {
//     /**
//      * Alternative to `request` method. Used for retro-compatibility.
//      *
//      * Hardhat predates the EIP1193 (Javascript Ethereum Provider) standard. It was
//      * built following a draft of that spec, but then it changed completely. We
//      * still need to support the draft api, but internally we use EIP1193. So we
//      * use BackwardsCompatibilityProviderAdapter to wrap EIP1193 providers before
//      * exposing them to the user.
//      *
//      * @param method - RPC method
//      * @param params - Parameters of the RPC method
//      */
//     send: (method: string, params?: unknown[]) => Promise<unknown>;
// }

// export { type EIP1193JSONRPCProvider };
