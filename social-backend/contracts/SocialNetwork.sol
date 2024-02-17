// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import "./SocialBaseCommon.sol";
import "./SocialNetWorkArticle.sol";
import "./SocialNetWorkLikes.sol";
import "./SocialNetWorkFollowers.sol";
import "./SocialNetWorkPins.sol";

/// @author Michael GAETA
/// @title Social Network Contract
/// @notice Integrates various social networking functionalities such as articles, likes, follows, and pins.
/// It is a comprehensive contract that allows users to interact in a decentralized social network setting.
contract SocialNetWork is
    SocialBaseCommon,
    SocialNetWorkArticle,
    SocialNetWorkLikes,
    SocialNetWorkFollowers,
    SocialNetWorkPins
{
    /// @notice Initializes the social network contract with a specific social token address.
    /// @param _socialTokenAddress The address of the social token used within the network.
    constructor(
        address _socialTokenAddress
    )
        SocialBaseCommon(
            _socialTokenAddress,
            SocialAccount.Services.SocialNetworkPublic
        )
    {}

    /// @notice Retrieves the latest article posted by a specific user.
    /// @param _user The address of the user whose latest article is being requested.
    /// @return bytes32 The content identifier (CID) of the latest article.
    function getLastArticleFrom(
        address _user,
        bytes32[] calldata _proof
    ) public view onlyService onlyUser(_proof) returns (bytes32) {
        return _getLastArticleFrom(_user);
    }

    /// @notice Allows a user to post an article to the network.
    /// @param _cid The content identifier of the article being posted.
    /// @param _proof Merkle proof to verify the user's identity.
    function postArticle(
        bytes32 _cid,
        bytes32[] calldata _proof
    ) public onlyService onlyUser(_proof) {
        _postArticle(_cid);
    }

    /// @notice Allows a user to pin an article.
    /// @param _cid The content identifier of the article to pin.
    /// @param _proof Merkle proof to verify the user's identity.
    function pin(
        bytes32 _cid,
        bytes32[] calldata _proof
    ) public onlyService onlyUser(_proof) {
        _pin(_cid);
    }

    /// @notice Allows a user to unpin an article.
    /// @param _cid The content identifier of the article to unpin.
    /// @param _proof Merkle proof to verify the user's identity.
    function unpin(
        bytes32 _cid,
        bytes32[] calldata _proof
    ) public onlyService onlyUser(_proof) {
        _unpin(_cid);
    }

    /// @notice Allows a user to like an article.
    /// @param _cid The content identifier of the article to like.
    /// @param _proof Merkle proof to verify the user's identity.
    function like(
        bytes32 _cid,
        bytes32[] calldata _proof
    ) public onlyService onlyUser(_proof) {
        _like(_cid);
    }

    /// @notice Allows a user to unlike an article.
    /// @param _cid The content identifier of the article to unlike.
    /// @param _proof Merkle proof to verify the user's identity.
    function unlike(
        bytes32 _cid,
        bytes32[] calldata _proof
    ) public onlyService onlyUser(_proof) {
        _unlike(_cid);
    }

    /// @notice Allows a user to follow another user.
    /// @param _user The address of the user to follow.
    /// @param _proof Merkle proof to verify the user's identity.
    function follow(
        address _user,
        bytes32[] calldata _proof
    ) public onlyService onlyUser(_proof) {
        _follow(_user);
    }

    /// @notice Allows a user to unfollow another user.
    /// @param _user The address of the user to unfollow.
    /// @param _proof Merkle proof to verify the user's identity.
    function unfollow(
        address _user,
        bytes32[] calldata _proof
    ) public onlyService onlyUser(_proof) {
        _unfollow(_user);
    }
}
