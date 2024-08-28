import { type VeChainDataModel } from './VeChainDataModel';

class ABI implements VeChainDataModel<ABI> {
    public readonly signature: string;
    public readonly parameters: string[];

    constructor(signature: string, parameters: string[]) {
        this.signature = signature;
        this.parameters = parameters;
    }

    public compareTo(that: ABI): number {
        return 0;
    }

    public isEqual(that: ABI): boolean {
        return false;
    }

    public get bi(): bigint {
        throw new Error('Method not implemented.');
    }

    public get bytes(): Uint8Array {
        throw new Error('Method not implemented.');
    }

    public get n(): number {
        throw new Error('Method not implemented.');
    }
}

export { ABI };
