import { type ThorClient } from '@vechain/sdk-network';
import {
    type ExtendedClause,
    type SendTxOptions,
    type SendTxResponse,
    type WalletInterface,
    type CertificateRequest,
    type CertificateOptions,
    type CertificateResponse
} from '../wallets/types.d';

class Signer {
    private readonly wallets: Record<string, WalletInterface | undefined> = {};
    private selectedWallet: string | null = null;

    constructor(private readonly thor: ThorClient) {}

    private get selected(): WalletInterface {
        const selected = this.selectedWallet;

        if (selected === null) {
            throw new Error('No wallet selected');
        }

        const wallet = this.wallets[selected];

        if (wallet === undefined) {
            throw new Error('Wallet not found');
        }

        return wallet;
    }

    public addWallet(id: string, wallet: WalletInterface): void {
        this.wallets[id] = wallet;
    }

    public selectWallet(id: string): void {
        if (this.wallets[id] !== undefined) {
            this.selectedWallet = id;
        } else {
            throw new Error(`Wallet with id ${id} not found`);
        }
    }

    public removeWallet(id: string): void {
        if (this.wallets[id] !== undefined) {
            this.wallets[id] = undefined;
        } else {
            throw new Error(`Wallet with id ${id} not found`);
        }
    }

    public async sendTransaction(
        clauses: ExtendedClause[],
        options?: SendTxOptions
    ): Promise<SendTxResponse> {
        return await this.selected.sendTransaction(clauses, options);
    }

    public async signCertificate(
        request: CertificateRequest,
        options?: CertificateOptions
    ): Promise<CertificateResponse> {
        return await this.selected.signCertificate(request, options);
    }
}

export { Signer };
