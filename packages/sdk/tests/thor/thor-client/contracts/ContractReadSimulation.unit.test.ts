/* eslint-disable */
// @ts-nocheck
import { describe, expect, test, jest } from '@jest/globals';
import { Contract } from '../../../../src/thor/thor-client/contracts';
import { Address } from '../../../../src/common/vcdm';

const contractAddress = Address.of(
    '0x0000000000000000000000000000000000000001'
);

const erc20Abi = [
    {
        type: 'function',
        name: 'name',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ name: '', type: 'string' }]
    },
    {
        type: 'function',
        name: 'transfer',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'to', type: 'address' },
            { name: 'amount', type: 'uint256' }
        ],
        outputs: [{ name: '', type: 'bool' }]
    },
    {
        type: 'function',
        name: 'deposit',
        stateMutability: 'payable',
        inputs: [],
        outputs: []
    }
] as const;

function createContract(executeCallResult?: any) {
    const contractsModule = {
        executeCall: jest.fn().mockResolvedValue(
            executeCallResult ?? {
                success: true,
                result: {
                    array: [true]
                }
            }
        ),
        executeTransaction: jest.fn()
    };

    const contract = new Contract(
        contractAddress,
        erc20Abi,
        contractsModule as any
    );

    return { contract, contractsModule };
}

/**
 * @group unit/contracts
 */
describe('Contract read simulations for state-changing functions', () => {
    test('exposes nonpayable and payable functions on read interface', () => {
        const { contract } = createContract();
        expect(typeof (contract.read as any).transfer).toBe('function');
        expect(typeof (contract.read as any).deposit).toBe('function');
    });

    test('executes nonpayable function via simulated call', async () => {
        const { contract, contractsModule } = createContract();
        const recipient = Address.of(
            '0x0000000000000000000000000000000000000002'
        );
        const amount = 1n;

        const result = await (contract.read as any).transfer(recipient, amount);

        expect(result).toBe(true);
        expect(contractsModule.executeCall).toHaveBeenCalledTimes(1);
        expect(contractsModule.executeCall).toHaveBeenCalledWith(
            contractAddress,
            expect.objectContaining({ name: 'transfer' }),
            [recipient, amount],
            expect.any(Object)
        );
    });

    test('passes inline value option through to executeCall for payable functions', async () => {
        const { contract, contractsModule } = createContract({
            success: true,
            result: { array: [] }
        });

        await (contract.read as any).deposit({ value: 5n });

        expect(contractsModule.executeCall).toHaveBeenCalledTimes(1);
        expect(
            (contractsModule.executeCall as jest.Mock).mock.calls[0][3].value
        ).toBe(5n);
    });
});

