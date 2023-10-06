/**
 *  A string which is optionally prefixed with ``0x`` and followed by any number
 *  of case-agnostic hexadecimal characters.
 *
 *  It must match the regular expression ``/(0x)?[0-9A-Fa-f]*\/``.
 */
type HexString = string;

export type { HexString };
