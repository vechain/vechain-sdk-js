import { HexUInt, Revision } from '@vechain/sdk-core';
import { JSONRPCInvalidDefaultBlock } from '@vechain/sdk-errors';

type DefaultBlock =
    | `0x${string}`
    | 'latest'
    | 'earliest'
    | 'pending'
    | 'safe'
    | 'finalized';
const defaultBlockTags: DefaultBlock[] = [
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
const DefaultBlockToRevision = (defaultBlock: DefaultBlock): Revision => {
    // if valid hex then return integer block number
    if (HexUInt.isValid(defaultBlock)) {
        return Revision.of(HexUInt.of(defaultBlock).n.toString());
    }
    // check if default block is a valid block tag
    if (!defaultBlockTags.includes(defaultBlock)) {
        const defaultBlockValue = defaultBlock.toString();
        throw new JSONRPCInvalidDefaultBlock(
            'DefaultBlockToRevision',
            `Invalid default block: ${defaultBlockValue}`,
            defaultBlockValue,
            null
        );
    }
    // map block tag to VeChainThor revision
    if (defaultBlock === 'earliest') {
        return Revision.of(HexUInt.of(0));
    } else if (defaultBlock === 'safe') {
        return Revision.of('justified');
    } else if (defaultBlock === 'finalized') {
        return Revision.of('finalized');
    } else {
        return Revision.of('best');
    }
};

export { type DefaultBlock, DefaultBlockToRevision };
