import { TRANSACTION_HEAD_LENGTH, TRANSACTION_ID_LENGTH } from '../const';
import { dataUtils } from './data';

/**
 * Checks whether the provided data is a valid transaction ID.
 *
 * @remarks
 * The check can optionally validate the presence of a '0x' prefix.
 *
 * @param data - The string data to check.
 * @param checkPrefix - A boolean determining whether to validate the '0x' prefix (default: false).
 * @returns A boolean indicating whether the input is a valid hexadecimal string.
 */
const isTransactionId = (
    data: string,
    checkPrefix: boolean = true
): boolean => {
    return (
        dataUtils.isHexString(data, checkPrefix) &&
        (checkPrefix
            ? data.length === TRANSACTION_ID_LENGTH + 2 // +2 for '0x'
            : data.length === TRANSACTION_ID_LENGTH)
    );
};

/**
 * Checks whether the provided data is a valid transaction Head.
 *
 * @remarks
 * The check can optionally validate the presence of a '0x' prefix.
 *
 * @param data - The string data to check.
 * @param checkPrefix - A boolean determining whether to validate the '0x' prefix (default: false).
 * @returns A boolean indicating whether the input is a valid hexadecimal string.
 */
const isTransactionHead = (
    data: string,
    checkPrefix: boolean = true
): boolean => {
    return (
        dataUtils.isHexString(data, checkPrefix) &&
        (checkPrefix
            ? data.length === TRANSACTION_HEAD_LENGTH + 2 // +2 for '0x'
            : data.length === TRANSACTION_HEAD_LENGTH)
    );
};

const transactionDataUtils = { isTransactionId, isTransactionHead };
export { transactionDataUtils };
