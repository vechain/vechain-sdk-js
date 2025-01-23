import { InvalidDataType } from '@vechain/sdk-errors';

class NetAddr {
    private readonly ipAddress: [number, number, number, number];
    private readonly port: number;

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

        if (
            ipParts.length !== 4 ||
            ipParts.some((part) => part < 0 || part > 255) ||
            portNumber < 0 ||
            portNumber > 65535
        ) {
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

    toString(): string {
        return `${this.ipAddress.join('.')}:${this.port}`;
    }
}

export { NetAddr };
