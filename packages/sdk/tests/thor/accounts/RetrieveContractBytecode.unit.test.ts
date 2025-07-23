import { describe, expect, jest, test } from '@jest/globals';
import { Address, HexUInt } from '@vcdm';
import {
    RetrieveContractBytecode,
    RetrieveContractBytecodePath,
    ContractBytecode,
    ThorError
} from '@thor';
import { type ContractBytecodeJSON } from '@thor/json';
import {
    mockHttpClient,
    mockHttpClientWithError
} from '../../MockHttpClient';
/**
 * VeChain retrieve contract bytecode - unit
 *
 * @group unit/accounts
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
                { query: '' }
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

                expect(thorError.message).toBe('Bad response.');
                expect(thorError.fqn).toBe(
                    'packages/sdk/src/thor/accounts/RetrieveContractBytecode.ts!askTo(httpClient: HttpClient): Promise<ThorResponse<RetrieveContractBytecode, ContractBytecode>>'
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
