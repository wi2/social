// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

/// @author Michael GAETA
/// @author Michael GAETA
/// @title Social Network Followers Management
/// @notice This abstract contract provides functionalities for managing follower relationships in a social network.
/// It enables users to follow and unfollow each other, while ensuring each action is valid.
abstract contract SocialNetWorkFollowers {
    /// @notice Custom error for trying to follow a user who is already followed.
    error AlreadyFollowed();

    /// @notice Custom error for trying to unfollow a user who is not currently followed.
    error AlreadyUnfollowed();

    /// @dev Stores the follower status between pairs of users, represented as a hashed key.
    mapping(bytes32 => bool) followers;

    /// @notice Event emitted when a user follows another user.
    /// @param _me The address of the user who initiates the follow.
    /// @param _userFollow The address of the user being followed.
    event Followed(address indexed _me, address _userFollow);

    /// @notice Event emitted when a user unfollows another user.
    /// @param _me The address of the user who initiates the unfollow.
    /// @param _userFollow The address of the user being unfollowed.
    event Unfollowed(address indexed _me, address _userFollow);

    /// @notice Modifier to ensure the specified user is not already followed by the sender.
    modifier onlyUnfollowed(address _user) {
        if (isFollowed(_user)) revert AlreadyFollowed();
        _;
    }

    /// @notice Modifier to ensure the specified user is already followed by the sender.
    modifier onlyFollowed(address _user) {
        if (!isFollowed(_user)) revert AlreadyUnfollowed();
        _;
    }

    /// @notice Checks if a user is followed by the message sender.
    /// @param _user The address of the user to check.
    /// @return True if the user is followed, false otherwise.
    function isFollowed(address _user) public view returns (bool) {
        return followers[_getFollowersKey(_user)];
    }

    /// @dev Generates a unique key to represent the follower relationship between two users.
    /// @param pubkey2 The address of the user being followed.
    /// @return A bytes32 hash representing the follower key.
    function _getFollowersKey(address pubkey2) private view returns (bytes32) {
        return keccak256(abi.encodePacked(msg.sender, pubkey2));
    }

    /// @dev Internal function to follow a user.
    /// @param _user The address of the user to be followed.
    function _follow(address _user) internal onlyUnfollowed(_user) {
        followers[_getFollowersKey(_user)] = true;
        emit Followed(msg.sender, _user);
    }

    /// @dev Internal function to unfollow a user.
    /// @param _user The address of the user to unfollow.
    function _unfollow(address _user) internal onlyFollowed(_user) {
        delete followers[_getFollowersKey(_user)];
        emit Unfollowed(msg.sender, _user);
    }
}
