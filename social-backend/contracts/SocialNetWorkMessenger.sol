// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "./SocialBaseCommon.sol";

/// @author Michael GAETA
/// @title Social Network Messenger
/// @dev Extends SocialBaseCommon for messaging functionalities in a social network.
/// Handles chat management, message encryption, invitation control, and chat secret management.
contract SocialNetworkMessenger is SocialBaseCommon {
    /// @dev Struct representing a chat session between users.
    /// Contains the current chat Content Identifier (CID) and Merkle root of all CIDs in the chat.

    mapping(bytes32 => bytes32) chats;

    event MessageSended(
        address indexed _from,
        address indexed _to,
        bytes32 _cid
    );
    event BurnChat(address indexed _from, address indexed _to);

    /// @notice Constructor to initialize the Social Network Messenger contract.
    /// @param _socialTokenAddress The address of the social token used in the network.
    constructor(
        address _socialTokenAddress
    )
        SocialBaseCommon(
            _socialTokenAddress,
            SocialAccount.Services.SocialMessenger
        )
    {}

    /// @dev Generates a unique key to index a chat session between two users.
    /// @param pubkey1 The address of one of the chat participants.
    /// @return A unique key for indexing the chat session.
    function _getChatKey(address pubkey1) private view returns (bytes32) {
        return
            keccak256(
                pubkey1 < msg.sender
                    ? abi.encodePacked(pubkey1, msg.sender)
                    : abi.encodePacked(msg.sender, pubkey1)
            );
    }

    /// @notice Retrieves the current Content Identifier (CID) in a chat with a specific user.
    /// @param _to The address of the user with whom the chat CID is associated.
    /// @param _proof Merkle proof to verify the caller's identity in the network.
    /// @return The current CID of the chat with the specified user.
    function getCurrentCID(
        address _to,
        bytes32[] calldata _proof
    ) external view onlyService onlyUser(_proof) returns (bytes32) {
        return chats[_getChatKey(_to)];
    }

    /// @notice Sends a message in a chat session by updating the CID.
    /// @param _newCid The new Content Identifier for the message being sent.
    /// @param _to The address of the recipient in the chat.
    /// @param _proof Merkle proof to verify the sender's identity in the network.
    function sendMessage(
        bytes32 _newCid,
        address _to,
        bytes32[] calldata _proof
    ) external onlyService onlyUser(_proof) {
        bytes32 chatCode = _getChatKey(_to);
        chats[chatCode] = _newCid;
        emit MessageSended(msg.sender, _to, _newCid);
    }

    /// @notice Deletes a chat session with a specific user.
    /// @param _to The address of the user with whom the chat session is to be deleted.
    /// @param _proof Merkle proof to verify the caller's identity in the network.
    function burnChat(
        address _to,
        bytes32[] calldata _proof
    ) external onlyService onlyUser(_proof) {
        delete chats[_getChatKey(_to)];
        emit BurnChat(msg.sender, _to);
    }
}
