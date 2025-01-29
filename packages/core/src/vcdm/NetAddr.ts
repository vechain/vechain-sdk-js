import { InvalidDataType, InvalidOperation } from '@vechain/sdk-errors';
import { type VeChainDataModel } from './VeChainDataModel';

/**
 * Represents a network address with an IP address and port.
 */
class NetAddr implements VeChainDataModel<NetAddr> {
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
            throw new InvalidDataType(
                'NetAddr.initializeIPv4',
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
            throw new InvalidDataType(
                'NetAddr.of',
                'Invalid IPv6 address format',
                { value }
            );
        }

        if (Number(match[3]) > NetAddr.IP_CONSTANTS.MAX_PORT) {
            throw new InvalidDataType(
                'NetAddr.of',
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
     * Throws an error because there is no number representation for NetAddr.
     *
     * @throws {InvalidOperation<NetAddr>} systematically.
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
     * Throws an error because there is no big integer representation for NetAddr.
     *
     * @throws {InvalidOperation<NetAddr>} systematically.
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
    toString(): string {
        if (this.ipAddress.length === NetAddr.IP_CONSTANTS.IPV6_LENGTH) {
            return this.formatIPv6Address();
        }
        return this.formatIPv4Address();
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

    private formatIPv4Address(): string {
        return `${Array.from(this.ipAddress).join('.')}:${this.port}`;
    }

    private formatIPv6Address(): string {
        const groups = this.createIPv6Groups();

        const { start, length } = this.findLongestZeroSequence(groups);
        const compressedAddress = this.compressIPv6Address(
            groups,
            start,
            length
        );

        return `[${compressedAddress}]:${this.port}`;
    }

    private static parseUncompressedIPv6(address: string): Uint8Array {
        const segments = address.split(':');

        if (segments.length !== 8) {
            throw new InvalidDataType(
                'NetAddr.parseUncompressedIPv6',
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

    private createIPv6Groups(): string[] {
        const groups: string[] = [];
        for (let i = 0; i < NetAddr.IP_CONSTANTS.IPV6_LENGTH; i += 2) {
            const hex = (
                (this.ipAddress[i] << 8) |
                this.ipAddress[i + 1]
            ).toString(16);
            groups.push(hex);
        }
        return groups;
    }

    private findLongestZeroSequence(groups: string[]): {
        start: number;
        length: number;
    } {
        let longestStart = -1;
        let longestLength = 0;
        let currentStart = -1;
        let currentLength = 0;

        groups.forEach((group, index) => {
            if (group === '0') {
                if (currentStart === -1) currentStart = index;
                currentLength++;
            } else {
                if (currentLength > longestLength) {
                    longestStart = currentStart;
                    longestLength = currentLength;
                }
                currentStart = -1;
                currentLength = 0;
            }
        });

        if (currentLength > longestLength) {
            longestStart = currentStart;
            longestLength = currentLength;
        }

        return { start: longestStart, length: longestLength };
    }

    private compressIPv6Address(
        groups: string[],
        start: number,
        length: number
    ): string {
        if (groups.every((group) => group === '0')) {
            return '::';
        }
        const parts: string[] = [];
        let i = 0;

        while (i < groups.length) {
            if (i === start && length > 1) {
                parts.push('');
                i += length;
            } else {
                parts.push(groups[i] === '0' ? '0' : groups[i]);
                i++;
            }
        }

        const joinedParts = parts.join(':');
        return joinedParts.startsWith(':') ? ':' + joinedParts : joinedParts;
    }
}

function expandIPv6(compressedIP: string): string {
    const matches = NetAddr.IP_REGEX.IPV6_WITH_PORT.exec(compressedIP);
    if (matches === null) {
        throw new InvalidDataType(
            'IPv6Utils.expand',
            'Invalid IPv6 address with port format',
            { compressedIP }
        );
    }

    const [, ip, port] = matches;
    if (ip === '') {
        throw new InvalidDataType('IPv6Utils.expand', 'Invalid IPv6 address', {
            compressedIP
        });
    }

    const doubleColonCount = (ip.match(/::/g) ?? []).length;
    if (doubleColonCount > 1) {
        throw new InvalidDataType(
            'IPv6Utils.expand',
            'Invalid IPv6 address: multiple :: not allowed',
            { compressedIP }
        );
    }

    return `[${processIPv6Segments(ip).join(':')}]:${port}`;
}

function processIPv6Segments(ip: string): string[] {
    const segments = ip.split(':');

    segments.forEach((segment) => {
        if (segment !== '' && !NetAddr.IP_REGEX.HEX_SEGMENT.test(segment)) {
            throw new InvalidDataType(
                'IPv6Utils.processIPv6Segments',
                'Invalid IPv6 address: invalid hex value',
                { segment }
            );
        }
    });

    if (ip.startsWith('::')) {
        return handleStartingDoubleColon(segments);
    }
    if (ip.endsWith('::')) {
        return handleEndingDoubleColon(segments);
    }
    if (ip.includes('::')) {
        return handleMiddleDoubleColon(ip);
    }
    if (segments.length !== NetAddr.IP_CONSTANTS.IPV6_SEGMENTS) {
        throw new Error('Invalid IPv6 address: wrong number of segments');
    }

    return segments;
}

function handleStartingDoubleColon(segments: string[]): string[] {
    segments = segments.filter((s) => s !== '');
    return fillWithZeros(segments, true);
}

function handleEndingDoubleColon(segments: string[]): string[] {
    segments = segments.filter((s) => s !== '');
    return fillWithZeros(segments, false);
}

function handleMiddleDoubleColon(ip: string): string[] {
    const [beforeDouble, afterDouble] = ip
        .split('::')
        .map((part) => (part !== '' ? part.split(':') : []));

    const zerosNeeded =
        NetAddr.IP_CONSTANTS.IPV6_SEGMENTS -
        (beforeDouble.length + afterDouble.length);
    if (zerosNeeded < 0) {
        throw new Error('Invalid IPv6 address: too many segments');
    }

    return [
        ...beforeDouble,
        ...(Array(zerosNeeded).fill('0') as string[]),
        ...afterDouble
    ];
}

function fillWithZeros(segments: string[], addZerosToStart: boolean): string[] {
    const zerosNeeded = NetAddr.IP_CONSTANTS.IPV6_SEGMENTS - segments.length;
    if (zerosNeeded < 0) {
        throw new Error('Invalid IPv6 address: too many segments');
    }

    const zeros = Array(zerosNeeded).fill('0') as string[];
    return addZerosToStart ? [...zeros, ...segments] : [...segments, ...zeros];
}

export { NetAddr };
