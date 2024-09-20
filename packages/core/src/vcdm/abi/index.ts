import { ethersAbi } from './ABI';
import { ABIContract } from './ABIContract';
import { ABIEvent } from './ABIEvent';
import { ABIFunction, Function } from './ABIFunction';
import { ABIItem } from './ABIItem';

const abi = {
    ...ethersAbi,
    Function
};

export { abi, ABIContract, ABIEvent, ABIFunction, ABIItem };
