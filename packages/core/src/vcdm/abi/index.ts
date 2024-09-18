import { ethersAbi } from './ABI';
import { Event } from './ABIEvent';
import { Function } from './ABIFunction';

const abi = {
    ...ethersAbi,
    Function,
    Event
};

export { abi };
