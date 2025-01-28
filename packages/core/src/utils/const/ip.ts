export const IP_CONSTANTS = {
    IPV4_LENGTH: 4,
    IPV6_LENGTH: 16,
    MAX_PORT: 65535,
    IPV6_SEGMENTS: 8
} as const;

export const IP_REGEX = {
    IPV4_PORT: /^(?:\d{1,3}\.){3}\d{1,3}:\d{1,5}$/,
    IPV6_PORT: /^\[(([0-9a-fA-F]{0,4}:){1,7}[0-9a-fA-F]{0,4})\]:(\d{1,5})$/,
    IPV6_WITH_PORT: /^\[(.*)\]:(\d+)$/,
    HEX_SEGMENT: /^[0-9a-fA-F]{1,4}$/
} as const;
