import { type VCDM } from '../../src/vcdm/VCDM';

class InvalidVCDM extends String implements VCDM<string> {
    get bi(): bigint {
        throw new Error('Method not implemented.');
    }

    get bytes(): Uint8Array {
        throw new Error('Method not implemented.');
    }

    get n(): number {
        throw new Error('Method not implemented.');
    }

    compareTo(_: string): number {
        throw new Error('Method not implemented.');
    }

    isEqual(_: string): boolean {
        throw new Error('Method not implemented.');
    }
}

export { InvalidVCDM };
