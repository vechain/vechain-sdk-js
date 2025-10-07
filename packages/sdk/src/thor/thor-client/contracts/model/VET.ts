import { VeChainDataModel } from '@common/vcdm';

/**
 * Represents VeChain's native token (VET) with proper unit handling
 */
class VET implements VeChainDataModel<VET> {
    private readonly _value: bigint;
    private readonly _unit: Units;

    constructor(value: bigint, unit: Units = Units.wei) {
        this._value = value;
        this._unit = unit;
    }

    /**
     * Get the value as bigint
     */
    get bi(): bigint {
        return this._value;
    }

    /**
     * Get the value as number (may lose precision for large values)
     */
    get n(): number {
        return Number(this._value);
    }

    /**
     * Get the value as bytes
     */
    get bytes(): Uint8Array {
        const hex = this._value.toString(16);
        const padded = hex.padStart(64, '0');
        const bytes = new Uint8Array(32);
        for (let i = 0; i < 32; i++) {
            bytes[i] = parseInt(padded.substr(i * 2, 2), 16);
        }
        return bytes;
    }

    /**
     * Compare with another VET instance
     */
    compareTo(that: VET): number {
        const thisWei = this.toWei();
        const thatWei = that.toWei();
        if (thisWei < thatWei) return -1;
        if (thisWei > thatWei) return 1;
        return 0;
    }

    /**
     * Check if equal to another VET instance
     */
    isEqual(that: VET): boolean {
        return this.toWei() === that.toWei();
    }

    /**
     * Convert to wei (smallest unit)
     */
    toWei(): bigint {
        if (this._unit === Units.wei) {
            return this._value;
        }
        // Convert from other units to wei
        const multiplier = this.getMultiplier(this._unit);
        return this._value * BigInt(multiplier);
    }

    /**
     * Create VET instance from value and unit
     */
    static of(value: bigint | number | string, unit: Units = Units.wei): VET {
        const bigintValue =
            typeof value === 'string' ? BigInt(value) : BigInt(value);
        return new VET(bigintValue, unit);
    }

    /**
     * Get multiplier for unit conversion
     */
    private getMultiplier(unit: Units): string {
        switch (unit) {
            case Units.wei:
                return '1';
            case Units.kwei:
                return '1000';
            case Units.mwei:
                return '1000000';
            case Units.gwei:
                return '1000000000';
            case Units.szabo:
                return '1000000000000';
            case Units.finney:
                return '1000000000000000';
            case Units.ether:
                return '1000000000000000000';
            default:
                return '1';
        }
    }

    /**
     * Convert to string representation
     */
    toString(): string {
        return `${this._value.toString()} ${this._unit}`;
    }
}

/**
 * VET unit enumeration
 */
enum Units {
    wei = 'wei',
    kwei = 'kwei',
    mwei = 'mwei',
    gwei = 'gwei',
    szabo = 'szabo',
    finney = 'finney',
    ether = 'ether'
}

export { VET, Units };
