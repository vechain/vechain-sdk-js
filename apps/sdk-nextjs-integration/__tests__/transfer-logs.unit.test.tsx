import { act, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TransferLogs from '@/app/transfer-logs/page';
import userEvent from '@testing-library/user-event';
import { type CompressedBlockDetail } from '@vechain/sdk-network';
import { thorClient } from '@/const';

// Create mock types
interface MockBlocksModule {
    getBestBlockCompressed: jest.Mock<Promise<CompressedBlockDetail | null>>;
}

interface MockLogsModule {
    filterTransferLogs: jest.Mock<Promise<FilterTransferLogs[]>>;
}

// Mock the thorClient
jest.mock('../src/const', () => ({
    thorClient: {
        blocks: {
            getBestBlockCompressed: jest.fn()
        } as MockBlocksModule,
        logs: {
            filterTransferLogs: jest.fn()
        } as MockLogsModule
    },
    explorerUrl: 'https://testnet.vechain.org'
}));

/**
 * Tests for the Transfer logs Page component.
 *
 * Basically, we test @vechain-sdk-network functions integration.
 */
describe('Transfer logs Page', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();

        // Mock getBestBlockCompressed
        (
            thorClient.blocks.getBestBlockCompressed as jest.Mock
        ).mockResolvedValue({
            number: '123456',
            id: '0x0128380fc2a99149b2aa9056027d347c2da2ef7068f94245a45b1640ab35d89d',
            size: 17201,
            timestamp: 1724658220
        });

        // Mock filterTransferLogs
        (thorClient.logs.filterTransferLogs as jest.Mock).mockResolvedValue([
            {
                sender: '0xSender1',
                recipient: '0xRecipient1',
                amount: '1000000000000000000',
                meta: {
                    blockTimestamp: 1624658220,
                    txID: '0xTransaction1'
                }
            }
            // Add more mock log entries as needed
        ]);
    });

    afterEach(() => {
        // Restore all mocks after each test
        jest.restoreAllMocks();
    });

    /**
     * Render the page and check if the components are rendered.
     * We also check the default values.
     */
    it('Should be able to render the page with default values', async () => {
        let heading;
        await act(async () => {
            // Render the page
            render(<TransferLogs />);
        });

        // Get the heading
        heading = await screen.findByTestId('title');

        await waitFor(() => {
            expect(heading).toBeInTheDocument();
        });

        // Get the content input
        const addressInput = screen.getByTestId('address');
        expect(addressInput).toBeInTheDocument();
        expect(addressInput).toHaveValue(
            '0xc3bE339D3D20abc1B731B320959A96A08D479583'
        );
    });

    /**
     * Render and customize the page with custom values.
     * We also check the new values.
     */
    it('Should be able to customize values and get results', async () => {
        // Render the page
        render(<TransferLogs />);

        // Init user event
        const user = userEvent.setup();

        // Get the content input
        const addressInput = screen.getByTestId('address');
        await user.clear(addressInput);
        await user.type(
            addressInput,
            '0x995711ADca070C8f6cC9ca98A5B9C5A99b8350b1'
        );
        expect(addressInput).toBeInTheDocument();
        expect(addressInput).toHaveValue(
            '0x995711ADca070C8f6cC9ca98A5B9C5A99b8350b1'
        );
    });
});
