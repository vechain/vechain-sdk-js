import { InvalidDataType, InvalidOperation } from '@vechain/sdk-errors';
import { type VeChainDataModel } from './VeChainDataModel';

const IPV4_LENGTH = 4;
const IPV6_LENGTH = 16;

/**
 * Represents a network address with an IP address and port.
 */
class NetAddr implements VeChainDataModel<NetAddr> {
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
        const ipv4PortRegex = /^(?:\d{1,3}\.){3}\d{1,3}:\d{1,5}$/;
        const ipv6UncompressedPortRegex =
            /^\[(([0-9a-fA-F]{0,4}:){1,7}[0-9a-fA-F]{0,4})\]:(\d{1,5})$/;
        let newExp = value;

        if (ipv4PortRegex.test(value)) {
            // IPv4 validation
            const [ip, port] = value.split(':');
            const ipParts = ip.split('.').map(Number);
            const portNumber = Number(port);

            if (ipParts.some((part) => part > 255) || portNumber > 65535) {
                throw new InvalidDataType(
                    'NetAddr.of',
                    'not a valid network address (IP:port) expression',
                    { value }
                );
            }
            this.ipAddress = new Uint8Array(IPV4_LENGTH);
            ip.split('.').forEach((octet, index) => {
                this.ipAddress[index] = Number(octet);
            });
            this.port = Number(port);
        } else {
            if (value.includes('::')) {
                try {
                    newExp = expandIPv6(value);
                } catch (error) {
                    throw new InvalidDataType(
                        'NetAddr.of',
                        'invalid IP address',
                        { value }
                    );
                }
            }

            const ipv6Match = ipv6UncompressedPortRegex.exec(newExp);
            if (ipv6Match === null) {
                throw new InvalidDataType(
                    'NetAddr.of',
                    'not a valid network address (IP:port) expression',
                    { newExp }
                );
            }

            // ipv6Match[1] contains the IP address, ipv6Match[3] contains the port
            this.ipAddress = NetAddr.parseUncompressedIPv6(ipv6Match[1]);
            this.port = Number(ipv6Match[3]);

            if (isNaN(this.port) || this.port > 65535) {
                throw new InvalidDataType(
                    'NetAddr.of',
                    'port number out of range',
                    { value }
                );
            }
        }
    }

    /**
     * Converts NetAddr into a byte array representation.
     * For IPv4: 6 bytes (4 for IP, 2 for port)
     * For IPv6: 18 bytes (16 for IP, 2 for port)
     */
    get bytes(): Uint8Array {
        const ipLength = this.ipAddress.length;
        const result = new Uint8Array(ipLength + 2);

        // Copy IP address bytes
        result.set(this.ipAddress, 0);

        // Add port bytes
        result[ipLength] = (this.port >> 8) & 0xff;
        result[ipLength + 1] = this.port & 0xff;

        return result;
    }

    /**
     * Returns the value of n.
     *
     * @return {number} The value of n.
     *
     * @throws {InvalidOperation<NetAddr>} Systematically throws an error because there is no number representation for NetAddr.
     */
    get n(): number {
        throw new InvalidOperation(
            'NetAddr.n',
            'There is no number representation for NetAdrr',
            {
                hex: this.toString()
            }
        );
    }

    /**
     * Creates a new instance of the NetAddr class from a string expression.
     */
    static of(exp: string): NetAddr {
        return new NetAddr(exp);
    }

    /**
     * Parse IPv6 address string into Uint8Array
     */
    private static parseUncompressedIPv6(address: string): Uint8Array {
        // Split into 16-bit segments
        const segments = address.split(':');

        // Verify we have exactly 8 segments
        if (segments.length !== 8) {
            throw new InvalidDataType(
                'NetAddr.parseUncompressedIPv6',
                'Invalid IPv6 address: must have exactly 8 segments',
                { address }
            );
        }

        // Create result array (16 bytes for IPv6)
        const bytes = new Uint8Array(16);

        try {
            // Process each segment
            for (let i = 0; i < 8; i++) {
                const segment = segments[i];

                // Parse segment as 16-bit number
                const value = parseInt(segment, 16);

                if (isNaN(value) || value < 0 || value > 0xffff) {
                    throw new InvalidDataType(
                        'NetAddr.parseUncompressedIPv6',
                        'Invalid IPv6 segment value',
                        { segment }
                    );
                }

                // Store as two bytes
                bytes[i * 2] = (value >> 8) & 0xff; // High byte
                bytes[i * 2 + 1] = value & 0xff; // Low byte
            }
        } catch (error) {
            if (error instanceof InvalidDataType) {
                throw error;
            }
            throw new InvalidDataType(
                'NetAddr.parseUncompressedIPv6',
                'Invalid IPv6 address format',
                { address }
            );
        }

        return bytes;
    }

    /**
     * Returns the value of bi.
     *
     * @return {number} The value of n.
     *
     * @throws {InvalidOperation<NetAddr>} systematically throws an error because there is no big integer representation for NetAddr.
     */
    get bi(): bigint {
        throw new InvalidOperation(
            'NetAddr.bi',
            'There is no big integer representation for NetAddr',
            {
                hex: this.toString()
            }
        );
    }

    /**
     * Throws an error because there is no comparison between network addresses.
     *
     * @throws {InvalidOperation<NetAddr>} Systematically throws an error.
     */
    compareTo(_that: NetAddr): number {
        throw new InvalidOperation(
            'NetAddr.compareTo',
            'There is no comparison between network addresses',
            { data: '' }
        );
    }

    /**
     * Returns a string representation of the network address with IPv6 compression.
     */
    public toString(): string {
        if (this.ipAddress.length === IPV6_LENGTH) {
            // IPv6
            // Convert bytes to hexadecimal groups
            const groups: string[] = [];
            for (let i = 0; i < 16; i += 2) {
                const hex = (
                    (this.ipAddress[i] << 8) |
                    this.ipAddress[i + 1]
                ).toString(16);
                groups.push(hex);
            }

            // Check if all segments are zero
            if (groups.every((g) => g === '0')) {
                return `[::]:${this.port}`;
            }

            // Find longest sequence of zero groups
            let longestZeroStart = -1;
            let longestZeroLength = 0;
            let currentZeroStart = -1;
            let currentZeroLength = 0;

            for (let i = 0; i < groups.length; i++) {
                if (groups[i] === '0') {
                    if (currentZeroStart === -1) {
                        currentZeroStart = i;
                    }
                    currentZeroLength++;
                } else {
                    if (currentZeroLength > longestZeroLength) {
                        longestZeroStart = currentZeroStart;
                        longestZeroLength = currentZeroLength;
                    }
                    currentZeroStart = -1;
                    currentZeroLength = 0;
                }
            }

            // Check final sequence of zeros
            if (currentZeroLength > longestZeroLength) {
                longestZeroStart = currentZeroStart;
                longestZeroLength = currentZeroLength;
            }

            // Build compressed string
            const parts: string[] = [];
            let i = 0;
            while (i < groups.length) {
                if (i === longestZeroStart && longestZeroLength > 1) {
                    parts.push('');
                    i += longestZeroLength;
                } else {
                    parts.push(groups[i] === '0' ? '0' : groups[i]);
                    i++;
                }
            }

            // Handle the case where compression is at the start or end
            const joinedParts = parts.join(':');
            const finalAddress = joinedParts.startsWith(':')
                ? ':' + joinedParts
                : joinedParts;

            return `[${finalAddress}]:${this.port}`;
        } else {
            // IPv4
            return `${Array.from(this.ipAddress).join('.')}:${this.port}`;
        }
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
}

