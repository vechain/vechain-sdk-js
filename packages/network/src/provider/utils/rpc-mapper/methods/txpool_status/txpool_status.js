"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.txPoolStatus = void 0;
/**
 * RPC Method txpool_status implementation
 *
 * @link [txpool_status](https://www.quicknode.com/docs/ethereum/txpool_status)
 *
 * @note
 *  * We return a constant empty object for now.
 *
 * @returns The transaction pool status
 */
const txPoolStatus = async () => {
    return await Promise.resolve({});
};
exports.txPoolStatus = txPoolStatus;
