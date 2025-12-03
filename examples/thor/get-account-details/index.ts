import { formatEther, ThorClient, ThorNetworks } from '@vechain/sdk-temp/thor';

// create mainnet thor client
const thor = ThorClient.at(ThorNetworks.MAINNET);

// get a contract account
// here is the VTHO token contract address
const contract = await thor.accounts.getAccount(
  '0x0000000000000000000000000000456e65726779'
);
const bytecode = await thor.accounts.getBytecode(
  '0x0000000000000000000000000000456e65726779'
);
console.log(contract, bytecode);

// example account
// here is the zero address
const account = await thor.accounts.getAccount(
  '0x0000000000000000000000000000000000000000'
);
console.log(account);
// log the VET and VTHO balances in wei
console.log('VET Balance: Wei', account.balance );
console.log('VTHO Balance: Wei', account.energy  );
// log the balance in VET and VTHO units
console.log('VET Balance: (VET)', formatEther(account.balance) );
console.log('VTHO Balance: (VTHO)', formatEther(account.energy)  );