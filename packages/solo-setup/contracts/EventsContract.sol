// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title EventsContract
/// @notice Emits events with various indexed/non-indexed mixes to exercise log/data decoding.
/// @dev t0 is always the keccak256(signature); t1..t3 are the indexed params. Everything else is in `data`.
contract EventsContract {
    // ─────────────────────────────────────────────────────────────────────────────
    // Events (multiple carry non-indexed data: strings, bytes, arrays, scalars)
    // ─────────────────────────────────────────────────────────────────────────────

    /// t0 = Transfer(address,address,uint256)
    /// t1 = from, t2 = to; `value` lives in DATA
    event Transfer(address indexed from, address indexed to, uint256 value);

    /// t0 = Payment(address,uint256,bytes32,bytes)
    /// t1 = payer; `amount`, `memoHash`, `metadata` live in DATA
    event Payment(address indexed payer, uint256 amount, bytes32 memoHash, bytes metadata);

    /// t0 = Note(address,string)
    /// t1 = who; `note` lives in DATA
    event Note(address indexed who, string note);

    /// t0 = Batch(address,address[],uint256[])
    /// t1 = sender; `recipients`, `amounts` (dynamic arrays) live in DATA
    event Batch(address indexed sender, address[] recipients, uint256[] amounts);

    /// t0 = DataOnly(string,bytes,uint256)
    /// No indexed params; everything is in DATA (no t1..t3)
    event DataOnly(string tag, bytes payload, uint256 number);

    /// t0 = Mixed(address,bytes32,bytes,string,uint256)
    /// t1 = who, t2 = key; `blob`, `note`, `count` live in DATA
    event Mixed(address indexed who, bytes32 indexed key, bytes blob, string note, uint256 count);

    /// t0 = TripleTopicWithData(address,address,bytes32,string,uint256)
    /// t1 = a, t2 = b, t3 = tag; `message`, `amount` live in DATA
    event TripleTopicWithData(
        address indexed a,
        address indexed b,
        bytes32 indexed tag,
        string message,
        uint256 amount
    );

    // ─────────────────────────────────────────────────────────────────────────────
    // Emitters
    // ─────────────────────────────────────────────────────────────────────────────

    function emitTransfer(address to, uint256 value) external {
        emit Transfer(msg.sender, to, value);
    }

    function emitPayment(uint256 amount, bytes32 memoHash, bytes calldata metadata) external {
        emit Payment(msg.sender, amount, memoHash, metadata);
    }

    function emitNote(address who, string calldata note) external {
        emit Note(who, note);
    }

    function emitBatch(address[] calldata recipients, uint256[] calldata amounts) external {
        require(recipients.length == amounts.length, "len mismatch");
        emit Batch(msg.sender, recipients, amounts);
    }

    function emitDataOnly(string calldata tag, bytes calldata payload, uint256 number) external {
        emit DataOnly(tag, payload, number);
    }

    function emitMixed(address who, bytes32 key, bytes calldata blob, string calldata note, uint256 count) external {
        emit Mixed(who, key, blob, note, count);
    }

    function emitTripleTopicWithData(
        address a,
        address b,
        bytes32 tag,
        string calldata message,
        uint256 amount
    ) external {
        emit TripleTopicWithData(a, b, tag, message, amount);
    }

    // Batch helpers to create denser logs in one tx
    function emitManyNotes(address[] calldata whos, string calldata note) external {
        for (uint256 i = 0; i < whos.length; i++) {
            emit Note(whos[i], note);
        }
    }

    // Batch helpers to create denser logs in one tx
    function emitManyMixed(
        address who,
        bytes32[] calldata keys,
        bytes calldata blob,
        string calldata note,
        uint256 count
    ) external {
        for (uint256 i = 0; i < keys.length; i++) {
            emit Mixed(who, keys[i], blob, note, count);
        }
    }
}