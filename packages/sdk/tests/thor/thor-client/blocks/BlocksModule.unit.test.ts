import { describe, expect, jest, test } from '@jest/globals';
import { BlocksModule } from '@thor/thor-client/blocks/blocks-module';
import { Block, ExpandedBlock, RawBlock } from '@thor/thor-client/model';
import { IllegalArgumentError } from '@common/errors';
import { Revision } from '@common/vcdm';
import { type HttpClient, type HttpRequest, type HttpResponse } from '@common/http';
import {
    RetrieveRegularBlock,
    RetrieveExpandedBlock,
    RetrieveRawBlock,
    type RegularBlockResponseJSON,
    type ExpandedBlockResponseJSON,
    type RawBlockJSON
} from '@thor/thorest';

jest.mock('@thor/thorest', () => {
    const actual = jest.requireActual('@thor/thorest');
    return {
        ...actual,
        RetrieveRegularBlock: {
            of: jest.fn()
        },
        RetrieveExpandedBlock: {
            of: jest.fn()
        },
        RetrieveRawBlock: {
            of: jest.fn()
        }
    };
});

const mockAskTo = <T>(response: T) => jest.fn().mockResolvedValue({ response });

const createModule = (): BlocksModule => {
    const httpClient: HttpClient = {
        request: jest.fn().mockImplementation((_req: HttpRequest) => {
            return Promise.resolve({ status: 200 } as HttpResponse<unknown>);
        })
    } as HttpClient;
    return new BlocksModule(httpClient);
};

describe('BlocksModule', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('getBlockRegular returns mirrored block', async () => {
        const payload: RegularBlockResponseJSON = {
            number: 1,
            id: '0x01',
            size: 123,
            parentID: '0x00',
            timestamp: 999,
            gasLimit: '10',
            beneficiary: '0xabc',
            gasUsed: '5',
            baseFeePerGas: '0x7',
            totalScore: 2,
            txsRoot: '0xroot',
            txsFeatures: 0,
            stateRoot: '0xstate',
            receiptsRoot: '0xreceipts',
            com: false,
            signer: '0xsigner',
            isTrunk: true,
            isFinalized: false,
            transactions: ['0xtx']
        };

        (RetrieveRegularBlock.of as jest.Mock).mockReturnValue({
            askTo: mockAskTo(payload)
        });

        const module = createModule();
        const block = await module.getBlockRegular('best');

        expect(block).toBeInstanceOf(Block);
        expect(block?.id).toBe(payload.id);
        expect(block?.transactions).toEqual(payload.transactions);
    });

    test('getBlockExpanded returns mirrored expanded block', async () => {
        const payload: ExpandedBlockResponseJSON = {
            number: 1,
            id: '0x01',
            size: 10,
            parentID: '0x00',
            timestamp: 1,
            gasLimit: '1',
            beneficiary: '0xabc',
            gasUsed: '1',
            baseFeePerGas: undefined,
            totalScore: 0,
            txsRoot: '0xroot',
            txsFeatures: 0,
            stateRoot: '0xstate',
            receiptsRoot: '0xreceipts',
            com: false,
            signer: '0xsigner',
            isTrunk: false,
            isFinalized: true,
            transactions: []
        };

        (RetrieveExpandedBlock.of as jest.Mock).mockReturnValue({
            askTo: mockAskTo(payload)
        });

        const module = createModule();
        const block = await module.getBlockExpanded('best');

        expect(block).toBeInstanceOf(ExpandedBlock);
        expect(block?.isFinalized).toBe(true);
    });

    test('getBlockRaw returns mirrored raw block', async () => {
        const payload: RawBlockJSON = {
            raw: '0xdead'
        };

        (RetrieveRawBlock.of as jest.Mock).mockReturnValue({
            askTo: mockAskTo(payload)
        });

        const module = createModule();
        const block = await module.getBlockRaw(0);

        expect(block).toBeInstanceOf(RawBlock);
        expect(block?.raw).toBe('0xdead');
    });

    test('throws IllegalArgumentError when block number mismatch', async () => {
        const payload: RegularBlockResponseJSON = {
            number: 2,
            id: '0x02',
            size: 10,
            parentID: '0x00',
            timestamp: 0,
            gasLimit: '0',
            beneficiary: '0x0',
            gasUsed: '0',
            totalScore: 0,
            txsRoot: '0x0',
            txsFeatures: 0,
            stateRoot: '0x0',
            receiptsRoot: '0x0',
            com: false,
            signer: '0x0',
            isTrunk: false,
            isFinalized: false,
            transactions: []
        };

        (RetrieveRegularBlock.of as jest.Mock).mockReturnValue({
            askTo: mockAskTo(payload)
        });

        const module = createModule();

        await expect(module.getBlockRegular(1)).rejects.toBeInstanceOf(
            IllegalArgumentError
        );
    });
});

