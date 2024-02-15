// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import "./SocialBaseCommon.sol";

contract SocialProfile is SocialBaseCommon, Ownable {
    struct User {
        string pseudo;
        bool status;
    }
    mapping(address => User) private profile;

    event CreateProfile(address indexed _user);
    event UpdatePseudo(string _pseudo, address indexed _user);
    event UpdateStatus(bool _status, address indexed _user);

    constructor(
        address _owner,
        address _socialTokenAddress
    )
        Ownable(_owner)
        SocialBaseCommon(
            _socialTokenAddress,
            SocialAccount.Services.SocialProfile
        )
    {}

    function getMyProfile() external view returns (User memory) {
        return profile[msg.sender];
    }

    function createProfile(address _user) external onlyOwner {
        profile[_user].status = true;
        emit CreateProfile(_user);
    }

    function updatePseudo(
        string calldata _pseudo,
        bytes32[] calldata _proof
    ) external onlyUser(_proof) {
        profile[msg.sender].pseudo = _pseudo;
        emit UpdatePseudo(_pseudo, msg.sender);
    }

    function updateStatus(
        bool _status,
        bytes32[] calldata _proof
    ) external onlyUser(_proof) {
        profile[msg.sender].status = _status;
        emit UpdateStatus(_status, msg.sender);
    }
}
