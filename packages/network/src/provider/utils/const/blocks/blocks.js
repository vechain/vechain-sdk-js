"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultBlockToRevision = void 0;
const sdk_core_1 = require("@vechain/sdk-core");
const sdk_errors_1 = require("@vechain/sdk-errors");
const defaultBlockTags = [
    'latest',
    'earliest',
    'pending',
    'safe',
    'finalized'
];
/**
 * Maps the Ethereum "default block" type to VeChainThor Revision type.
 * Ethereum "default block" can be:
 * - 'latest' or 'earliest' or 'pending' or 'safe' or 'finalized'
 * - a hexadecimal block number
 * VeChainThor revision type can be:
 * - 'best', 'next', 'justified', 'finalized'
 * - a hexadecimal block Id
 * - a integer block number
 *
 * @param defaultBlock - The Ethereum default block type to convert
 * @returns The VeChainThor revision type
 */
const DefaultBlockToRevision = (defaultBlock) => {
    // if valid hex then return integer block number
    if (sdk_core_1.HexUInt.isValid(defaultBlock)) {
        return sdk_core_1.Revision.of(sdk_core_1.HexUInt.of(defaultBlock).n.toString());
    }
    // check if default block is a valid block tag
    if (!defaultBlockTags.includes(defaultBlock)) {
        const defaultBlockValue = defaultBlock.toString();
        throw new sdk_errors_1.JSONRPCInvalidDefaultBlock('DefaultBlockToRevision', `Invalid default block: ${defaultBlockValue}`, defaultBlockValue, null);
    }
    // map block tag to VeChainThor revision
    if (defaultBlock === 'earliest') {
        return sdk_core_1.Revision.of(sdk_core_1.HexUInt.of(0));
    }
    else if (defaultBlock === 'safe') {
        return sdk_core_1.Revision.of('justified');
    }
    else if (defaultBlock === 'finalized') {
        return sdk_core_1.Revision.of('finalized');
    }
    else {
        return sdk_core_1.Revision.of('best');
    }
};
exports.DefaultBlockToRevision = DefaultBlockToRevision;
