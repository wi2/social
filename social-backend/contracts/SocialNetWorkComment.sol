// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

/// @author Michael GAETA
/// @title Social Network Comment Management
/// @notice This abstract contract provides functionalities for adding comment and retrieving comment on a social network.
/// It is designed to be inherited by other contracts that require comment and retrieval capabilities.
abstract contract SocialNetWorkComment {
    /// @dev Stores the last article posted by each user, where the user's address is the key.
    mapping(bytes32 => bytes32) private comments;

    /// @notice Event emitted when an comment is added.
    /// @param _cid Content identifier of the comment.
    /// @param _cidArticle cid of the article.
    event Comment(bytes32 indexed _cidArticle, bytes32 indexed _cid);

    /// @notice Internal function to retrieve the last article posted by a specific user.
    /// @dev This function is virtual to allow overrides in derived contracts.
    /// @param _articleCid of article is being retrieved.
    /// @return The content identifier (CID) of the last comment by article.
    function _getLastCommentByArticle(
        bytes32 _articleCid
    ) internal view virtual returns (bytes32) {
        return comments[_articleCid];
    }

    /// @notice Internal function to post an article.
    /// @dev This updates the mapping of the user's last article and emits the ArticlePosted event.
    /// @param _cid Content identifier of the article being posted.
    function _postComment(bytes32 _cidArticle, bytes32 _cid) internal {
        comments[_cidArticle] = _cid;
        emit Comment(_cidArticle, _cid);
    }
}
