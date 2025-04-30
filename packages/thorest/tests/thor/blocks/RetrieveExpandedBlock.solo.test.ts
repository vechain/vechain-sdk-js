import { describe, expect, test } from '@jest/globals';
import {
    ExpandedBlockResponse,
    type ExpandedBlockResponseJSON,
    FetchHttpClient,
    RetrieveBlockError,
    RetrieveExpandedBlock,
    ThorNetworks
} from '../../../src';
import { Revision } from '../../../../core/src';

class InvalidRevision extends Revision {
    constructor() {
        super('invalid');
    }
}

describe('RetrieveRegularBlock SOLO tests', () => {
    const httpClient = FetchHttpClient.at(ThorNetworks.SOLONET);

    test('err: <- bad revision', async () => {
        const status = 400;
        try {
            await RetrieveExpandedBlock.of(new InvalidRevision()).askTo(
                httpClient
            );
            throw new Error('Should not reach here.');
        } catch (error) {
            expect(error).toBeInstanceOf(RetrieveBlockError);
            expect((error as RetrieveBlockError).status).toBe(status);
        }
    });

    test('ok <- block 0', async () => {
        const expected = {
            number: 0,
            id: '0x00000000c05a20fbca2bf6ae3affba6af4a74b800b585bf7a4988aba7aea69f6',
            size: 170,
            parentID:
                '0xffffffff00000000000000000000000000000000000000000000000000000000',
            timestamp: 1526400000,
            gasLimit: 10000000,
            beneficiary: '0x0000000000000000000000000000000000000000',
            gasUsed: 0,
            totalScore: 0,
            txsRoot:
                '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            txsFeatures: 0,
            stateRoot:
                '0x93de0ffb1f33bc0af053abc2a87c4af44594f5dcb1cb879dd823686a15d68550',
            receiptsRoot:
                '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            com: false,
            signer: '0x0000000000000000000000000000000000000000',
            isTrunk: true,
            isFinalized: true,
            transactions: []
        } satisfies ExpandedBlockResponseJSON;
        const actual = (
            await RetrieveExpandedBlock.of(Revision.of(0)).askTo(httpClient)
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(ExpandedBlockResponse);
        expect(actual).toEqual(new ExpandedBlockResponse(expected));
    });

    test('ok <- block 1', async () => {
        const expected = {
            number: 1,
            id: '0x00000001a3252b0b1f994fc9a9bc72aea96fb7e034cbf0052422c26a995a72ed',
            size: 556,
            parentID:
                '0x00000000c05a20fbca2bf6ae3affba6af4a74b800b585bf7a4988aba7aea69f6',
            timestamp: 1746001943,
            gasLimit: 150000000,
            beneficiary: '0xf077b491b355e64048ce21e3a6fc4751eeea77fa',
            gasUsed: 44794,
            totalScore: 1,
            txsRoot:
                '0x9e4a087f9d5e5263f7fef7bb86e7a2252a4b99abb47496b89105f8efc8ec44e7',
            txsFeatures: 1,
            stateRoot:
                '0xfe16328dd40592c86a4610ba93016156c2f5a1c14a54c1b84c97fd687eb64b70',
            receiptsRoot:
                '0x7b4823bf3a69934d810599180473a870518fd72fbff09593605fa38d065c941d',
            com: false,
            signer: '0xf077b491b355e64048ce21e3a6fc4751eeea77fa',
            isTrunk: true,
            isFinalized: false,
            baseFeePerGas: '0x9184e72a000',
            transactions: [
                {
                    id: '0xda74337f4c5ab50dbd34624df2de7a1f5f6ebe9408aa511632e43af6a0be5f07',
                    type: 0,
                    chainTag: 246,
                    blockRef: '0x0000000000000000',
                    expiration: 4294967295,
                    clauses: [
                        {
                            to: '0x0000000000000000000000000000506172616d73',
                            value: '0x0',
                            data: '0x273f4940000000000000000000000000000000000000626173652d6761732d7072696365000000000000000000000000000000000000000000000000000009184e72a000'
                        }
                    ],
                    gasPriceCoef: 0,
                    gas: 1000000,
                    origin: '0xf077b491b355e64048ce21e3a6fc4751eeea77fa',
                    delegator: null,
                    nonce: '0x129145c3dbbc135e',
                    dependsOn: null,
                    size: 189,
                    gasUsed: 44794,
                    gasPayer: '0xf077b491b355e64048ce21e3a6fc4751eeea77fa',
                    paid: '0x26da441abd4d90000',
                    reward: '0x2676cda9d5028c000',
                    reverted: false,
                    outputs: [
                        {
                            contractAddress: null,
                            events: [
                                {
                                    address:
                                        '0x0000000000000000000000000000506172616d73',
                                    topics: [
                                        '0x28e3246f80515f5c1ed987b133ef2f193439b25acba6a5e69f219e896fc9d179',
                                        '0x000000000000000000000000000000000000626173652d6761732d7072696365'
                                    ],
                                    data: '0x000000000000000000000000000000000000000000000000000009184e72a000'
                                }
                            ],
                            transfers: []
                        }
                    ]
                }
            ]
        } satisfies ExpandedBlockResponseJSON;
        const actual = (
            await RetrieveExpandedBlock.of(Revision.of(1)).askTo(httpClient)
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(ExpandedBlockResponse);
        expect(actual).toEqual(new ExpandedBlockResponse(expected));
    });

    test('ok <- block BEST', async () => {
        const actual = (
            await RetrieveExpandedBlock.of(Revision.BEST).askTo(httpClient)
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(ExpandedBlockResponse);
    });

    test('ok <- block FINALIZED', async () => {
        const expected = {
            number: 0,
            id: '0x00000000c05a20fbca2bf6ae3affba6af4a74b800b585bf7a4988aba7aea69f6',
            size: 170,
            parentID:
                '0xffffffff00000000000000000000000000000000000000000000000000000000',
            timestamp: 1526400000,
            gasLimit: 10000000,
            beneficiary: '0x0000000000000000000000000000000000000000',
            gasUsed: 0,
            totalScore: 0,
            txsRoot:
                '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            txsFeatures: 0,
            stateRoot:
                '0x93de0ffb1f33bc0af053abc2a87c4af44594f5dcb1cb879dd823686a15d68550',
            receiptsRoot:
                '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
            com: false,
            signer: '0x0000000000000000000000000000000000000000',
            isTrunk: true,
            isFinalized: true,
            transactions: []
        };
        const actual = (
            await RetrieveExpandedBlock.of(Revision.FINALIZED).askTo(httpClient)
        ).response;
        expect(actual).toBeDefined();
        expect(actual).toBeInstanceOf(ExpandedBlockResponse);
        expect(actual).toEqual(new ExpandedBlockResponse(expected));
    });

    test('null <- block not found', async () => {
        const actual = (
            await RetrieveExpandedBlock.of(
                Revision.of(Math.pow(2, 32) - 1) // Max block address value.
            ).askTo(httpClient)
        ).response;
        expect(actual).toBeNull();
    });
});
