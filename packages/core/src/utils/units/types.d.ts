/**
 * BigNumberish type
 * @typedef {string | number | bigint} BigNumberish
 */
type BigNumberish = string | number | bigint;

/**
 * The supported units of Ether currency which are supported by VechainThor too.
 *
 * wei - The smallest unit of currency. 1 wei is equal to 10^-18 VET.
 * kewi - 1 kewi is equal to 10^3 wei.
 * mwei - 1 mwei is equal to 10^6 wei.
 * gwei - 1 gwei is equal to 10^9 wei.
 * szabo - 1 szabo is equal to 10^12 wei.
 * finney - 1 finney is equal to 10^15 wei.
 * ether - 1 ether is equal to 10^18 wei.
 */
type WEI_UNITS =
    | 'wei'
    | 'kwei'
    | 'mwei'
    | 'gwei'
    | 'szabo'
    | 'finney'
    | 'ether';

export type { BigNumberish, WEI_UNITS };
