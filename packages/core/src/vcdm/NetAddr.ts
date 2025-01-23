import { InvalidDataType, InvalidOperation } from '@vechain/sdk-errors';
import { type VeChainDataModel } from './VeChainDataModel';

/**
 * Represents a network address with an IP address and port.
 */
class NetAddr implements VeChainDataModel<NetAddr> {
    /**
     * The IP address of the network address.
     *
     * @type {[number, number, number, number]}
     */
    private readonly ipAddress: [number, number, number, number];

    /**
     * The port of the network address.
     *
     * @type {number}
     */
    private readonly port: number;

    /**
     * Creates a new instance of the NetAddr class.
     *
     * @param {string} value - The IP address of the network address with the appended port number. It should be in the format of 'x.x.x.:port'.
     */
    protected constructor(value: string) {
        const [ip, port] = value.split(':');
        this.ipAddress = ip.split('.').map(Number) as [
            number,
            number,
            number,
            number
        ];
        this.port = Number(port);
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
     * Converts NetAddr into a 6-byte Uint8Array representation.
     * The first 4 bytes represent the IPv4 address, and the last 2 bytes represent the port number.
     *
     * Format:
     * - Bytes 0-3: IPv4 address octets
     * - Bytes 4-5: Port number in big-endian format
     *
     * @returns {Uint8Array} A 6-byte array containing the binary representation of the IP:Port
     *
     * @example
     * // For IP: 192.168.1.1 and Port: 8080
     * // Returns: Uint8Array [192, 168, 1, 1, 31, 144]
     */
    get bytes(): Uint8Array {
        // Create a new 6-byte array to store the result
        const result = new Uint8Array(6);

        // Copy the 4 IPv4 address bytes to the beginning of the result array
        result.set(new Uint8Array(this.ipAddress), 0);

        // Convert port to two bytes in big-endian format
        result[4] = (this.port >> 8) & 0xff; // High byte
        result[5] = this.port & 0xff; // Low byte

        return result;
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
     * Determines whether this NetAddr instance is equal to the given NetAddr instance.
     *
     * @param {NetAddr} that - The NetAddr instance to compare with.
     * @return {boolean} - True if the NetAddr instances are equal, otherwise false.
     */
    isEqual(that: NetAddr): boolean {
        return (
            this.ipAddress.length === that.ipAddress.length &&
            this.ipAddress.every(
                (value, index) => value === that.ipAddress[index]
            ) &&
            this.port === that.port
        );
    }

    /**
     * Creates a new instance of the NetAddr class from a string expression.
     *
     * @param {string} exp - The string expression representing the network address.
     * @returns {NetAddr} - A new NetAddr instance.
     *
     * @throws {InvalidDataType} - If the string expression is not a valid network address.
     */
    static of(exp: string): NetAddr {
        const ipPortRegex = /^(?:\d{1,3}\.){3}\d{1,3}:\d{1,5}$/;
        if (!ipPortRegex.test(exp)) {
            throw new InvalidDataType(
                'NetAddr.of',
                'not a valid network address (IP:port) expression',
                {
                    exp: `${exp}`
                }
            );
        }

        const [ip, port] = exp.split(':');
        const ipParts = ip.split('.').map(Number);
        const portNumber = Number(port);

        if (ipParts.some((part) => part > 255) || portNumber > 65535) {
            throw new InvalidDataType(
                'NetAddr.of',
                'not a valid network address (IP:port) expression',
                {
                    exp: `${exp}`
                }
            );
        }
        return new NetAddr(exp);
    }

    /**
     * Returns a string representation of the network address.
     *
     * @return {string} The string representation of the network address.
     */
    public toString(): string {
        return `${this.ipAddress.join('.')}:${this.port}`;
    }
}

export { NetAddr };
