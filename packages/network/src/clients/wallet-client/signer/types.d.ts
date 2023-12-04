declare global {
    interface Window {
        vechain?: string;
    }
}

type BuiltinSigner = 'veworld' | 'sync2';

interface Options {
    node: string;
    network?: string;
    signer?: BuiltinSigner;
}

export type { BuiltinSigner, Options };
