import {
    type AvailableVeChainProviders,
    type TransactionRequestInput,
    VeChainAbstractSigner
} from '@vechain/sdk-network';
import { type TypedDataDomain, type TypedDataParameter } from 'abitype';

class KMSVeChainSigner extends VeChainAbstractSigner {
    connect(_provider?: AvailableVeChainProviders): this {
        throw new Error('Method not implemented.');
    }
    async getAddress(): Promise<string> {
        throw new Error('Method not implemented.');
    }
    async signTransaction(
        transactionToSign: TransactionRequestInput
    ): Promise<string> {
        throw new Error('Method not implemented.');
    }
    async sendTransaction(
        transactionToSend: TransactionRequestInput
    ): Promise<string> {
        throw new Error('Method not implemented.');
    }
    async signMessage(message: string | Uint8Array): Promise<string> {
        throw new Error('Method not implemented.');
    }
    async signTypedData(
        domain: TypedDataDomain,
        types: Record<string, TypedDataParameter[]>,
        value: Record<string, unknown>
    ): Promise<string> {
        throw new Error('Method not implemented.');
    }
}

export { KMSVeChainSigner };
