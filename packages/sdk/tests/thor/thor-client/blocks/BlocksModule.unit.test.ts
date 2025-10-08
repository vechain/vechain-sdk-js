import { describe, expect, jest, test } from '@jest/globals';
import { BlocksModule } from '@thor/thor-client/blocks/blocks-module';
import { Block } from '@thor/thor-client/model/blocks/Block';
import { ExpandedBlock } from '@thor/thor-client/model/blocks/ExpandedBlock';
import { RawBlock } from '@thor/thor-client/model/blocks/RawBlock';
import { BlockTransaction } from '@thor/thor-client/model/blocks/transaction/BlockTransaction';
import { IllegalArgumentError } from '@common/errors';
import { BlockRef, Revision } from '@common/vcdm';
import type { HttpClient, HttpRequest, HttpResponse } from '@common/http';
import {
    RetrieveRegularBlock,
    RetrieveExpandedBlock,
    RetrieveRawBlock
} from '@thor/thorest';
import type {
    RegularBlockResponseJSON,
    ExpandedBlockResponseJSON,
    RawBlockJSON,
    TxWithReceiptJSON
} from '@thor/thorest/json';

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

function mockAskTo<T>(response: T) {
    return jest.fn().mockResolvedValue({ response });
}

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

    test('getBlock returns mirrored block', async () => {
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
        const block = await module.getBlock('best');

        expect(block).toBeInstanceOf(Block);
        expect(block?.id.toString()).toBe(payload.id);
        expect(block?.transactions).toEqual(payload.transactions);
    });

    test('getBestBlockRef returns BlockRef for best block', async () => {
        const payload: RegularBlockResponseJSON = {
            number: 1,
            id: '0x0123456789abcdef0123456789abcdef',
            size: 1,
            parentID: '0x0',
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
            isTrunk: true,
            isFinalized: false,
            transactions: []
        };

        (RetrieveRegularBlock.of as jest.Mock).mockReturnValue({
            askTo: mockAskTo(payload)
        });

        const module = createModule();
        const ref = await module.getBestBlockRef();

        expect(ref).toBeInstanceOf(BlockRef);
        expect(ref?.toString()).toBe('0x0123456789abcdef');
    });

    test('getGenesisBlock delegates to numeric revision', async () => {
        const payload: RegularBlockResponseJSON = {
            number: 0,
            id: '0xgenesis',
            size: 1,
            parentID: '0x0',
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
            isTrunk: true,
            isFinalized: true,
            transactions: []
        };

        (RetrieveRegularBlock.of as jest.Mock).mockReturnValue({
            askTo: mockAskTo(payload)
        });

        const module = createModule();
        const block = await module.getGenesisBlock();

        expect(block?.number).toBe(0);
        expect(block?.id.toString()).toBe('0xgenesis');
    });

    test('getBlockExpanded returns mirrored expanded block', async () => {
        const tx: TxWithReceiptJSON = {
            id: '0x01',
            type: null,
            origin: '0x0',
            delegator: null,
            size: 10,
            chainTag: 1,
            blockRef: '0x0',
            expiration: 10,
            clauses: [],
            gasPriceCoef: null,
            maxFeePerGas: null,
            maxPriorityFeePerGas: null,
            gas: '0x1',
            dependsOn: null,
            nonce: '0x1',
            gasUsed: 1,
            gasPayer: '0x0',
            paid: '0x1',
            reward: '0x1',
            reverted: false,
            outputs: []
        };

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
            transactions: [tx]
        };

        (RetrieveExpandedBlock.of as jest.Mock).mockReturnValue({
            askTo: mockAskTo(payload)
        });

        const module = createModule();
        const block = await module.getBlockExpanded('best');

        expect(block).toBeInstanceOf(ExpandedBlock);
        expect(block?.isFinalized).toBe(true);
        expect(block?.transactions.at(0)).toBeInstanceOf(BlockTransaction);
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

        await expect(module.getBlock(1)).rejects.toBeInstanceOf(
            IllegalArgumentError
        );
    });
});

