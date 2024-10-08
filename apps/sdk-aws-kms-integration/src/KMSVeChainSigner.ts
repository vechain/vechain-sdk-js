import {
    type AvailableVeChainProviders,
    type TransactionRequestInput,
    VeChainAbstractSigner
} from '@vechain/sdk-network';
import { type TypedDataDomain, type TypedDataParameter } from 'abitype';
import { type KMSVeChainProvider } from './KMSVeChainProvider';

class KMSVeChainSigner extends VeChainAbstractSigner {
    private readonly kmsVeChainProvider: KMSVeChainProvider;

    public constructor(provider?: AvailableVeChainProviders) {
        super(provider);
        this.kmsVeChainProvider = this.provider as KMSVeChainProvider;
    }

    connect(provider: AvailableVeChainProviders): this {
        return new KMSVeChainSigner(provider) as this;
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
