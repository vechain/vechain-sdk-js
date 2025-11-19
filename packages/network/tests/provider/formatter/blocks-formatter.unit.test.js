"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const fixture_1 = require("./fixture");
const src_1 = require("../../../src");
/**
 * Blocks formatter unit test
 * @group unit/provider/formatter/blocks
 */
(0, globals_1.describe)('Blocks formatter unit test', () => {
    /**
     * Should be able to format a block
     */
    fixture_1.blockFixtures.forEach((blockFixture) => {
        (0, globals_1.test)(blockFixture.testName, () => {
            const formattedBlock = src_1.blocksFormatter.formatToRPCStandard(blockFixture.block, '0x0');
            (0, globals_1.expect)(formattedBlock).toStrictEqual(blockFixture.expected);
        });
    });
});
