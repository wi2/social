// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

/// @title Social Network Article Likes Management
/// @notice This abstract contract provides functionalities for liking and unliking articles on a social network.
/// Users can express their appreciation for an article by liking it and can also retract their likes.
abstract contract SocialNetWorkLikes {
    /// @notice Custom error for trying to like an article that is already liked.
    error AlreadyLiked();

    /// @notice Custom error for trying to unlike an article that is not currently liked.
    error AlreadyUnliked();

    /// @dev Stores the like status and count for each article.
    struct ArticlesLikes {
        mapping(address => bool) liked;
        uint256 likes;
    }
    mapping(bytes32 => ArticlesLikes) public likes;

    /// @notice Event emitted when an article is liked.
    /// @param _cid Content identifier of the liked article.
    /// @param _me Address of the user who liked the article.
    event Liked(bytes32 indexed _cid, address indexed _me);

    /// @notice Event emitted when an article is unliked.
    /// @param _cid Content identifier of the unliked article.
    /// @param _me Address of the user who unliked the article.
    event Unliked(bytes32 indexed _cid, address indexed _me);

    /// @notice Modifier to ensure the article is not already liked by the sender.
    modifier isAlreadyLiked(bytes32 _cid) {
        if (likes[_cid].liked[msg.sender]) {
            revert AlreadyLiked();
        }
        _;
    }

    /// @notice Modifier to ensure the article is already liked by the sender.
    modifier isNotLiked(bytes32 _cid) {
        if (!likes[_cid].liked[msg.sender]) {
            revert AlreadyUnliked();
        }
        _;
    }

    /// @dev Internal function to like an article.
    /// @param _cid Content identifier of the article to be liked.
    function _like(bytes32 _cid) internal isAlreadyLiked(_cid) {
        likes[_cid].liked[msg.sender] = true;
        ++likes[_cid].likes;
        emit Liked(_cid, msg.sender);
    }

    /// @dev Internal function to unlike an article.
    /// @param _cid Content identifier of the article to be unliked.
    function _unlike(bytes32 _cid) internal isNotLiked(_cid) {
        delete likes[_cid].liked[msg.sender];
        --likes[_cid].likes;
        emit Unliked(_cid, msg.sender);
    }
}
