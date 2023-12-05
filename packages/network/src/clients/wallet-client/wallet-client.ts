import { SignerModule } from './signer';
import { type Options } from './signer/types';

class WalletClient {
    public readonly signer: SignerModule;

    constructor(protected readonly options: Options) {
        this.signer = new SignerModule(options);
    }
}

export { WalletClient };
