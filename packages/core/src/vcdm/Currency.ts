import { type VeChainDataModel } from './VeChainDataModel';

export interface Currency extends VeChainDataModel<Currency> {
    get bi(): bigint;

    get code(): string;
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
