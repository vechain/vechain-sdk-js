import { describe, expect, test } from '@jest/globals';
import { Address, HexUInt } from '@vechain/sdk-core';
import {
    RetrieveContractBytecode,
    RetrieveContractBytecodePath,
    ContractBytecode
} from '../../../src';
import {
    mockHttpClient,
    mockHttpClientWithError
} from '../../utils/MockUnitTestClient';
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
            expect(request.path).toBeInstanceOf(RetrieveContractBytecodePath);
            expect(request.path.address).toBe(address);
        });

        test('askTo() processes response correctly', async () => {
            const address = Address.of(
                '0x0000000000000000000000000000456E65726779'
            );
            const mockResponse = {
                code: '0x1234'
            };

            const mockClient = mockHttpClient<ContractBytecode>(
                new ContractBytecode(mockResponse),
                'get'
            );

            const request = RetrieveContractBytecode.of(address);
            const result = await request.askTo(mockClient);

            expect(mockClient.get).toHaveBeenCalledWith(
                (expect.any(RetrieveContractBytecodePath), { query: '' })
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
            await expect(
                request.askTo(mockHttpClientWithError('Network error', 'get'))
            ).rejects.toThrow('Network error');
        });
    });
});
