'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TransferLogs;
const components_1 = require("@/components");
const const_1 = require("@/const");
const utils_1 = require("@/utils");
const sdk_core_1 = require("@vechain/sdk-core");
const link_1 = __importDefault(require("next/link"));
const react_1 = require("react");
function TransferLogs() {
    // State to store the transfer history
    const [transfers, setTransfers] = (0, react_1.useState)([]);
    // State to store the address
    const [address, setAddress] = (0, react_1.useState)('0xc3bE339D3D20abc1B731B320959A96A08D479583');
    /**
     * Function to get the history for the provided address
     * @param address The address to get the history for
     */
    async function getHistoryFor(address) {
        try {
            // Get the latest block
            const bestBlock = await const_1.thorClient.blocks.getBestBlockCompressed();
            // Filter options for the transfer logs
            const filterOptions = {
                criteriaSet: [
                    { sender: address }, // Transactions sent by the address
                    { recipient: address } // Transactions received by the address
                ],
                order: 'desc', // Order logs by descending timestamp
                range: {
                    unit: 'block',
                    from: 0,
                    to: bestBlock.number
                }
            };
            // Get the transfer logs
            const logs = await const_1.thorClient.logs.filterTransferLogs(filterOptions);
            // Map the logs to the transfer interface
            const transfers = logs.map((log) => {
                return {
                    from: log.sender,
                    to: log.recipient,
                    amount: log.amount,
                    meta: log.meta
                };
            });
            setTransfers(transfers);
        }
        catch (error) {
            setTransfers([]);
            console.log(error);
        }
    }
    // Update the history when the address changes
    (0, react_1.useEffect)(() => {
        if (sdk_core_1.Address.isValid(address)) {
            void getHistoryFor(address);
        }
    }, [address]);
    return (<main className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
            <components_1.Header />
            <div className="my-20 mx-auto max-w-2xl text-center">
                <p className="my-5 text-lg leading-8 text-gray-600">
                    Insert an address to get the transfer history
                </p>
                <input type="text" name="address" data-testid="address" onChange={(e) => {
            setAddress(e.target.value);
        }} value={address} className="block mx-auto w-full sm:max-w-md border-2 border-dark focus:border-purple-500 bg-transparent py-2 px-4 text-lg text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none rounded-md" placeholder="0xc3bE339D3D20abc1B731B320959A96A08D479583"/>
            </div>
            <div className="table-container mx-auto max-w-4xl overflow-x-auto text-center justify-center flex flex-col">
                <table className="table-auto">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">Time</th>
                            <th className="px-4 py-2">From</th>
                            <th className="px-4 py-2">To</th>
                            <th className="px-4 py-2">Amount</th>
                            <th className="px-4 py-2">Transaction Id</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transfers.map((transfer) => (<tr key={transfer.meta.txID}>
                                {/* Use txID as the unique key */}
                                <td className="px-4 py-2">
                                    <p data-testid={`timestamp-${transfer.meta.blockTimestamp}`}>
                                        {new Date(transfer.meta.blockTimestamp * 1000).toISOString()}
                                    </p>
                                </td>
                                <td className="px-4 py-2">
                                    <link_1.default href={`${const_1.explorerUrl}/accounts/${transfer.from}`} target={'_blank'} className={'text-blue-500 hover:underline'} data-testid={`transfer-from-${transfer.from.slice(2, 10)}`}>
                                        <p>
                                            {(0, utils_1.reduceHexStringSize)(transfer.from)}
                                        </p>
                                    </link_1.default>
                                </td>
                                <td className="px-4 py-2">
                                    <link_1.default href={`${const_1.explorerUrl}/accounts/${transfer.to}`} target={'_blank'} className={'text-blue-500 hover:underline'} data-testid={`transfer-to-${transfer.to.slice(2, 10)}`}>
                                        {(0, utils_1.reduceHexStringSize)(transfer.to)}
                                    </link_1.default>
                                </td>
                                <td className="px-4 py-2">
                                    <p data-testid={`transfer-amount-${transfer.amount}`}>
                                        {sdk_core_1.Units.formatEther(sdk_core_1.FixedPointNumber.of(transfer.amount))}
                                    </p>
                                </td>
                                <td className="px-4 py-2">
                                    <link_1.default href={`${const_1.explorerUrl}/transactions/${transfer.meta.txID}`} target={'_blank'} className={'text-blue-500 hover:underline'} data-testid={`transaction-id-${transfer.meta.txID.slice(2, 10)}`}>
                                        {(0, utils_1.reduceHexStringSize)(transfer.meta.txID)}
                                    </link_1.default>
                                </td>
                            </tr>))}
                    </tbody>
                </table>
            </div>
        </main>);
}
