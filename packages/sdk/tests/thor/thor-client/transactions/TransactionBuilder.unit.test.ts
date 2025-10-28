import { FetchHttpClient, Hex } from '@common';
import { describe, expect, jest, test } from '@jest/globals';
import { ThorClient } from '@thor/thor-client';
import { TransactionBuilder } from '@thor/thor-client/transactions/TransactionBuilder';
import { Clause } from '@thor/thor-client/model/transactions';
import { Address, Revision } from '@common/vcdm';
import { RetrieveRegularBlock } from '@thor/thorest/blocks';

/**
 * @group unit
 */
describe('TransactionBuilder UNIT tests', () => {
    test('legacy tx with explicit parameters', async () => {
        const thorClient = ThorClient.at(
            FetchHttpClient.at(new URL('http://localhost:8669'))
        );
        const builder = TransactionBuilder.create(thorClient);
        const transaction = await builder
            .withSponsorReq(
                Address.of('0x05b0f21cCcF4c6AAbcA8Fe90904f878BeE47938A')
            )
            .withBlockRef(Hex.of('0x1234'))
            .withChainTag(1)
            .withClauses([new Clause(Address.of('0x0'), 1n, null, null, null)])
            .withDependsOn(Hex.of('0x4321'))
            .withExpiration(1)
            .withGas(1n)
            .withGasPriceCoef(2n)
            .withNonce(9)
            .build();
        expect(transaction.blockRef.toString()).toBe('0x1234');
        expect(transaction.chainTag).toBe(1);
        expect(transaction.clauses).toHaveLength(1);
        expect(transaction.dependsOn?.toString()).toBe('0x4321');
        expect(transaction.expiration).toBe(1);
        expect(transaction.gas).toBe(1n);
        expect(transaction.gasPriceCoef).toBe(2n);
        expect(transaction.nonce).toBe(9);
        expect(transaction.isIntendedToBeSponsored).toBe(true);
        expect(transaction.maxFeePerGas).toBeUndefined();
        expect(transaction.maxPriorityFeePerGas).toBeUndefined();
    });
    test('dynamic fee gasPriceCoef is undefined', async () => {
        const thorClient = ThorClient.at(
            FetchHttpClient.at(new URL('http://localhost:8669'))
        );
        const builder = TransactionBuilder.create(thorClient);
        const transaction = await builder
            .withMaxFeePerGas(1n)
            .withMaxPriorityFeePerGas(6n)
            .build();
        expect(transaction.maxFeePerGas).toBe(1n);
        expect(transaction.maxPriorityFeePerGas).toBe(6n);
        expect(transaction.gasPriceCoef).toBeUndefined();
    });
    test('default expiration', async () => {
        const thorClient = ThorClient.at(
            FetchHttpClient.at(new URL('http://localhost:8669'))
        );
        const builder =
            TransactionBuilder.create(thorClient).withGasPriceCoef(0n);
        const transaction = await builder.build();
        expect(transaction.expiration).toBe(
            TransactionBuilder.DEFAULT_EXPIRATION
        );
    });
    test('with default BlockRef throws error if best block is not available', async () => {
        const thorClient = ThorClient.at(
            FetchHttpClient.at(new URL('http://localhost:8669'))
        );
        // mock the retrieveRegularBlock method to return null
        const query = RetrieveRegularBlock.of(Revision.BEST);
        const mockRetrieveRegularBlock = jest.spyOn(query, 'askTo');
        mockRetrieveRegularBlock.mockResolvedValue({
            request: RetrieveRegularBlock.of(Revision.BEST),
            response: null
        });
        // inject the mock query into the RetrieveRegularBlock.of method
        const RetrieveRegularBlockOf = jest.spyOn(RetrieveRegularBlock, 'of');
        RetrieveRegularBlockOf.mockReturnValue(query);
        // create the builder and try to set the default block ref
        const builder =
            TransactionBuilder.create(thorClient).withDefaultBlockRef();
        await expect(async () => await builder.build()).rejects.toThrow();
    });
});
