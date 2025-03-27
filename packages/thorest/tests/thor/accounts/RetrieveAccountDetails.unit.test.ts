import { describe, expect, test, jest } from '@jest/globals';
import { Address, VET, VTHO } from '@vechain/sdk-core';
import {
    RetrieveAccountDetails,
    RetrieveAccountDetailsPath,
    GetAccountResponse
} from '../../../src';
import { type HttpClient } from '../../../src/http';

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

            const mockHttpClient = {
                get: jest.fn(
                    async () =>
                        await Promise.resolve({
                            json: async () =>
                                await Promise.resolve(mockResponse)
                        })
                ),
                post: jest.fn(
                    async () =>
                        await Promise.resolve({
                            json: async () => await Promise.resolve({})
                        })
                )
            } as unknown as HttpClient;

            const request = RetrieveAccountDetails.of(address);
            const result = await request.askTo(mockHttpClient);

            expect(mockHttpClient.get).toHaveBeenCalledWith(
                expect.any(RetrieveAccountDetailsPath),
                { query: '' }
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

            const mockHttpClient = {
                get: jest.fn(
                    async () => await Promise.reject(new Error('Network error'))
                ),
                post: jest.fn(
                    async () =>
                        await Promise.resolve({
                            json: async () => await Promise.resolve({})
                        })
                )
            } as unknown as HttpClient;

            const request = RetrieveAccountDetails.of(address);
            await expect(request.askTo(mockHttpClient)).rejects.toThrow(
                'Network error'
            );
        });
    });
});
