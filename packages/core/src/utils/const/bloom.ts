/**
 * Regular expression for validating in hexadecimal strings uppercase.
 */
const BLOOM_REGEX_UPPERCASE = /^(0x)?[0-9A-F]{16,}$/;

/**
 * Regular expression for validating in hexadecimal strings lowercase.
 */
const BLOOM_REGEX_LOWERCASE = /^(0x)?[0-9a-f]{16,}$/;

export { BLOOM_REGEX_UPPERCASE, BLOOM_REGEX_LOWERCASE };
