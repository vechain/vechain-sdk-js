import { ethersAbi } from './ABI';
import { ABIContract } from './ABIContract';
import { ABIEvent, Event } from './ABIEvent';
import { ABIFunction, Function } from './ABIFunction';
import { ABIItem } from './ABIItem';

const abi = {
    ...ethersAbi,
    Function,
    Event
};

export { abi, ABIContract, ABIEvent, ABIFunction, ABIItem };
