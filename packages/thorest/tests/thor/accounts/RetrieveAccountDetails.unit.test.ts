import { describe, expect, test } from '@jest/globals';
import { Address, VET, VTHO } from '@vechain/sdk-core';
import {
    RetrieveAccountDetails,
    RetrieveAccountDetailsPath,
    GetAccountResponse
} from '../../../src';
import {
    mockHttpClient,
    mockHttpClientWithError
} from '../../utils/MockUnitTestClient';

/**
 * VeChain retrieve account details - unit
 *
 * @group unit/accounts
 */
describe('RetrieveAccountDetails unit tests', () => {
    describe('RetrieveAccountDetailsPath', () => {
        test('constructs correct path', () => {
            const address = Address.of(
                '0x0000000000000000000000000000456E65726779'
            );
            const path = new RetrieveAccountDetailsPath(address);
            expect(path.path).toBe(`/accounts/${address}`);
        });
    });

    describe('RetrieveAccountDetails', () => {
        test('static of() creates instance correctly', () => {
            const address = Address.of(
                '0x0000000000000000000000000000456E65726779'
            );
            const request = RetrieveAccountDetails.of(address);
            expect(request).toBeInstanceOf(RetrieveAccountDetails);
            expect(request.path).toBeInstanceOf(RetrieveAccountDetailsPath);
            expect(request.path.address).toBe(address);
        });

        test('askTo() processes response correctly', async () => {
            const address = Address.of(
                '0x0000000000000000000000000000456E65726779'
            );
            const mockResponse = {
                balance: '0x1234',
                energy: '0x5678',
                hasCode: true
            };

            const mockClient = mockHttpClient<GetAccountResponse>(
                new GetAccountResponse(mockResponse),
                'get'
            );
            const request = RetrieveAccountDetails.of(address);
            const result = await request.askTo(mockClient);

            expect(mockClient.get).toHaveBeenCalledWith(
                (expect.any(RetrieveAccountDetailsPath), { query: '' })
            );

            expect(result.request).toBe(request);
            expect(result.response).toBeInstanceOf(GetAccountResponse);
            expect(result.response.balance).toBeInstanceOf(VET);
            expect(result.response.energy).toBeInstanceOf(VTHO);
            expect(result.response.hasCode).toBe(true);
            expect(result.response.balance.wei.toString(16)).toBe('1234');
            expect(result.response.energy.wei.toString(16)).toBe('5678');
        });

        test('askTo() handles error response', async () => {
            const address = Address.of(
                '0x0000000000000000000000000000456E65726779'
            );

            const mockClient = mockHttpClientWithError('Network error', 'get');
            const request = RetrieveAccountDetails.of(address);
            await expect(request.askTo(mockClient)).rejects.toThrow(
                'Network error'
            );
        });
    });
});
