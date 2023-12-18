import { type ethers } from 'ethers';

/**
 *  An **EventFilter** allows efficiently filtering logs (also known as events)
 *  using bloom filters included within blocks.
 */
type EventFilter = ethers.EventFilter;

/**
 *  A **ProviderEvent** provides the types of events that can be subscribed
 *  to on a [[Provider]].
 *
 *  Each provider may include additional possible events it supports, but
 *  the most commonly supported are:
 *
 *  **``"block"``** - calls the listener with the current block number on each
 *  new block.
 *
 *  **``"error"``** - calls the listener on each async error that occurs during
 *  the event loop, with the error.
 *
 *  **``"debug"``** - calls the listener on debug events, which can be used to
 *  troubleshoot network errors, provider problems, etc.
 *
 *  **``transaction hash``** - calls the listener on each block after the
 *  transaction has been mined; generally ``.once`` is more appropriate for
 *  this event.
 *
 *  **``Array``** - calls the listener on each log that matches the filter.
 *
 *  [[EventFilter]] - calls the listener with each matching log
 */
type ProviderEvent = ethers.ProviderEvent;

/**
 * This type has a more explicit and type-safe list
 * of the events that we support
 *
 * @note `ethersToHardhatEvent` function is needed to convert ProviderEvent to HardhatEthersProviderEvent
 */
type HardhatEthersProviderEvent =
    | {
          kind: 'block';
      }
    | {
          kind: 'transactionHash';
          txHash: string;
      }
    | {
          kind: 'event';
          eventFilter: EventFilter;
      };

export type { EventFilter, ProviderEvent, HardhatEthersProviderEvent };
