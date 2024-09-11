import { FPN } from '../FPN';
import { Wei } from './Wei';

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
    export function formatUnits(fpn: FPN, unit: Units): string {
        return fpn.dp(BigInt(unit)).toString();
    }

    export function parseUnits(exp: string, unit: Units): Wei {
        const decimalPlaces = BigInt(unit);
        const scaleFactor = FPN.of(10n ** decimalPlaces, 0n);
        const value = FPN.of(exp, decimalPlaces);
        return Wei.of(value.times(scaleFactor).bi);
    }

    export function parseVET(exp: string): Wei {
        return parseUnits(exp, Units.ether);
    }
}
//
export { Units };
