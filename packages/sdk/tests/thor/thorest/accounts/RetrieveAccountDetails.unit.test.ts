import { describe, expect, jest, test } from '@jest/globals';
import { Address, Revision } from '@common/vcdm';
import {
    RetrieveAccountDetails,
    RetrieveAccountDetailsPath,
    RetrieveAccountDetailsQuery,
    GetAccountResponse,
    ThorError
} from '@thor/thorest';
import { type GetAccountResponseJSON } from '@thor/thorest/json';
import {
    mockHttpClient,
    mockHttpClientWithError
} from '../../../MockHttpClient';

/**
 * VeChain retrieve account details - unit
 *
 * @group unit/thor/accounts
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

    describe('RetrieveAccountDetailsQuery', () => {
        test('constructs empty query when no revision provided', () => {
            const query = new RetrieveAccountDetailsQuery();
            expect(query.query).toBe('');
        });

        test('constructs query with revision when provided', () => {
            const query = new RetrieveAccountDetailsQuery(Revision.BEST);
            expect(query.query).toBe('?revision=best');
        });

        test('constructs query with numeric revision', () => {
            const query = new RetrieveAccountDetailsQuery(Revision.of(123));
            expect(query.query).toBe('?revision=123');
        });
    });

    describe('RetrieveAccountDetails', () => {
        test('static of() creates instance correctly', () => {
            const address = Address.of(
                '0x0000000000000000000000000000456E65726779'
            );
            const request = RetrieveAccountDetails.of(address);
            expect(request).toBeInstanceOf(RetrieveAccountDetails);
            expect(
                (request as unknown as { path: RetrieveAccountDetailsPath })
                    .path
            ).toBeInstanceOf(RetrieveAccountDetailsPath);
            expect(
                (request as unknown as { path: RetrieveAccountDetailsPath })
                    .path.address
            ).toBe(address);
        });

        test('static of() creates instance with revision', () => {
            const address = Address.of(
                '0x0000000000000000000000000000456E65726779'
            );
            const request = RetrieveAccountDetails.of(address, Revision.BEST);
            expect(request).toBeInstanceOf(RetrieveAccountDetails);
            expect(
                (request as unknown as { query: RetrieveAccountDetailsQuery })
                    .query
            ).toBeInstanceOf(RetrieveAccountDetailsQuery);
            expect(
                (request as unknown as { query: RetrieveAccountDetailsQuery })
                    .query.query
            ).toBe('?revision=best');
        });

        test('askTo() processes response correctly without revision', async () => {
            const address = Address.of(
                '0x0000000000000000000000000000456E65726779'
            );
            const mockResponse = {
                balance: '0x1234',
                energy: '0x5678',
                hasCode: true
            };

            const mockClient = mockHttpClient<GetAccountResponseJSON>(
                mockResponse,
                'get'
            );
            const request = RetrieveAccountDetails.of(address);
            const result = await request.askTo(mockClient);

            const getSpy = jest.spyOn(mockClient, 'get');
            expect(getSpy).toHaveBeenCalledWith(
                expect.any(RetrieveAccountDetailsPath),
                expect.any(RetrieveAccountDetailsQuery)
            );

            expect(result.request).toBe(request);
            expect(result.response).toBeInstanceOf(GetAccountResponse);
            expect(result.response.hasCode).toBe(true);
            expect(result.response.balance.toString(16)).toBe('1234');
            expect(result.response.energy.toString(16)).toBe('5678');
        });

        test('askTo() processes response correctly with revision', async () => {
            const address = Address.of(
                '0x0000000000000000000000000000456E65726779'
            );
            const mockResponse = {
                balance: '0x1234',
                energy: '0x5678',
                hasCode: true
            };

            const mockClient = mockHttpClient<GetAccountResponseJSON>(
                mockResponse,
                'get'
            );
            const request = RetrieveAccountDetails.of(
                address,
                Revision.FINALIZED
            );
            const result = await request.askTo(mockClient);

            const getSpy = jest.spyOn(mockClient, 'get');
            expect(getSpy).toHaveBeenCalledWith(
                expect.any(RetrieveAccountDetailsPath),
                expect.objectContaining({
                    query: '?revision=finalized'
                })
            );

            expect(result.request).toBe(request);
            expect(result.response).toBeInstanceOf(GetAccountResponse);
            expect(result.response.hasCode).toBe(true);
            expect(result.response.balance.toString(16)).toBe('1234');
            expect(result.response.energy.toString(16)).toBe('5678');
        });

        test('askTo() handles error response', async () => {
            const address = Address.of(
                '0x0000000000000000000000000000456E65726779'
            );

            const mockClient = mockHttpClientWithError('Network error', 'get');
            const request = RetrieveAccountDetails.of(address);

            try {
                await request.askTo(mockClient);
            } catch (error) {
                expect(error).toBeInstanceOf(ThorError);
                const thorError = error as ThorError;

                expect(thorError.message).toBe('"Network error"');
                expect(thorError.fqn).toBe(
                    'packages/sdk/src/thor/thorest/accounts/methods/RetrieveAccountDetails.ts!askTo(httpClient: HttpClient): Promise<ThorResponse<RetrieveAccountDetails, GetAccountResponse>>'
                );
                expect(thorError.status).toBe(400);
                expect(thorError.args).toEqual({
                    url: expect.any(String)
                });
                expect(thorError.cause).toBeUndefined();
                expect(thorError).toBeInstanceOf(Error);
            }
        });
    });
});
