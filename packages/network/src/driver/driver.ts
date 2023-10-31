import { DriverNoVendor } from './driver-no-vendor';
import { type Net, type Wallet } from './interfaces';
import { type Block, type ThorStatus } from '../types';

/**
 * Driver class fully implements DriverInterface and extends DriverNoVendor.
 * It provides functionality to connect to the blockchain network and interact with it.
 */
export class Driver extends DriverNoVendor {
    /**
     * Create a driver instance that connects to the blockchain network.
     * It fetches configuration data (genesis, head) via the provided network interface (net).
     *
     * @param net - The network interface for making HTTP requests.
     * @param wallet - (Optional) The wallet information for interacting with the blockchain.
     * @returns A promise that resolves to a Driver instance.
     */
    public static async connect(net: Net, wallet?: Wallet): Promise<Driver> {
        // Fetch the genesis block from the network
        const genesis: Block = (await net.http('GET', 'blocks/0')) as Block;

        // Fetch the best block from the network, validating 'x-genesis-id' in the response header
        const best: Block = (await net.http('GET', 'blocks/best', {
            query: {},
            body: {},
            headers: {},
            validateResponseHeader: (headers) => {
                const xgid = headers['x-genesis-id'];
                if (xgid.length > 0 && xgid !== genesis.id) {
                    throw new Error(
                        `Responded 'x-genesis-id' does not match the expected genesis ID`
                    );
                }
            }
        })) as Block;

        return new Driver(
            net,
            genesis,
            {
                id: best.id,
                number: best.number,
                timestamp: best.timestamp,
                parentID: best.parentID,
                txsFeatures: best.txsFeatures,
                gasLimit: best.gasLimit
            },
            wallet
        );
    }

    /**
     * Creates an instance of the Driver class.
     * @param net - The network interface for making HTTP requests.
     * @param genesis - The genesis block of the blockchain.
     * @param initialHead - (Optional) Initial blockchain head status.
     * @param wallet - (Optional) The wallet information for interacting with the blockchain.
     */
    constructor(
        net: Net,
        genesis: Block,
        initialHead?: ThorStatus['head'],
        private readonly wallet?: Wallet
    ) {
        super(net, genesis, initialHead);
    }
}
