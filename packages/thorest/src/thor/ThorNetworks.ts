enum ThorNetworks {
    MAINNET = 'https://mainnet.vechain.org/',
    SOLONET = 'http://localhost:8669/',
    TESTNET = 'https://testnet.vechain.org/'
}

// Add a helper method to convert to URL
function toURL(network: ThorNetworks): URL {
    return new URL(network);
}

export { ThorNetworks, toURL };