function expandIPv6(compressedIP: string): string {
    // Extract the IP part from [IP]:port format
    const matches = /^\[(.*)\]:(\d+)$/.exec(compressedIP);
    if (matches === null) {
        throw new Error('Invalid IPv6 address with port format');
    }
    const ip = matches[1];
    const port = matches[2];

    // Handle empty input
    if (ip === '') {
        throw new Error('Invalid IPv6 address');
    }

    // Check for multiple :: occurrences
    const doubleColonCount = (ip.match(/::/g) ?? []).length;
    if (doubleColonCount > 1) {
        throw new Error('Invalid IPv6 address: multiple :: not allowed');
    }

    // Handle special case of ::
    if (ip === '::') {
        return `[0000:0000:0000:0000:0000:0000:0000:0000]:${port}`;
    }

    // Split the address into segments
    let segments = ip.split(':');

    // Validate hex values
    segments.forEach((segment) => {
        if (segment !== '' && !/^[0-9a-fA-F]{1,4}$/.test(segment)) {
            throw new Error('Invalid IPv6 address: invalid hex value');
        }
    });

    // Handle starting ::
    if (ip.startsWith('::')) {
        segments = segments.filter((s) => s !== '');
        const zerosNeeded = 8 - segments.length;
        if (zerosNeeded < 0) {
            throw new Error('Invalid IPv6 address: too many segments');
        }
        segments = [...(Array(zerosNeeded).fill('0') as string[]), ...segments];
    }
    // Handle ending ::
    else if (ip.endsWith('::')) {
        segments = segments.filter((s) => s !== '');
        const zerosNeeded = 8 - segments.length;
        if (zerosNeeded < 0) {
            throw new Error('Invalid IPv6 address: too many segments');
        }
        segments = [...segments, ...(Array(zerosNeeded).fill('0') as string[])];
    } else if (ip.includes('::')) {
        const parts = ip.split('::');
        const beforeDouble =
            parts[0] !== undefined && parts[0] !== ''
                ? parts[0].split(':')
                : [];
        const afterDouble =
            parts[1] !== undefined && parts[1] !== ''
                ? parts[1].split(':')
                : [];
        const zerosNeeded = 8 - (beforeDouble.length + afterDouble.length);
        if (zerosNeeded < 0) {
            throw new Error('Invalid IPv6 address: too many segments');
        }
        segments = [
            ...beforeDouble,
            ...(Array(zerosNeeded).fill('0') as string[]),
            ...afterDouble
        ];
    } else if (segments.length !== 8) {
        throw new Error('Invalid IPv6 address: wrong number of segments');
    }

    // Pad each segment to 4 characters
    segments = segments.map((segment) => segment.padStart(4, '0'));

    return `[${segments.join(':')}]:${port}`;
}

export { NetAddr };
