import { type BuiltinSigner } from './types';

class SignerModule {
    public connect(signer: BuiltinSigner): string {
        switch (signer) {
            case 'veworld':
                if (window.vechain != null) {
                    throw new Error('veworld not found');
                }
                return createVeWorld();
            case 'sync2':
                return createSync2();
            default:
                throw new Error(`Unknown signer: ${signer as string}`);
        }
    }

    public async disconnect(): Promise<void> {}

    public async signTransaction(): Promise<void> {}

    public async signCertificate(): Promise<void> {}
}
export { SignerModule };

function createVeWorld(): string {
    throw new Error('Function not implemented.');
}
function createSync2(): string {
    throw new Error('Function not implemented.');
}
