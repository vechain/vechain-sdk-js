import { describe, expect, jest, test } from '@jest/globals';
import { Block } from '@thor/thor-client/model/blocks/Block';
import { ExpandedBlock } from '@thor/thor-client/model/blocks/ExpandedBlock';
import { BlocksModule } from '@thor/thor-client/blocks';
import { IllegalArgumentError } from '@common/errors';
import {
    ExpandedBlockResponse,
    RegularBlockResponse
} from '@thor/thorest/blocks/response';
import {
    type ExpandedBlockResponseJSON,
    type RegularBlockResponseJSON
} from '@thor/thorest/json';

/**
 * @group unit/thor/blocks
 */
describe('BlocksModule waitForBlock APIs', () => {
    const baseRegularBlock: RegularBlockResponseJSON = {
        number: 10,
        id: '0x0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20',
        size: 1,
        parentID: '0x00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff',
        timestamp: 1,
        gasLimit: '0x1',
        beneficiary: '0x0000000000000000000000000000000000000000',
        gasUsed: '0x0',
        totalScore: 1,
        txsRoot: '0x0000000000000000000000000000000000000000000000000000000000000000',
        txsFeatures: 0,
        stateRoot: '0x0000000000000000000000000000000000000000000000000000000000000000',
        receiptsRoot: '0x0000000000000000000000000000000000000000000000000000000000000000',
        com: false,
        signer: '0x0000000000000000000000000000000000000000',
        isTrunk: true,
        isFinalized: false,
        baseFeePerGas: '0x0',
        transactions: ['0x1']
    };

    const baseExpandedBlock: ExpandedBlockResponseJSON = {
        ...baseRegularBlock,
        transactions: [
            {
                id: '0x1',
                type: 1,
                chainTag: 1,
                blockRef: '0x0',
                expiration: 0,
                clauses: [],
                maxFeePerGas: '0x0',
                maxPriorityFeePerGas: '0x0',
                gas: 1,
                origin: '0x0000000000000000000000000000000000000000',
                delegator: null,
                nonce: '0x0',
                dependsOn: null,
                size: 1,
                gasUsed: 1,
                gasPayer: '0x0000000000000000000000000000000000000000',
                paid: '0x0',
                reward: '0x0',
                reverted: false,
                outputs: []
            }
        ]
    } satisfies ExpandedBlockResponseJSON;

    const createBlock = (number: number): Block => {
        const response = new RegularBlockResponse({
            ...baseRegularBlock,
            number
        });
        const block = Block.fromResponse(response);
        if (block === null) {
            throw new Error('Failed to build block fixture');
        }
        return block;
    };

    const createExpandedBlock = (number: number): ExpandedBlock => {
        const response = new ExpandedBlockResponse({
            ...baseExpandedBlock,
            number
        });
        const block = ExpandedBlock.fromResponse(response);
        if (block === null) {
            throw new Error('Failed to build expanded block fixture');
        }
        return block;
    };

    const createModule = (): BlocksModule =>
        new BlocksModule({} as unknown as import('@common/http').HttpClient);

    afterEach(() => {
        jest.useRealTimers();
        jest.restoreAllMocks();
    });

    test('waitForBlock resolves once the target block number is observed', async () => {
        jest.useFakeTimers();
        const module = createModule();
        jest
            .spyOn(module, 'getBlock')
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce(createBlock(4))
            .mockResolvedValueOnce(createBlock(5));

        const resultPromise = module.waitForBlock(5, {
            intervalMs: 100,
            timeoutMs: 5_000
        });

        // Advance timers to trigger the polling
        await jest.advanceTimersByTimeAsync(200);
        
        const result = await resultPromise;
        expect(result).toHaveProperty('number', 5);
    });

    test('waitForBlockExpanded polls expanded blocks until the target block number is available', async () => {
        jest.useFakeTimers();
        const module = createModule();
        const spy = jest
            .spyOn(module, 'getBlockExpanded')
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce(createExpandedBlock(3));

        const resultPromise = module.waitForBlockExpanded(3, {
            intervalMs: 50,
            timeoutMs: 5_000
        });

        await Promise.resolve();
        await jest.advanceTimersByTimeAsync(50);
        await Promise.resolve();

        await expect(resultPromise).resolves.toHaveProperty('number', 3);
        expect(spy).toHaveBeenCalledTimes(2);
    });


    test('waitForBlock rejects when the timeout is reached', async () => {
        const module = createModule();
        jest.spyOn(module, 'getBlock').mockResolvedValue(null);

        await expect(module.waitForBlock(42, {
            intervalMs: 10,
            timeoutMs: 50
        })).rejects.toThrow(IllegalArgumentError);
    });

    test('waitForBlock validates the provided block number', async () => {
        const module = createModule();
        await expect(module.waitForBlock(-1)).rejects.toThrow(
            IllegalArgumentError
        );
    });
});

