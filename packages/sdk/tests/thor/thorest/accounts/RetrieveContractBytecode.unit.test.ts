import { describe, expect, jest, test } from '@jest/globals';
import { Address, HexUInt } from '@common/vcdm';
import {
    RetrieveContractBytecode,
    RetrieveContractBytecodePath,
    ContractBytecode,
    ThorError,
    RetrieveContractBytecodeQuery
} from '@thor/thorest';
import { type ContractBytecodeJSON } from '@thor/thorest/json';
import {
    mockHttpClient,
    mockHttpClientWithError
} from '../../../MockHttpClient';
/**
 * VeChain retrieve contract bytecode - unit
 *
 * @group unit/thor/accounts
 */
describe('RetrieveContractBytecode unit tests', () => {
    describe('RetrieveContractBytecodePath', () => {
        test('constructs correct path', () => {
            const address = Address.of(
                '0x0000000000000000000000000000456E65726779'
            );
            const path = new RetrieveContractBytecodePath(address);
            expect(path.path).toBe(`/accounts/${address}/code`);
        });
    });

    describe('RetrieveContractBytecode', () => {
        test('static of() creates instance correctly', () => {
            const address = Address.of(
                '0x0000000000000000000000000000456E65726779'
            );
            const request = RetrieveContractBytecode.of(address);
            expect(request).toBeInstanceOf(RetrieveContractBytecode);
            expect(
                (request as unknown as { path: RetrieveContractBytecodePath })
                    .path
            ).toBeInstanceOf(RetrieveContractBytecodePath);
            expect(
                (request as unknown as { path: RetrieveContractBytecodePath })
                    .path.address
            ).toBe(address);
        });

        test('askTo() processes response correctly', async () => {
            const address = Address.of(
                '0x0000000000000000000000000000456E65726779'
            );
            const mockResponse = {
                code: '0x1234'
            };

            const mockClient = mockHttpClient<ContractBytecodeJSON>(
                mockResponse,
                'get'
            );

            const request = RetrieveContractBytecode.of(address);
            const result = await request.askTo(mockClient);

            const getSpy = jest.spyOn(mockClient, 'get');
            expect(getSpy).toHaveBeenCalledWith(
                expect.any(RetrieveContractBytecodePath),
                expect.any(RetrieveContractBytecodeQuery)
            );

            expect(result.request).toBe(request);
            expect(result.response).toBeInstanceOf(ContractBytecode);
            expect(result.response.code).toBeInstanceOf(HexUInt);
            expect(result.response.code.toString()).toBe('0x1234');
        });

        test('askTo() handles error response', async () => {
            const address = Address.of(
                '0x0000000000000000000000000000456E65726779'
            );

            const request = RetrieveContractBytecode.of(address);
            const mockClient = mockHttpClientWithError('Network error', 'get');

            try {
                await request.askTo(mockClient);
                // Triggers the catch block
                expect(true).toBe(false);
            } catch (error) {
                expect(error).toBeInstanceOf(ThorError);
                const thorError = error as ThorError;

                expect(thorError.message).toBe('"Network error"');
                expect(thorError.fqn).toBe(
                    'packages/sdk/src/thor/thorest/accounts/methods/RetrieveContractBytecode.ts!askTo(httpClient: HttpClient): Promise<ThorResponse<RetrieveContractBytecode, ContractBytecode>>'
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
