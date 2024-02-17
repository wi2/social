// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

/// @author Michael GAETA
/// @title Social Network Article Management
/// @notice This abstract contract provides functionalities for posting and retrieving articles on a social network.
/// It is designed to be inherited by other contracts that require article posting and retrieval capabilities.
abstract contract SocialNetWorkArticle {
    /// @dev Stores the last article posted by each user, where the user's address is the key.
    mapping(address => bytes32) private articles;

    /// @notice Event emitted when an article is posted.
    /// @param _cid Content identifier of the posted article.
    /// @param _author Address of the author who posted the article.
    event ArticlePosted(address indexed _author, bytes32 indexed _cid);

    /// @notice Retrieves the last article posted by the message sender.
    /// @return The content identifier (CID) of the last article posted by the sender.
    function getMyLastArticle() external view returns (bytes32) {
        return articles[msg.sender];
    }

    /// @notice Internal function to retrieve the last article posted by a specific user.
    /// @dev This function is virtual to allow overrides in derived contracts.
    /// @param _user Address of the user whose last article is being retrieved.
    /// @return The content identifier (CID) of the last article posted by the specified user.
    function _getLastArticleFrom(
        address _user
    ) internal view virtual returns (bytes32) {
        return articles[_user];
    }

    /// @notice Internal function to post an article.
    /// @dev This updates the mapping of the user's last article and emits the ArticlePosted event.
    /// @param _cid Content identifier of the article being posted.
    function _postArticle(bytes32 _cid) internal {
        articles[msg.sender] = _cid;
        emit ArticlePosted(msg.sender, _cid);
    }
}
