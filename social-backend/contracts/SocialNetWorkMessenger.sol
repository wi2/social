// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "./SocialBaseCommon.sol";

/// @title Social Network Messenger
/// @dev Extends SocialBaseCommon for messaging functionalities in a social network.
/// Handles chat management, message encryption, invitation control, and chat secret management.
contract SocialNetWorkMessenger is SocialBaseCommon {
    error NotAuthorizeToSendMessage();
    error LastMessageIsNotOk();
    error NotAuthorizeToSendInvit();
    error NotAuthorizeToAcceptInvit();
    error NotAuthorizeToGetSecret();

    enum Invitation {
        None,
        Sended,
        Accepted
    }

    struct Chat {
        bytes32 currentCID;
        bytes32 merkleCIDs;
        Invitation status;
        mapping(address => bytes32) secretCrypted;
    }

    mapping(address => address) walletChatUser;
    mapping(bytes32 => Chat) chats;

    event Subscribe(address indexed _user);
    event InvitationSended(address indexed _from, address indexed _to);
    event InvitationAccepted(address indexed _from, address indexed _to);
    event MessageSended(
        address indexed _from,
        address indexed _to,
        bytes32 _cid
    );
    event BurnChat(address indexed _from, address indexed _to);

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

    /// @dev Verifies the integrity and membership of a message in a chat session using Merkle proof.
    /// @param _cid The CID of the message to verify.
    /// @param _merkleCIDs The Merkle root of the chat's messages.
    /// @param _proof The Merkle proof validating the message's existence in the chat.
    /// @return True if the message is verified, false otherwise.
    function _verifyMessage(
        bytes32 _cid,
        bytes32 _merkleCIDs,
        bytes32[] calldata _proof
    ) private pure returns (bool) {
        return
            MerkleProof.verifyCalldata(
                _proof,
                _merkleCIDs,
                keccak256(abi.encodePacked(_cid))
            );
    }

    /// @notice Checks if a specific user is subscribed to the messenger service.
    /// @dev Determines subscription status by checking if the user's wallet is linked in `walletChatUser`.
    /// @param _wallet The wallet address of the user to check for subscription status.
    /// @param _proof Merkle proof verifying the user's identity and presence in the social network.
    /// @return bool Returns `true` if the user is subscribed to the messenger service, `false` otherwise.
    /// The function is restricted to only be called for a service and by a verified user (checked by modifiers `onlyService` and `onlyUser`).
    function hasSubscribe(
        address _wallet,
        bytes32[] calldata _proof
    ) external view onlyService onlyUser(_proof) returns (bool) {
        return walletChatUser[_wallet] != address(0);
    }

    /// @notice Checks if the caller has subscribed to the messaging service.
    /// @param _proof Merkle proof to verify the user's existence in the network.
    /// @return bool True if the caller is subscribed, false otherwise.
    function iAmSubscribe(
        bytes32[] calldata _proof
    ) external view onlyService onlyUser(_proof) returns (bool) {
        return walletChatUser[msg.sender] != address(0);
    }

    /// @notice Subscribes a user to the messenger service.
    /// @dev Links a user's address to a specific wallet for asymmetric encryption purposes.
    /// @param _wallet The wallet address to associate with the user.
    /// @param _proof The Merkle proof validating the user's subscription.
    function subscribe(
        address _wallet,
        bytes32[] calldata _proof
    ) external onlyService onlyUser(_proof) {
        walletChatUser[msg.sender] = _wallet;
        emit Subscribe(msg.sender);
    }

    /// @notice Retrieves the encrypted chat secret for secure communication with a specific user.
    /// @dev The function checks if the chat invitation has been accepted before allowing access to the secret.
    /// @param _to The address of the user with whom the chat secret is shared.
    /// @param _proof Merkle proof to verify the caller's identity in the network.
    /// @return bytes32 The encrypted chat secret shared between the caller and the specified user.
    function getChatSecret(
        address _to,
        bytes32[] calldata _proof
    ) external view onlyUser(_proof) onlyService returns (bytes32) {
        bytes32 chatCode = _getChatKey(_to);
        if (chats[chatCode].status != Invitation.Accepted) {
            revert NotAuthorizeToGetSecret();
        }
        return chats[chatCode].secretCrypted[msg.sender];
    }

    /// @notice Retrieves the public wallet address of a user for sending encrypted messages.
    /// @dev This address is used for asymmetric encryption of chat secrets.
    /// @param _to The address of the user whose public wallet address is requested.
    /// @param _proof Merkle proof to verify the caller's identity in the network.
    /// @return address The public wallet address of the specified user.
    function getChatWallet(
        address _to,
        bytes32[] calldata _proof
    ) external view onlyService onlyUser(_proof) returns (address) {
        return walletChatUser[_to];
    }

    /// @notice Retrieves the current Content Identifier (CID) in a chat with a specific user.
    /// @dev CIDs are used to reference messages in the chat.
    /// @param _to The address of the user with whom the chat CID is associated.
    /// @param _proof Merkle proof to verify the caller's identity in the network.
    /// @return bytes32 The current CID of the chat with the specified user.
    function getCurrentCID(
        address _to,
        bytes32[] calldata _proof
    ) external view onlyService onlyUser(_proof) returns (bytes32) {
        return chats[_getChatKey(_to)].currentCID;
    }

    /// @notice Sends a message in a chat session by updating the CID.
    /// @dev Ensures the chat is accepted and the last message is valid before allowing a new message.
    /// @param _newCid The new Content Identifier for the message being sent.
    /// @param _to The address of the recipient in the chat.
    /// @param _merkleCIDs The updated Merkle root including the new CID.
    /// @param _proof Merkle proof to verify the sender's identity in the network.
    function sendMessage(
        bytes32 _newCid,
        address _to,
        bytes32 _merkleCIDs,
        bytes32[] calldata _proof
    ) external onlyService {
        bytes32 chatCode = _getChatKey(_to);
        if (chats[chatCode].status != Invitation.Accepted) {
            revert NotAuthorizeToSendMessage();
        }
        if (!_verifyMessage(chats[chatCode].currentCID, _merkleCIDs, _proof)) {
            revert LastMessageIsNotOk();
        }
        chats[chatCode].currentCID = _newCid;
        chats[chatCode].merkleCIDs = _merkleCIDs;
        emit MessageSended(msg.sender, _to, _newCid);
    }

    /// @notice Sends a chat invitation to another user.
    /// @dev Marks the chat status as 'Sended' if not already in a different state.
    /// @param _to The address of the user to whom the chat invitation is sent.
    /// @param _proof Merkle proof to verify the sender's identity in the network.
    function sendInvitation(
        address _to,
        bytes32[] calldata _proof
    ) external onlyService onlyUser(_proof) {
        bytes32 chatCode = _getChatKey(_to);
        if (chats[chatCode].status != Invitation.None) {
            revert NotAuthorizeToSendInvit();
        }
        chats[chatCode].status = Invitation.Sended;
        emit InvitationSended(msg.sender, _to);
    }

    /// @notice Accepts a chat invitation and shares encrypted secrets for secure communication.
    /// @dev Changes the chat status to 'Accepted' and stores encrypted secrets for both users.
    /// @param _to The address of the user from whom the chat invitation was received.
    /// @param _proof Merkle proof to verify the acceptor's identity in the network.
    /// @param _mySecret The encrypted secret of the acceptor.
    /// @param _yourSecret The encrypted secret intended for the inviter.
    function AcceptInvitation(
        address _to,
        bytes32[] calldata _proof,
        bytes32 _mySecret,
        bytes32 _yourSecret
    ) external onlyService onlyUser(_proof) {
        bytes32 chatCode = _getChatKey(_to);
        if (chats[chatCode].status != Invitation.Sended) {
            revert NotAuthorizeToAcceptInvit();
        }
        chats[chatCode].status = Invitation.Accepted;
        chats[chatCode].secretCrypted[msg.sender] = _mySecret;
        chats[chatCode].secretCrypted[_to] = _yourSecret;
        emit InvitationAccepted(msg.sender, _to);
    }

    /// @notice Deletes a chat session with a specific user.
    /// @dev Permanently removes the chat data associated with the specified user.
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
