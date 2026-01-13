import { describe, expect, jest, test } from '@jest/globals';
import { Address, HexUInt } from '@common/vcdm';
import {
    RetrieveContractBytecode,
    RetrieveContractBytecodePath,
    ContractBytecode,
    RetrieveContractBytecodeQuery
} from '@thor/thorest';
import { type ContractBytecodeJSON } from '@thor/thorest/json';
import {
    mockHttpClient,
    mockHttpClientWithError
} from '../../../MockHttpClient';
import { HttpError } from '@common/errors';

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
                expect(error).toBeInstanceOf(HttpError);
                const thorError = error as HttpError;

                expect(thorError.message).toBe(
                    'HTTP request failed with status 400'
                );
                expect(thorError.status).toBe(400);
                expect(thorError.statusText).toBe('Bad Request');
                expect(thorError.url).toEqual(expect.any(String));
                expect(thorError).toBeInstanceOf(Error);
            }
        });
    });
});
