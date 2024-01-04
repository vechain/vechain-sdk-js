import { EventEmitter } from 'events';
import {
    type EIP1193ProviderMessage,
    type EIP1193RequestArguments
} from '../eip1193';

/**
 * Our core provider class for vechain
 */
class VechainProvider extends EventEmitter implements EIP1193ProviderMessage {
    async request(args: EIP1193RequestArguments): Promise<unknown> {
        console.log('VechainProvider.request', args);
        return await Promise.resolve(2);
    }
}

export { VechainProvider };
