"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.txPoolContent = void 0;
/**
 * RPC Method txpool_content implementation
 *
 * @link [txpool_content](https://www.quicknode.com/docs/ethereum/txpool_content)
 *
 * @note
 *  * We return a constant empty object for now.
 *
 * @returns The transaction pool status
 */
const txPoolContent = async () => {
    return await Promise.resolve({});
};
exports.txPoolContent = txPoolContent;
