import { FPN } from '../FPN';

enum Units {
    wei = 0,
    kwei = 3,
    mwei = 6,
    gwei = 9,
    szabo = 12,
    finney = 15,
    ether = 18
}

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace Units {
    /**
     * Converts a value in Wei to Ether and formats it as a string.
     *
     * @param {FPN} wei - The value in Wei to be converted to Ether.
     * @return {string} The formatted string representing the value in Ether.
     */
    export function formatEther(wei: FPN): string {
        return formatUnits(wei, Units.ether);
    }

    export function formatUnits(value: FPN, unit: Units = Units.ether): string {
        const fpn = value.div(FPN.of(10n ** BigInt(unit)));
        return fpn.isInteger() ? `${fpn}.0` : `${fpn}`;
    }

    export function parseUnits(exp: string, unit: Units = Units.ether): FPN {
        return FPN.of(exp).times(FPN.of(10n ** BigInt(unit)));
    }

    export function parseEther(exp: string): FPN {
        return parseUnits(exp, Units.ether);
    }
}

export { Units };
