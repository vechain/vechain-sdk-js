import { HDKey } from '../../../src/hdkey/HDKey';

/**
 * Correct validation paths fixtures
 */
const correctValidationPaths: string[] = [
    HDKey.VET_DERIVATION_PATH,
    'm/0/1/2/3/4',
    "m/0'/1'/2'/3'/4'",
    "m/0'/1'/2'/3'/4",
    "m/0'/1'/2/3'/4'"
];

/**
 * Incorrect validation paths fixtures
 */
const incorrectValidationPaths: string[] = [
    'a',
    'm/0/b',
    'incorrect',
    'inco/rre/01/ct',
    '0/1/4/2/4/h'
];

export { correctValidationPaths, incorrectValidationPaths };
