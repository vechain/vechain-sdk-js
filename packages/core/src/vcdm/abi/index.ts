import { fragment } from '../../abi';
import { ethersAbi } from './ABI';
import { Event } from './ABIEvent';

const abi = {
    ...ethersAbi,
    ...fragment.Function,
    Event
};

export { abi };
