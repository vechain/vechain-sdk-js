import { ethersAbi } from './ABI';
import { ABIContract } from './ABIContract';
import { Event } from './ABIEvent';
import { ABIFunction, Function } from './ABIFunction';
import { ABIItem } from './ABIItem';

const abi = {
    ...ethersAbi,
    Function,
    Event
};

export { abi, ABIContract, ABIFunction, ABIItem };
