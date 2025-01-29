import { InvalidDataType } from '@vechain/sdk-errors';
import { IP_CONSTANTS, IP_REGEX } from '../const/ip';

function expandIPv6(compressedIP: string): string {
    const matches = IP_REGEX.IPV6_WITH_PORT.exec(compressedIP);
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
        if (segment !== '' && !IP_REGEX.HEX_SEGMENT.test(segment)) {
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
    if (segments.length !== IP_CONSTANTS.IPV6_SEGMENTS) {
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
        IP_CONSTANTS.IPV6_SEGMENTS - (beforeDouble.length + afterDouble.length);
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
    const zerosNeeded = IP_CONSTANTS.IPV6_SEGMENTS - segments.length;
    if (zerosNeeded < 0) {
        throw new Error('Invalid IPv6 address: too many segments');
    }

    const zeros = Array(zerosNeeded).fill('0') as string[];
    return addZerosToStart ? [...zeros, ...segments] : [...segments, ...zeros];
}

export { expandIPv6 };
