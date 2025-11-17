import { Revision } from './Revision';

/**
 * Union of values accepted by `Revision.of` and other APIs that consume
 * revision inputs. Allows callers to pass an existing `Revision` instance,
 * a block height (`number`/`bigint`), or a textual alias such as `best`.
 */
type RevisionLike = Revision | bigint | number | string;

export type { RevisionLike };
