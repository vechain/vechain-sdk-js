import { Address } from '@vechain/sdk-temp/common';
import { ThorClient, ThorNetworks, VNSResolver } from '@vechain/sdk-temp/thor';

async function example(): Promise<void> {       
    const thorClient = ThorClient.at(ThorNetworks.MAINNET);
    
    // resolve a single domain name to an address   
    const address = await VNSResolver.resolveName(thorClient, 'treasury.greencartdapp.vet');
    console.log('Resolved address of treasury.greencartdapp.vet:', address);

    // resolve a list of domain names to addresses
    const addresses = await VNSResolver.resolveNames(thorClient, ['treasury.greencartdapp.vet', 'greencartdapp.vet']);
    console.log('Resolved addresses of treasury.greencartdapp.vet and greencartdapp.vet:', addresses);

    // lookup a single address to a domain name
    const name = await VNSResolver.lookupAddress(thorClient, Address.of('0xD92232681ed830D541439170F630ca8ae9948A5d'));
    console.log('Lookup name of 0xD92232681ed830D541439170F630ca8ae9948A5d:', name);
    
    const names = await VNSResolver.lookupAddresses(thorClient, [Address.of('0xD92232681ed830D541439170F630ca8ae9948A5d'), Address.of('0x20733c43F564971b16F25d161D68575047469562')]);
    console.log('Lookup names of 0xD92232681ed830D541439170F630ca8ae9948A5d and 0x20733c43F564971b16F25d161D68575047469562:', names);
}

// run the example
example().catch(console.error);