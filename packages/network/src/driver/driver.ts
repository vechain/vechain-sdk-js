import { DriverNoVendor } from './driver-no-vendor';
import { type Net, type Wallet } from './interfaces';

/** class fully implements DriverInterface */
export class Driver extends DriverNoVendor {
    /**
     * create driver instance
     * it will fetch config(genesis, head) via net as construction params
     * @param net
     * @param wallet
     */
    public static async connect(net: Net, wallet?: Wallet): Promise<Driver> {
        const genesis: Connex.Thor.Block = (await net.http(
            'GET',
            'blocks/0'
        )) as Connex.Thor.Block;
        const best: Connex.Thor.Block = (await net.http('GET', 'blocks/best', {
            query: {},
            body: {},
            headers: {
                'X-Custom-Header': 'custom-value'
            },
            validateResponseHeader: (headers) => {
                const xgid = headers['x-genesis-id'];
                if (xgid.length > 0 && xgid !== genesis.id) {
                    throw new Error(`responded 'x-genesis-id' not matched`);
                }
            }
        })) as Connex.Thor.Block;

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

    constructor(
        net: Net,
        genesis: Connex.Thor.Block,
        initialHead?: Connex.Thor.Status['head'],
        private readonly wallet?: Wallet
    ) {
        super(net, genesis, initialHead);
    }
}
