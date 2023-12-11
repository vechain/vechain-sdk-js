import { SignerModule } from './signer';
import { type WalletOptions } from './signer/types';

class WalletClient {
    public readonly signer: SignerModule;

    constructor(protected readonly options: WalletOptions) {
        this.signer = new SignerModule(options);
    }
}

export { WalletClient };
