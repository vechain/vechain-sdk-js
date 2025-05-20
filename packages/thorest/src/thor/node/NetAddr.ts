import { IllegalArgumentError } from '@vechain/sdk-core'

/**
 * Expands an abbreviated IPv6 address by converting :: notation to the appropriate number of zero segments
 * @param {string} ipv6 - The IPv6 address to expand (which may include :: notation and port)
 * @returns {string} The fully expanded IPv6 address (with port if present)
 */
function expandIPv6(ipv6: string): string {
    // Handle the case where the IPv6 address has a port
    const portMatch = ipv6.match(/^\[(.*)\]:(\d+)$/);
    if (portMatch) {
        return `[${expandIPv6Internal(portMatch[1])}]:${portMatch[2]}`;
    }

    return expandIPv6Internal(ipv6);
}

/**
 * Internal helper to expand IPv6 address without port consideration
 */
function expandIPv6Internal(ipv6: string): string {
    if (!ipv6.includes('::')) {
        return ipv6;
    }

    const parts = ipv6.split('::');
    const start = parts[0] ? parts[0].split(':') : [];
    const end = parts[1] ? parts[1].split(':') : [];

    // Calculate how many zero segments need to be inserted
    const missing = 8 - start.length - end.length;

    // Create the zero segments
    const zeros = Array(missing).fill('0000');

    // Join everything back together
    return [...start, ...zeros, ...end].join(':');
}

/**
 * Represents a network address with an IP address and port.
 */
class NetAddr {
    static readonly IP_CONSTANTS = {
        IPV4_LENGTH: 4,
        IPV6_LENGTH: 16,
        MAX_PORT: 65535,
        IPV6_SEGMENTS: 8
    } as const;

    static readonly IP_REGEX = {
        IPV4_PORT: /^(?:\d{1,3}\.){3}\d{1,3}:\d{1,5}$/,
        IPV6_PORT: /^\[(([0-9a-fA-F]{0,4}:){1,7}[0-9a-fA-F]{0,4})\]:(\d{1,5})$/,
        IPV6_WITH_PORT: /^\[(.*)\]:(\d+)$/,
        HEX_SEGMENT: /^[0-9a-fA-F]{1,4}$/
    } as const;

    /**
     * The IP address as a fixed-length Uint8Array.
     * IPv4: 4 bytes
     * IPv6: 16 bytes
     */
    private readonly ipAddress: Uint8Array;

    /**
     * The port of the network address.
     */
    private readonly port: number;

    /**
     * Creates a new instance of the NetAddr class.
     */
    protected constructor(value: string) {
        if (NetAddr.IP_REGEX.IPV4_PORT.test(value)) {
            [this.ipAddress, this.port] = this.initializeIPv4(value);
        } else {
            [this.ipAddress, this.port] = this.initializeIPv6(value);
        }
    }

    private initializeIPv4(value: string): [Uint8Array, number] {
        const [ip, port] = value.split(':');
        const ipParts = ip.split('.').map(Number);

        if (ipParts.some((part) => part > 255) || Number(port) > 65535) {
            throw new IllegalArgumentError(
                'NetAddr.initializeIPv4(value: string): [Uint8Array, number]',
                'not a valid network address (IP:port) expression',
                { value }
            );
        }

        const ipAddress = new Uint8Array(NetAddr.IP_CONSTANTS.IPV4_LENGTH);
        ipParts.forEach((octet, index) => (ipAddress[index] = octet));
        return [ipAddress, Number(port)];
    }

    private initializeIPv6(value: string): [Uint8Array, number] {
        const expandedIP = value.includes('::') ? expandIPv6(value) : value;
        const match = NetAddr.IP_REGEX.IPV6_PORT.exec(expandedIP);

        if (match === null) {
            throw new IllegalArgumentError(
                'NetAddr.initializeIPv6(value: string): [Uint8Array, number]',
                'Invalid IPv6 address format',
                { value }
            );
        }

        if (Number(match[3]) > NetAddr.IP_CONSTANTS.MAX_PORT) {
            throw new IllegalArgumentError(
                'NetAddr.initializeIPv6(value: string): [Uint8Array, number]',
                'Port number out of range',
                { value }
            );
        }
        return [NetAddr.parseUncompressedIPv6(match[1]), Number(match[3])];
    }

