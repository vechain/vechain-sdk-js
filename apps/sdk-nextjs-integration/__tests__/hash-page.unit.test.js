"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const page_1 = __importDefault(require("@/app/hash/page"));
const user_event_1 = __importDefault(require("@testing-library/user-event"));
require("@testing-library/jest-dom");
/**
 * Tests for the Hash Page component.
 *
 * Basically, we test @vechain-sdk-core functions integration.
 */
describe('Hash Page', () => {
    /**
     * Render the page and check if the components are rendered.
     * We also check the default values.
     */
    it('Should be able to render the page with default values', () => {
        // Render the page
        (0, react_1.render)(<page_1.default />);
        // Get the heading
        const heading = react_1.screen.getByText('sdk-nextjs-integration');
        expect(heading).toBeInTheDocument();
        // Get the content input
        const contentInput = react_1.screen.getByTestId('contentToHash');
        expect(contentInput).toBeInTheDocument();
        expect(contentInput).toHaveValue('Hello World!');
        // Get the hash results
        const blake2b256 = react_1.screen.getByTestId('blake2b256HashLabel');
        expect(blake2b256).toBeInTheDocument();
        expect(blake2b256).toHaveTextContent('0xbf56c0728fd4e9cf64bfaf6dabab81554103298cdee5cc4d580433aa25e98b00');
        const keccak256 = react_1.screen.getByTestId('keccak256HashLabel');
        expect(keccak256).toBeInTheDocument();
        expect(keccak256).toHaveTextContent('0x3ea2f1d0abf3fc66cf29eebb70cbd4e7fe762ef8a09bcc06c8edf641230afec0');
        const sha256 = react_1.screen.getByTestId('sha256HashLabel');
        expect(sha256).toBeInTheDocument();
        expect(sha256).toHaveTextContent('0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069');
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
        const contentInput = react_1.screen.getByTestId('contentToHash');
        await user.clear(contentInput);
        await user.type(contentInput, 'New content!');
        expect(contentInput).toBeInTheDocument();
        expect(contentInput).toHaveValue('New content!');
        // Get the hash results
        const blake2b256 = react_1.screen.getByTestId('blake2b256HashLabel');
        expect(blake2b256).toBeInTheDocument();
        expect(blake2b256).toHaveTextContent('0x8875bac8be3b85852155b9d2a510fa0d7396e68c7b441ad550ffe2a3ef9172b4');
        const keccak256 = react_1.screen.getByTestId('keccak256HashLabel');
        expect(keccak256).toBeInTheDocument();
        expect(keccak256).toHaveTextContent('0xa4b001183dd6ece107d5f3a87c5dc9ef2686bbf83455ebfc58ef6ae26dddf040');
        const sha256 = react_1.screen.getByTestId('sha256HashLabel');
        expect(sha256).toBeInTheDocument();
        expect(sha256).toHaveTextContent('0x58d49f523fa8ba6187b1bf894281cf966322f65def3988e8069fb89815dffc8d');
    });
});
