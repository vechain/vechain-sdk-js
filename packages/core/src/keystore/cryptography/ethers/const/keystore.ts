/**
 * The [Scrypt](https://en.wikipedia.org/wiki/Scrypt) parameters
 * used in the keystore encryption.
 *
 * @property {number} N - The CPU/memory cost parameter = 2^17 = 131072.
 * @property {number} r - The block size parameter = 8.
 * @property {number} p - The parallelization parameter = 1.
 */
const SCRYPT_PARAMS = {
    N: 131072,
    r: 8,
    p: 1
};

export { SCRYPT_PARAMS };
