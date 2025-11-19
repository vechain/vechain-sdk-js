import { describe, expect, test, jest } from '@jest/globals';
import type { Abi } from 'abitype';
import { Revision } from '@vechain/sdk-core';
import {
    Contract,
    type ContractCallResult,
    type ContractsModule
} from '../../../src';

/**
 * Contract read options behavior.
 *
 * @group unit/clients/thor-client/contracts
 */

const simpleAbi = [
    {
        name: 'get',
        type: 'function',
        stateMutability: 'view',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'uint256'
            }
        ]
    }
] as const satisfies Abi;

type SimpleAbi = typeof simpleAbi;

function createMockedContract() {
    const executeCall = jest.fn<ContractsModule['executeCall']>();

    executeCall.mockResolvedValue({
        success: true,
        result: {
            array: [123n]
        }
    } satisfies ContractCallResult);

    const contractsModule = {
        executeCall
    } as unknown as ContractsModule;

    return {
        contract: new Contract<SimpleAbi>(
            '0x0000000000000000000000000000000000000000',
            simpleAbi,
            contractsModule
        ),
        executeCall
    };
}

describe('Contract read options', () => {
    test('uses revision configured via setContractReadOptions when no clause override is provided', async () => {
        const { contract, executeCall } = createMockedContract();

        contract.setContractReadOptions({ revision: Revision.of('0x1234') });

        await contract.read.get();

        expect(executeCall).toHaveBeenCalledTimes(1);
        expect(
            executeCall.mock.calls[0][3]?.revision?.toString()
        ).toBe('0x1234');
    });

    test('clause-level revision overrides contract-level revision without clearing it', async () => {
        const { contract, executeCall } = createMockedContract();

        contract.setContractReadOptions({ revision: Revision.of('0xaaaa') });

        await contract.read.get({ revision: '0xbbbb' });
        await contract.read.get();

        expect(executeCall).toHaveBeenCalledTimes(2);
        expect(
            executeCall.mock.calls[0][3]?.revision?.toString()
        ).toBe('0xbbbb');
        expect(
            executeCall.mock.calls[1][3]?.revision?.toString()
        ).toBe('0xaaaa');
    });
});

