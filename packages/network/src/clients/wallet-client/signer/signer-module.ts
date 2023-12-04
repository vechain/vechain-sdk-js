import { type BuiltinSigner } from './types';

class SignerModule {
    public setSigner(signer: BuiltinSigner): string {
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
}
export { SignerModule };

function createVeWorld(): string {
    throw new Error('Function not implemented.');
}
function createSync2(): string {
    throw new Error('Function not implemented.');
}
