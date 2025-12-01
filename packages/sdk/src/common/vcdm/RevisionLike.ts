/**
 * Union of values accepted by `Revision.of` and other APIs that consume
 * revision inputs. Allows callers to pass an existing `Revision` instance,
 * a block height (`number`/`bigint`), or a textual alias such as `best`.
 *
 * Note: This type is defined without importing Revision to avoid circular dependencies.
 * The Revision class itself implements this type.
 */
type RevisionLike =
    | { revisionType: unknown; revisionValue: unknown; toString(): string } // Revision instance
    | bigint
    | number
    | string;

export type { RevisionLike };
