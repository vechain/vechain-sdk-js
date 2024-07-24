import { type InterfaceAbi } from '@vechain/sdk-core';
import { type Abi } from 'abitype';
import { type ThorClient } from '../../thor-client';
import { type VeChainSigner } from '../../../signer';
import { type TransactionReceipt } from '../../transactions';
import { Contract } from './contract';

/**
 * Converts an ABI to an interface ABI.
 * @param abi - The ABI to convert.
 * @returns The interface ABI.
 */
function convertAbiToInterfaceAbi<T extends Abi>(abi: T): InterfaceAbi {
    // This function doesn't actually convert anything at runtime
    // It's just for type assertions
    return abi as unknown as InterfaceAbi;
}

/**
 * Creates a typed contract instance.
 * @param address - The address of the contract.
 * @param abi - The ABI of the contract.
 * @param thor - The ThorClient instance.
 * @param signer - The VeChainSigner instance.
 * @param transactionReceipt - The transaction receipt.
 * @returns The typed contract instance.
 */
function createTypedContract<T extends Abi>(
    address: string,
    abi: T,
    thor: ThorClient,
    signer?: VeChainSigner,
    transactionReceipt?: TransactionReceipt
): Contract<T & InterfaceAbi> {
    const interfaceAbi = convertAbiToInterfaceAbi(abi);
    return new Contract(
        address,
        interfaceAbi,
        thor,
        signer,
        transactionReceipt
    );
}

export { createTypedContract };
