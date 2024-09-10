import { type VeChainDataModel } from '../VeChainDataModel';
import { type FPN } from '../FPN';

export interface Currency extends VeChainDataModel<Currency> {
    get code(): string;

    get value(): FPN;
}

// class Wei<Digits> implements Currency<Digits.wei> {
// }

// eslint-disable-next-line @typescript-eslint/no-unused-vars
enum Digits {
    wei,
    kwei = 3,
    mwei = 6,
    gwei = 9,
    szabo = 12,
    finney = 15,
    ether = 18
}
