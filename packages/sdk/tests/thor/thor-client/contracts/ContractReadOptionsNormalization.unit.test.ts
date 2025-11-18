/* eslint-disable */
import { describe, expect, test, jest } from '@jest/globals';
import {
    Contract
} from '../../../../src/thor/thor-client/contracts';
import { ThorClient } from '../../../../src/thor/thor-client/ThorClient';
import { Address, Revision } from '../../../../src/common/vcdm';
import { IllegalArgumentError } from '../../../../src/common/errors';

const contractAddress = Address.of(
    '0x0000000000000000000000000000000000000000'
);

const minimalAbi = [
    {
        type: 'function',
        name: 'dummy',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ name: '', type: 'uint256' }]
    }
] as const;

const createMockHttpClient = () =>
    ({
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        options: {},
        baseURL: 'http://localhost:8669'
    }) as any;

const createContract = () => {
    const thorClient = ThorClient.fromHttpClient(createMockHttpClient() as any);
    return new Contract(contractAddress, minimalAbi, thorClient.contracts);
};

describe('Contract.setContractReadOptions revision normalization', () => {
    test('accepts Revision objects', () => {
        const contract = createContract();
        contract.setContractReadOptions({ revision: Revision.BEST });

        const options = contract.getContractReadOptions();
        expect(options.revision).toBeInstanceOf(Revision);
        expect(options.revision?.toString()).toBe('best');
    });

    test('accepts plain number revisions', () => {
        const contract = createContract();
        contract.setContractReadOptions({ revision: 1000000 });

        const options = contract.getContractReadOptions();
        expect(options.revision).toBeInstanceOf(Revision);
        expect(options.revision?.toString()).toBe('1000000');
    });

    test('accepts numeric strings as block numbers', () => {
        const contract = createContract();
        contract.setContractReadOptions({ revision: '123456' });

        const options = contract.getContractReadOptions();
        expect(options.revision).toBeInstanceOf(Revision);
        expect(options.revision?.toString()).toBe('123456');
    });

    test('accepts label strings regardless of casing', () => {
        const contract = createContract();
        contract.setContractReadOptions({ revision: 'FINALIZED' });

        const options = contract.getContractReadOptions();
        expect(options.revision).toBeInstanceOf(Revision);
        expect(options.revision?.toString()).toBe('finalized');
    });

    test('accepts block id strings', () => {
        const contract = createContract();
        contract.setContractReadOptions({
            revision: '0x0123456789abcdef'
        });

        const options = contract.getContractReadOptions();
        expect(options.revision).toBeInstanceOf(Revision);
        expect(options.revision?.toString()).toBe(
            '0x0123456789abcdef'
        );
    });

    test('rejects empty revision strings', () => {
        const contract = createContract();

        expect(() =>
            contract.setContractReadOptions({ revision: '' })
        ).toThrow(IllegalArgumentError);
    });
});

