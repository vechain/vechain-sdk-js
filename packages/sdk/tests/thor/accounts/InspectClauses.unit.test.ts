import { describe, expect, test } from '@jest/globals';
import { InspectClauses } from '@thor';
import {
    type ExecuteCodeResponseJSON,
    type ExecuteCodesRequestJSON
} from '@thor/thorest/json';
import { HexUInt } from '@common/vcdm';
import { mockHttpClient } from '../../MockHttpClient';

/**
 * VeChain inspect clauses - unit
 *
 * @group unit/accounts
 */
describe('InspectClauses unit tests', () => {
    test('should inspect clauses successfully', async () => {
        // Mock request data
        const request = {
            gas: 50000,
            gasPrice: '1000000000000000',
            caller: '0x6d95e6dca01d109882fe1726a2fb9865fa41e7aa',
            provedWork: '1000',
            gasPayer: '0xd3ae78222beadb038203be21ed5ce7c9b1bff602',
            expiration: 1000,
            blockRef: '0x00000000851caf3c',
            clauses: [
                {
                    to: '0x0000000000000000000000000000456E65726779',
                    value: '0x0',
                    data: '0xa9059cbb0000000000000000000000000f872421dc479f3c11edd89512731814d0598db50000000000000000000000000000000000000000000000013f306a2409fc0000'
                },
                {
                    to: '0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa',
                    value: '0x6124fee993bc00000',
                    data: '0x'
                },
                {
                    to: null,
                    value: '0x0',
                    data: '0x6080604052348015600f57600080fd5b50609f8061001e6000396000f300608060405260043610603f576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680631820cabb146044575b600080fd5b348015604f57600080fd5b506056606c565b6040518082815260200191505060405180910390f35b62015180815600a165627a7a723058200ac7475da248e2fc26c057319e296e90c24d5f8b9bf956fb3b77545642cad3b10029'
                }
            ]
        } satisfies ExecuteCodesRequestJSON;

        // Mock response data
        const mockResponse: ExecuteCodeResponseJSON[] = [
            {
                data: '0x0000000000000000000000000000000000000000000000000000000000000001',
                events: [
                    {
                        address: '0x0000000000000000000000000000456E65726779',
                        topics: [
                            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                            '0x0000000000000000000000006d95e6dca01d109882fe1726a2fb9865fa41e7aa',
                            '0x0000000000000000000000000f872421dc479f3c11edd89512731814d0598db5'
                        ],
                        data: '0x000000000000000000000000000000000000000000000000013f306a2409fc0000'
                    }
                ],
                transfers: [],
                gasUsed: 23809,
                reverted: false,
                vmError: ''
            },
            {
                data: '0x',
                events: [],
                transfers: [
                    {
                        sender: '0x6d95e6dca01d109882fe1726a2fb9865fa41e7aa',
                        recipient: '0xf077b491b355e64048ce21e3a6fc4751eeea77fa',
                        amount: '0x6124fee993bc00000'
                    }
                ],
                gasUsed: 0,
                reverted: false,
                vmError: ''
            },
            {
                data: '0x',
                events: [],
                transfers: [],
                gasUsed: 67533,
                reverted: false,
                vmError: ''
            }
        ];

        // Execute the test
        const response = await InspectClauses.of(request).askTo(
            mockHttpClient<ExecuteCodeResponseJSON[]>(mockResponse, 'post')
        );

        // Verify the response
        expect(response.response).toBeInstanceOf(Array);
        expect(response.response.length).toBe(mockResponse.length);
        expect(response.response[0].data.toString()).toBe(mockResponse[0].data);
        expect(response.response[0].events[0].address.toString()).toBe(
            mockResponse[0].events[0].address
        );
        expect(response.response[0].gasUsed.valueOf()).toBe(
            BigInt(mockResponse[0].gasUsed)
        );
        expect(response.response[0].reverted).toBe(mockResponse[0].reverted);
        expect(response.response[0].vmError).toBe(mockResponse[0].vmError);

        // Verify specific aspects of the response
        const outputs = response.response;

        // First clause (token transfer)
        expect(outputs[0].reverted).toBe(false);
        expect(outputs[0].gasUsed.valueOf()).toBe(BigInt(23809));
        expect(outputs[0].events).toHaveLength(1);
        expect(outputs[0].events[0].address.toString()).toBe(
            '0x0000000000000000000000000000456E65726779'
        );

        // Second clause (VET transfer)
        expect(outputs[1].reverted).toBe(false);
        expect(outputs[1].transfers).toHaveLength(1);
        const expectedAmount = HexUInt.of(outputs[1].transfers[0].amount).bi;
        expect(outputs[1].transfers[0].amount).toBe(expectedAmount);

        // Third clause (contract deployment)
        expect(outputs[2].reverted).toBe(false);
        expect(outputs[2].gasUsed.valueOf()).toBe(BigInt(67533));
        expect(outputs[2].events).toHaveLength(0);
        expect(outputs[2].transfers).toHaveLength(0);
    });

    test('should handle reverted transaction', async () => {
        // Mock request with invalid data that should cause reversion
        const request = {
            gas: 50000,
            gasPrice: '1000000000000000',
            caller: '0x6d95e6dca01d109882fe1726a2fb9865fa41e7aa',
            blockRef: '0x00000000851caf3c',
            clauses: [
                {
                    to: '0x0000000000000000000000000000456E65726779',
                    value: '0x0',
                    data: '0x1234'
                }
            ]
        } satisfies ExecuteCodesRequestJSON;

        // Mock response for reverted transaction
        const mockResponse: ExecuteCodeResponseJSON[] = [
            {
                data: '0x',
                events: [],
                transfers: [],
                gasUsed: 23809,
                reverted: true,
                vmError: 'invalid opcode 0x12'
            }
        ];

        // Execute the test
        const response = await InspectClauses.of(request).askTo(
            mockHttpClient<ExecuteCodeResponseJSON[]>(mockResponse, 'post')
        );

        // Verify the response
        const output = response.response[0];
        expect(output.reverted).toBe(true);
        expect(output.vmError).toBe('invalid opcode 0x12');
        expect(output.events).toHaveLength(0);
        expect(output.transfers).toHaveLength(0);
    });

    test('should handle empty clauses array', async () => {
        // Mock request with empty clauses
        const request = {
            gas: 50000,
            gasPrice: '1000000000000000',
            caller: '0x6d95e6dca01d109882fe1726a2fb9865fa41e7aa',
            blockRef: '0x00000000851caf3c',
            clauses: []
        } satisfies ExecuteCodesRequestJSON;

        // Execute the test
        const response = await InspectClauses.of(request).askTo(
            mockHttpClient<ExecuteCodeResponseJSON[]>([], 'post')
        );

        // Verify the response
        expect(response.response).toBeInstanceOf(Array);
        expect(response.response).toHaveLength(0);
    });

    test('should handle out of gas scenario', async () => {
        // Mock request with very low gas
        const request = {
            gas: 1, // Very low gas that should cause out of gas error
            gasPrice: '1000000000000000',
            caller: '0x6d95e6dca01d109882fe1726a2fb9865fa41e7aa',
            blockRef: '0x00000000851caf3c',
            clauses: [
                {
                    to: '0x0000000000000000000000000000456E65726779',
                    value: '0x0',
                    data: '0xa9059cbb0000000000000000000000000f872421dc479f3c11edd89512731814d0598db50000000000000000000000000000000000000000000000013f306a2409fc0000'
                }
            ]
        } satisfies ExecuteCodesRequestJSON;

        // Mock response for out of gas scenario
        const mockResponse: ExecuteCodeResponseJSON[] = [
            {
                data: '0x',
                events: [],
                transfers: [],
                gasUsed: 1,
                reverted: true,
                vmError: 'out of gas'
            }
        ];

        // Execute the test
        const response = await InspectClauses.of(request).askTo(
            mockHttpClient<ExecuteCodeResponseJSON[]>(mockResponse, 'post')
        );

        // Verify the response
        const output = response.response[0];
        expect(output.reverted).toBe(true);
        expect(output.vmError).toBe('out of gas');
        expect(output.gasUsed.valueOf()).toBe(BigInt(1));
    });
});