    /**
     * Converts NetAddr into a byte array representation.
     * For IPv4: 6 bytes (4 for IP, 2 for port)
     * For IPv6: 18 bytes (16 for IP, 2 for port)
     *
     * @return {Uint8Array} the byte array representation of the network address.
     */
    get bytes(): Uint8Array {
        const ipLength = this.ipAddress.length;
        const result = new Uint8Array(ipLength + 2);

        result.set(this.ipAddress);

        result[ipLength] = (this.port >> 8) & 0xff;
        result[ipLength + 1] = this.port & 0xff;

        return result;
    }

    /**
     * Creates a new NetAddr object from the provided network address (IP:port) expression string.
     *
     * @param {string} exp - The string representing a network address in the format 'IP:port'.
     * @return {NetAddr} A new instance of NetAddr created from the provided expression.
     * @throws {IllegalArgumentError} If the provided expression is not a valid network address.
     */
    static of(exp: string): NetAddr {
        try {
            return new NetAddr(exp);
        } catch (error) {
            throw new IllegalArgumentError(
                'NetAddr.of(exp: string): NetAddr',
                'not a valid network address (IP:port) expression',
                { exp },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Returns a string representation of the network address with IPv6 compression.
     */
    toString(): string {
        if (this.ipAddress.length === NetAddr.IP_CONSTANTS.IPV6_LENGTH) {
            return this.formatIPv6Address();
        }
        return this.formatIPv4Address();
    }

    /**
     * Formats an IPv4 address as a string.
     */
    private formatIPv4Address(): string {
        const ipv4Parts = Array.from(this.ipAddress)
            .map((byte) => byte.toString())
            .join('.');
        return `${ipv4Parts}:${this.port}`;
    }

    /**
     * Formats an IPv6 address as a string with compression.
     */
    private formatIPv6Address(): string {
        const segments = [];
        for (let i = 0; i < 16; i += 2) {
            const value = (this.ipAddress[i] << 8) | this.ipAddress[i + 1];
            segments.push(value.toString(16));
        }

        // Perform compression by finding the longest run of zeros
        let longestRunStart = -1;
        let longestRunLength = 0;
        let currentRunStart = -1;
        let currentRunLength = 0;

        for (let i = 0; i < segments.length; i++) {
            if (segments[i] === '0') {
                if (currentRunStart === -1) {
                    currentRunStart = i;
                }
                currentRunLength++;
            } else if (currentRunStart !== -1) {
                if (currentRunLength > longestRunLength) {
                    longestRunStart = currentRunStart;
                    longestRunLength = currentRunLength;
                }
                currentRunStart = -1;
                currentRunLength = 0;
            }
        }

        // Check if the last run is the longest
        if (currentRunStart !== -1 && currentRunLength > longestRunLength) {
            longestRunStart = currentRunStart;
            longestRunLength = currentRunLength;
        }

        // Compress if we have a run of at least 2 zeros
        let result = '';
        if (longestRunLength >= 2) {
            for (let i = 0; i < segments.length; i++) {
                if (i === longestRunStart) {
                    result += ':';
                    i += longestRunLength - 1;
                } else {
                    result += segments[i];
                    if (i < segments.length - 1 && i + 1 !== longestRunStart) {
                        result += ':';
                    }
                }
            }
            if (longestRunStart + longestRunLength === segments.length) {
                result += ':';
            }
        } else {
            result = segments.join(':');
        }

        return `[${result}]:${this.port}`;
    }

    /**
     * Determines whether this NetAddr instance is equal to the given NetAddr instance.
     */
    isEqual(that: NetAddr): boolean {
        if (this.ipAddress.length !== that.ipAddress.length) {
            return false;
        }

        for (let i = 0; i < this.ipAddress.length; i++) {
            if (this.ipAddress[i] !== that.ipAddress[i]) {
                return false;
            }
        }

        return this.port === that.port;
    }

    private static parseUncompressedIPv6(address: string): Uint8Array {
        const segments = address.split(':');

        if (segments.length !== 8) {
            throw new IllegalArgumentError(
                'NetAddr.parseUncompressedIPv6(address: string): Uint8Array',
                'Invalid IPv6 address: must have exactly 8 segments',
                { address }
            );
        }
        const bytes = new Uint8Array(16);

        try {
            for (let i = 0; i < 8; i++) {
                const segment = segments[i];
                const value = parseInt(segment, 16);

                bytes[i * 2] = (value >> 8) & 0xff; // High byte
                bytes[i * 2 + 1] = value & 0xff; // Low byte
            }
        } catch (error) {
            throw new IllegalArgumentError(
                'NetAddr.parseUncompressedIPv6(address: string): Uint8Array',
                'Invalid IPv6 address format',
                { address }
            );
        }

        return bytes;
    }
}

export { NetAddr };
