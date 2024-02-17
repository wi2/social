// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

/// @author Michael GAETA
/// @title Social Network Article Pinning
/// @dev Provides functionality for users to pin and unpin articles in a social network.
/// Users can mark articles as "pinned" for easy access or reference.
abstract contract SocialNetWorkPins {
    error AlreadyPinned();
    error AlreadyUnpinned();

    /// @dev Maps a combined key of user address and article CID to a boolean indicating if it's pinned.
    mapping(bytes32 => bool) pinneds;

    /// Event emitted when an article is pinned by a user.
    event Pinned(bytes32 indexed _cid, address indexed _me);

    /// Event emitted when an article is unpinned by a user.
    event Unpinned(bytes32 indexed _cid, address indexed _me);

    /// @notice Modifier that checks if an article is not already pinned by the user.
    modifier onlyUnpinned(bytes32 _cid) {
        if (!isPinned(_cid)) revert AlreadyUnpinned();
        _;
    }

    /// @notice Modifier that checks if an article is already pinned by the user.
    modifier onlyPinned(bytes32 _cid) {
        if (isPinned(_cid)) revert AlreadyPinned();
        _;
    }

    /// @notice Checks if an article is pinned by the caller.
    /// @param _cid The content identifier (CID) of the article.
    /// @return bool True if the article is pinned, false otherwise.
    function isPinned(bytes32 _cid) public view returns (bool) {
        return pinneds[_getFollowersKey(msg.sender, _cid)];
    }

    /// @dev Generates a unique key based on the user's address and article CID.
    /// @param _pubkey1 The user's public key (address).
    /// @param _cid The content identifier of the article.
    /// @return bytes32 A unique key for the user-article pair.
    function _getFollowersKey(
        address _pubkey1,
        bytes32 _cid
    ) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(_pubkey1, _cid));
    }

    /// @dev Internal function to pin an article.
    /// @param _cid The content identifier of the article to pin.
    function _pin(bytes32 _cid) internal onlyPinned(_cid) {
        pinneds[_getFollowersKey(msg.sender, _cid)] = true;
        emit Pinned(_cid, msg.sender);
    }

    /// @dev Internal function to unpin an article.
    /// @param _cid The content identifier of the article to unpin.
    function _unpin(bytes32 _cid) internal onlyUnpinned(_cid) {
        delete pinneds[_getFollowersKey(msg.sender, _cid)];
        emit Unpinned(_cid, msg.sender);
    }
}
