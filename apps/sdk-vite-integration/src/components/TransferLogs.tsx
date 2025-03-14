import { useEffect, useState, useCallback } from "react";
import { Address, FixedPointNumber, Units } from '@vechain/sdk-core';
import {
    FilterTransferLogsOptions
} from '@vechain/sdk-network';
import { Link } from 'react-router-dom';
import { Transfer } from "../types/index.tsx";
import { explorerUrl, thorClient } from "../const/index.tsx";

/**
 * Reduce the size of a hex string
 *
 * @param hexString Hex string to reduce
 */
function reduceHexStringSize(hexString: string): string {
    // Size to reduce the hex string
    const size = 5;

    // Return the reduced hex string
    return `${hexString.slice(0, size)}...${hexString.slice(-size)}`;
}

const TransferLogs = () => {
    // State to store the transfer history
    const [transfers, setTransfers] = useState<Transfer[]>([]);

    // State to store the address
    const [address, setAddress] = useState<string>(
        '0xc3bE339D3D20abc1B731B320959A96A08D479583'
    );

    const [fromBlock, setFromBlock] = useState<number>(1);
    const [toBlock, setToBlock] = useState<number>(19251959);

    /**
    * Function to get the history for the provided address
    * @param address The address to get the history for
    */
    const getHistoryFor = useCallback(async (address: string) => {
        try {
            // Filter options for the transfer logs
            const filterOptions: FilterTransferLogsOptions = {
                criteriaSet: [
                    { sender: address }, // Transactions sent by the address
                    { recipient: address } // Transactions received by the address
                ],
                order: 'desc', // Order logs by descending timestamp
                range: {
                    unit: 'block',
                    from: fromBlock,
                    to: toBlock
                }
            };

            // Get the transfer logs
            const logs = await thorClient.logs.filterTransferLogs(filterOptions);

            // Map the logs to the transfer interface
            const transfers = logs.map((log) => ({
                from: log.sender,
                to: log.recipient,
                amount: log.amount,
                meta: log.meta
            }));
            setTransfers(transfers);
        } catch (error) {
            setTransfers([]);
            console.error(error);
        }
    }, [fromBlock, toBlock]);

    // Update the history when the address changes
    useEffect(() => {
        if (Address.isValid(address) && fromBlock) {
            void getHistoryFor(address);
        }
    }, [address, fromBlock, toBlock, getHistoryFor]);

    return (
        <main className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
            <div className="my-20 mx-auto max-w-2xl text-center">
                <p className="my-5 text-lg leading-8 text-gray-600">
                    Insert an address, fromBlock and ToBlock number to get the transfer logs
                </p>
                <div>
                    <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Address
                    </label>
                    <input
                        type="text"
                        name="address"
                        data-testid="address"
                        onChange={(e) => {
                            setAddress(e.target.value);
                        }}
                        value={address}
                        className="block mx-auto w-full sm:max-w-md border-2 border-dark focus:border-purple-500 bg-transparent py-2 px-4 text-lg text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none rounded-md"
                        placeholder="0xc3bE339D3D20abc1B731B320959A96A08D479583"
                    />
                </div>
                <div>
                    <label
                        htmlFor="fromblock"
                        className="block text-sm font-medium text-gray-700"
                    >
                        FromBlock
                    </label>
                    <input
                        type="number"
                        name="fromblock"
                        data-testid="fromblock"
                        onChange={(e) => {
                            setFromBlock(parseInt(e.target.value));
                        }}
                        value={fromBlock}
                        className="block mx-auto w-full sm:max-w-md border-2 border-dark focus:border-purple-500 bg-transparent py-2 px-4 text-lg text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none rounded-md"
                        placeholder="1"
                    />
                </div>
                <div>
                    <label
                        htmlFor="Toblock"
                        className="block text-sm font-medium text-gray-700"
                    >
                        ToBlock
                    </label>
                    <input
                        type="number"
                        name="toblock"
                        data-testid="toblock"
                        onChange={(e) => {
                            setToBlock(parseInt(e.target.value));
                        }}
                        value={toBlock}
                        className="block mx-auto w-full sm:max-w-md border-2 border-dark focus:border-purple-500 bg-transparent py-2 px-4 text-lg text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none rounded-md"
                        placeholder="19251959"
                    />
                </div>
            </div>
            <div className="table-container mx-auto max-w-4xl overflow-x-auto text-center justify-center flex flex-col">
                <table className="table-auto" data-testid="logs-table">
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
                        {transfers.map((transfer, index) => (
                            <tr key={index}>
                                <td className="px-4 py-2">
                                    <p
                                        data-testid={`timestamp-${transfer.meta.blockTimestamp}`}
                                    >
                                        {new Date(
                                            transfer.meta.blockTimestamp * 1000
                                        ).toISOString()}
                                    </p>
                                </td>
                                <td className="px-4 py-2">
                                    <Link
                                        to={`${explorerUrl}/accounts/${transfer.from}`}
                                        target={'_blank'}
                                        className={
                                            'text-blue-500 hover:underline'
                                        }
                                        data-testid={`transfer-from-${transfer.from.slice(2, 10)}`}
                                    >
                                        <p>
                                            {reduceHexStringSize(transfer.from)}
                                        </p>
                                    </Link>
                                </td>
                                <td className="px-4 py-2">
                                    <Link
                                        to={`${explorerUrl}/accounts/${transfer.to}`}
                                        target={'_blank'}
                                        className={
                                            'text-blue-500 hover:underline'
                                        }
                                        data-testid={`transfer-to-${transfer.to.slice(2, 10)}`}
                                    >
                                        {reduceHexStringSize(transfer.to)}
                                    </Link>
                                </td>
                                <td className="px-4 py-2">
                                    <p
                                        data-testid={`transfer-amount-${transfer.amount}`}
                                    >
                                        {Units.formatEther(
                                            FixedPointNumber.of(transfer.amount)
                                        )}
                                    </p>
                                </td>
                                <td className="px-4 py-2">
                                    <Link
                                        to={`${explorerUrl}/transactions/${transfer.meta.txID}`}
                                        target={'_blank'}
                                        className={
                                            'text-blue-500 hover:underline'
                                        }
                                        data-testid={`transaction-id-${transfer.meta.txID.slice(2, 10)}`}
                                    >
                                        {reduceHexStringSize(
                                            transfer.meta.txID
                                        )}
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}

export default TransferLogs;
