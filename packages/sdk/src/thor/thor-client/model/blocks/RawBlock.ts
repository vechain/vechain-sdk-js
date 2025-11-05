import { type Hex } from '@common/vcdm';
import { type RawBlockResponse } from '@thor/thorest/blocks/response';

/**
 * A raw block that contains the raw encoded block data.
 */
class RawBlock {
    readonly raw: Hex;
    private readonly _response: RawBlockResponse;

    /**
     * Constructs a new instance of the class from the thorest response.
     *
     * @param {RawBlockResponse} response - The thorest response to construct the instance from.
     */
    private constructor(response: RawBlockResponse) {
        this.raw = response.raw;
        this._response = response;
    }

    /**
     * Creates a new instance of the class from the thorest response.
     *
     * @param {RawBlockResponse | null} response - The thorest response to construct the instance from.
     * @returns {RawBlock | null} A new instance of the class.
     */
    public static fromResponse(
        response: RawBlockResponse | null
    ): RawBlock | null {
        return response === null ? null : new RawBlock(response);
    }

    /**
     * Returns the underlying thorest response.
     * Useful for viem compatibility layer.
     *
     * @returns {RawBlockResponse} The underlying thorest response.
     */
    public toResponse(): RawBlockResponse {
        return this._response;
    }
}

export { RawBlock };
