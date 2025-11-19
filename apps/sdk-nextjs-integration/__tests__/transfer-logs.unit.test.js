"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
require("@testing-library/jest-dom");
const page_1 = __importDefault(require("@/app/transfer-logs/page"));
const user_event_1 = __importDefault(require("@testing-library/user-event"));
const const_1 = require("@/const");
// Mock the thorClient
jest.mock('../src/const', () => ({
    thorClient: {
        blocks: {
            getBestBlockCompressed: jest.fn()
        },
        logs: {
            filterTransferLogs: jest.fn()
        }
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
        const_1.thorClient.blocks.getBestBlockCompressed.mockResolvedValue({
            number: '123456',
            id: '0x0128380fc2a99149b2aa9056027d347c2da2ef7068f94245a45b1640ab35d89d',
            size: 17201,
            timestamp: 1724658220
        });
        // Mock filterTransferLogs
        const_1.thorClient.logs.filterTransferLogs.mockResolvedValue([
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
        await (0, react_1.act)(async () => {
            // Render the page
            (0, react_1.render)(<page_1.default />);
        });
        // Get the heading
        heading = await react_1.screen.findByTestId('title');
        await (0, react_1.waitFor)(() => {
            expect(heading).toBeInTheDocument();
        });
        // Get the content input
        const addressInput = react_1.screen.getByTestId('address');
        expect(addressInput).toBeInTheDocument();
        expect(addressInput).toHaveValue('0xc3bE339D3D20abc1B731B320959A96A08D479583');
    });
    /**
     * Render and customize the page with custom values.
     * We also check the new values.
     */
    it('Should be able to customize values and get results', async () => {
        // Render the page
        (0, react_1.render)(<page_1.default />);
        // Init user event
        const user = user_event_1.default.setup();
        // Get the content input
        const addressInput = react_1.screen.getByTestId('address');
        await user.clear(addressInput);
        await user.type(addressInput, '0x995711ADca070C8f6cC9ca98A5B9C5A99b8350b1');
        expect(addressInput).toBeInTheDocument();
        expect(addressInput).toHaveValue('0x995711ADca070C8f6cC9ca98A5B9C5A99b8350b1');
    });
});
