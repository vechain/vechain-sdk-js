import { describe, expect, test } from '@jest/globals';
import { blockFixtures } from './fixture';
import { blocksFormatter } from '../../../src';

/**
 * Blocks formatter unit test
 * @group unit/provider/formatter/blocks
 */
describe('Blocks formatter unit test', () => {
    /**
     * Should be able to format a block
     */
    blockFixtures.forEach((blockFixture) => {
        test(blockFixture.testName, () => {
            const formattedBlock = blocksFormatter.formatToRPCStandard(
                blockFixture.block,
                '0x0'
            );
            expect(formattedBlock).toStrictEqual(blockFixture.expected);
        });
    });
});
