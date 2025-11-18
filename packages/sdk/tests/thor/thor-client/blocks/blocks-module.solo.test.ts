import { describe, expect, test } from '@jest/globals';
import { ThorClient } from '@thor/thor-client/ThorClient';
import { BlockRef, Hex, Revision } from '@common/vcdm';
import { getConfigData } from '@vechain/sdk-solo-setup';
import { ThorNetworks } from '@thor/utils/const/network';

const createThorClient = (): ThorClient => ThorClient.at(ThorNetworks.SOLONET);

/**
 * BlocksModule tests against the solo network.
 * @group solo
 */
describe('BlocksModule (solo)', () => {
    test('getBlock returns the current best block', async () => {
        const client = createThorClient();
        const block = await client.blocks.getBlock();
        expect(block).not.toBeNull();
        expect(block?.id.toString().length).toBeGreaterThan(0);
        expect(block?.number).toBeGreaterThan(0);
    });

    test('getBlock with numeric revision returns genesis block', async () => {
        const client = createThorClient();
        const block = await client.blocks.getBlock(Revision.GENESIS);
        expect(block).not.toBeNull();
        expect(block?.number).toBe(0);
        expect(block?.parentID.toString().length).toBeGreaterThan(0);
    });

    test('getBlockExpanded returns expanded block with transactions array', async () => {
        const client = createThorClient();
        const block = await client.blocks.getBlockExpanded();
        expect(block).not.toBeNull();
        expect(Array.isArray(block?.transactions)).toBe(true);
    });

    test('getBlockRaw returns the raw payload for the best block', async () => {
        const client = createThorClient();
        const raw = await client.blocks.getBlockRaw();
        expect(raw).not.toBeNull();
        expect(raw?.raw.toString().length).toBeGreaterThan(0);
    });

    test('getBestBlockRef returns a valid BlockRef instance', async () => {
        const client = createThorClient();
        const ref = await client.blocks.getBestBlockRef();
        expect(ref).toBeInstanceOf(BlockRef);
        expect(ref?.toString().length).toBe(18);
    });

    test('getGenesisBlock using helper returns the genesis block', async () => {
        const client = createThorClient();
        const block = await client.blocks.getGenesisBlock();
        expect(block).not.toBeNull();
        expect(block?.number).toBe(0);
    });

    test('getBlock respects numeric revision parameter', async () => {
        const client = createThorClient();
        const genesis = await client.blocks.getBlock(Revision.GENESIS);
        expect(genesis).not.toBeNull();
        expect(genesis?.number).toBe(0);
    });

    test('get block for solo token seeding', async () => {
        const client = createThorClient();
        const soloConfig = getConfigData();
        const seedTxId = Hex.of(soloConfig.SEED_TEST_TOKEN_TX_ID);
        const txReceipt =
            await client.transactions.getTransactionReceipt(seedTxId);
        const blockId = txReceipt?.meta.blockID;
        expect(blockId).toBeDefined();
        const block = await client.blocks.getBlock(
            Revision.of(blockId ?? Hex.of(0))
        );
        expect(block).not.toBeNull();
        expect(block?.number).toBe(txReceipt?.meta.blockNumber);
        expect(block?.transactions).toBeDefined();
        expect(block?.transactions?.length).toBeGreaterThan(0);
    });
});
