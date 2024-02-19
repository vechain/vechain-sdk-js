import { extendEnvironment } from 'hardhat/config';
import { lazyObject } from 'hardhat/plugins';
import { HardhatProvider } from './vechain-provider-wrapper';
import './type-extensions';

extendEnvironment((hre) => {
    if (!hre.network.name.includes('vechain')) {
        return;
    }
    hre.vechain = lazyObject(() => {
        return new HardhatProvider(
            hre.network.config,
            hre.hardhatArguments.verbose,
            hre.network.name
        );
    });
    hre.network.provider = hre.vechain;
});
