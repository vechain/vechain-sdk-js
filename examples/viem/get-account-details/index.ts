import { Address } from '@vechain/sdk-temp/common';
import { ThorNetworks, formatEther } from '@vechain/sdk-temp/thor';
import { createPublicClient } from '@vechain/sdk-temp/viem';

const publicClient = createPublicClient({ network: ThorNetworks.MAINNET });
const thorAccounts = (
    publicClient as unknown as { thorClient: { accounts: any } }
).thorClient.accounts;

const contractAddress = Address.of(
    '0x0000000000000000000000000000456e65726779'
);
const zeroAddress = Address.of('0x0000000000000000000000000000000000000000');

const contractAccount = await thorAccounts.getAccount(contractAddress);
const bytecode = await publicClient.getBytecode(contractAddress);
console.log('Contract account:', contractAccount);
console.log('Contract bytecode:', bytecode.toString());

const account = await thorAccounts.getAccount(zeroAddress);
console.log('Account:', account);

const vetBalance = await publicClient.getBalance(zeroAddress);
const energyBalance = account?.energy ?? 0n;

console.log('VET Balance: Wei', vetBalance);
console.log('VTHO Balance: Wei', energyBalance);
console.log('VET Balance: (VET)', formatEther(vetBalance));
console.log('VTHO Balance: (VTHO)', formatEther(energyBalance));
