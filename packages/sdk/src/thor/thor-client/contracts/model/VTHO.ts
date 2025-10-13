import { VeChainDataModel } from '@common/vcdm';

/**
 * Represents VeChain's energy token (VTHO) with proper unit handling
 */
class VTHO implements VeChainDataModel<VTHO> {
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
        const paddedHex = hex.padStart(64, '0');
        return new Uint8Array(Buffer.from(paddedHex, 'hex'));
    }

    /**
     * Get the value as hex string
     */
    get hex(): string {
        return `0x${this._value.toString(16)}`;
    }

    /**
     * Get the value as string
     */
    get str(): string {
        return this._value.toString();
    }

    /**
     * Get the unit
     */
    get unit(): Units {
        return this._unit;
    }

    /**
     * Compare this VTHO with another VTHO
     */
    compareTo(that: VTHO): number {
        return this._value > that._value
            ? 1
            : this._value < that._value
              ? -1
              : 0;
    }

    /**
     * Check if this VTHO equals another VTHO
     */
    isEqual(that: VTHO): boolean {
        return this._value === that._value;
    }

    /**
     * Create VTHO from bigint
     */
    static of(value: bigint, unit: Units = Units.wei): VTHO {
        return new VTHO(value, unit);
    }

    /**
     * Create VTHO from number
     */
    static fromNumber(value: number, unit: Units = Units.wei): VTHO {
        return new VTHO(BigInt(value), unit);
    }

    /**
     * Create VTHO from string
     */
    static fromString(value: string, unit: Units = Units.wei): VTHO {
        return new VTHO(BigInt(value), unit);
    }

    /**
     * Create VTHO from hex string
     */
    static fromHex(value: string, unit: Units = Units.wei): VTHO {
        const cleanHex = value.startsWith('0x') ? value.slice(2) : value;
        return new VTHO(BigInt(`0x${cleanHex}`), unit);
    }

    /**
     * Convert to JSON
     */
    toJSON(): { value: string; unit: string } {
        return {
            value: this._value.toString(),
            unit: this._unit
        };
    }

    /**
     * Convert to string
     */
    toString(): string {
        return `${this._value} ${this._unit}`;
    }
}

/**
 * VTHO units
 */
enum Units {
    wei = 'wei',
    kwei = 'kwei',
    mwei = 'mwei',
    gwei = 'gwei',
    szabo = 'szabo',
    finney = 'finney',
    ether = 'ether',
    kether = 'kether',
    mether = 'mether',
    gether = 'gether',
    tether = 'tether'
}

export { VTHO, Units };
