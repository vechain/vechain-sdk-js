const VNS_NETWORK_CONFIGURATION: Record<
    string,
    { registry: string; resolveUtils: string }
> = {
    main: {
        registry: '0xa9231da8BF8D10e2df3f6E03Dd5449caD600129b',
        resolveUtils: '0xA11413086e163e41901bb81fdc5617c975Fa5a1A'
    },
    '0x186aa': {
        registry: '0xcBFB30c1F267914816668d53AcBA7bA7c9806D13',
        resolveUtils: '0xc403b8EA53F707d7d4de095f0A20bC491Cf2bc94'
    }
};

export { VNS_NETWORK_CONFIGURATION };
