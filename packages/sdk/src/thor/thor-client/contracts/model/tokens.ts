/**
 * Basic token types for VeChain
 */

/**
 * VET (VeChain Token) unit enumeration
 */
export enum VETUnits {
    wei = 'wei',
    kwei = 'kwei',
    mwei = 'mwei',
    gwei = 'gwei',
    szabo = 'szabo',
    finney = 'finney',
    ether = 'ether'
}

/**
 * VTHO (VeChain Thor Energy) unit enumeration
 */
export enum VTHOUnits {
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

/**
 * VET token value with unit
 */
export type VET = {
    value: bigint;
    unit: VETUnits;
};

/**
 * VTHO token value with unit
 */
export type VTHO = {
    value: bigint;
    unit: VTHOUnits;
};

/**
 * Create VET from value and unit
 */
export function createVET(
    value: bigint | number | string,
    unit: VETUnits = VETUnits.wei
): VET {
    return {
        value: typeof value === 'string' ? BigInt(value) : BigInt(value),
        unit
    };
}

/**
 * Create VTHO from value and unit
 */
export function createVTHO(
    value: bigint | number | string,
    unit: VTHOUnits = VTHOUnits.wei
): VTHO {
    return {
        value: typeof value === 'string' ? BigInt(value) : BigInt(value),
        unit
    };
}

/**
 * Convert VET to wei (smallest unit)
 */
export function vetToWei(vet: VET): bigint {
    if (vet.unit === VETUnits.wei) {
        return vet.value;
    }

    const multiplier = getVETMultiplier(vet.unit);
    return vet.value * BigInt(multiplier);
}

/**
 * Convert VTHO to wei (smallest unit)
 */
export function vthoToWei(vtho: VTHO): bigint {
    if (vtho.unit === VTHOUnits.wei) {
        return vtho.value;
    }

    const multiplier = getVTHOMultiplier(vtho.unit);
    return vtho.value * BigInt(multiplier);
}

/**
 * Get multiplier for VET unit conversion
 */
function getVETMultiplier(unit: VETUnits): string {
    switch (unit) {
        case VETUnits.wei:
            return '1';
        case VETUnits.kwei:
            return '1000';
        case VETUnits.mwei:
            return '1000000';
        case VETUnits.gwei:
            return '1000000000';
        case VETUnits.szabo:
            return '1000000000000';
        case VETUnits.finney:
            return '1000000000000000';
        case VETUnits.ether:
            return '1000000000000000000';
        default:
            return '1';
    }
}

/**
 * Get multiplier for VTHO unit conversion
 */
function getVTHOMultiplier(unit: VTHOUnits): string {
    switch (unit) {
        case VTHOUnits.wei:
            return '1';
        case VTHOUnits.kwei:
            return '1000';
        case VTHOUnits.mwei:
            return '1000000';
        case VTHOUnits.gwei:
            return '1000000000';
        case VTHOUnits.szabo:
            return '1000000000000';
        case VTHOUnits.finney:
            return '1000000000000000';
        case VTHOUnits.ether:
            return '1000000000000000000';
        case VTHOUnits.kether:
            return '1000000000000000000000';
        case VTHOUnits.mether:
            return '1000000000000000000000000';
        case VTHOUnits.gether:
            return '1000000000000000000000000000';
        case VTHOUnits.tether:
            return '1000000000000000000000000000000';
        default:
            return '1';
    }
}
