enum ThorNetworks {
    MAINNET = 'https://mainnet.vechain.org/',
    SOLONET = 'http://localhost:8669/',
    TESTNET = 'https://testnet.vechain.org/'
}

function toURL(network: ThorNetworks): URL {
    return new URL(network);
}

function isValidNetworkUrl(url: URL): boolean {
    const urlString = url.toString();
    return Object.values(ThorNetworks).includes(urlString as ThorNetworks);
}

export { ThorNetworks, toURL, isValidNetworkUrl };
