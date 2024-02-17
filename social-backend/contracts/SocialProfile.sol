// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import "./SocialBaseCommon.sol";

/// @author Michael GAETA
/// @title Social Profile
/// @notice This contract extends SocialBaseCommon to manage user profiles in a social network.
/// @dev It handles operations like creating and updating user profiles.
contract SocialProfile is SocialBaseCommon, Ownable {
    /// @dev Represents a user profile with a pseudo (username) and a status (active or inactive).
    struct User {
        string name;
        string pseudo;
        bool status;
    }

    /// @dev Mapping from user addresses to their profile data.
    mapping(address => User) private profile;

    /// @notice Emitted when a new profile is created.
    event CreateProfile(address indexed _user);

    /// @notice Emitted when a user updates their pseudo.
    event UpdatePseudo(string _pseudo, address indexed _user);

    /// @notice Emitted when a user updates their status.
    event UpdateStatus(bool _status, address indexed _user);

    /// @notice Constructs the SocialProfile contract.
    /// @param _owner The address of the contract owner.
    /// @param _socialTokenAddress The address of the social token used in the network.
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

    /// @notice Returns the profile of the caller.
    /// @return User The profile of the caller.
    function getMyProfile() external view returns (User memory) {
        return profile[msg.sender];
    }

    /// @notice Creates a profile for a given user.
    /// @dev Only callable by the contract owner.
    /// @param _user The address of the user for whom to create the profile.
    function createProfile(
        address _user,
        string calldata _name
    ) external onlyOwner {
        profile[msg.sender].name = _name;
        emit CreateProfile(_user);
    }

    /// @notice Updates the pseudo (username) of the caller's profile.
    /// @dev Requires a valid Merkle proof to verify user identity.
    /// @param _pseudo The new pseudo to set for the caller.
    /// @param _proof Merkle proof to verify the caller's identity.
    function updatePseudo(
        string calldata _pseudo,
        bytes32[] calldata _proof
    ) external onlyUser(_proof) {
        profile[msg.sender].pseudo = _pseudo;
        emit UpdatePseudo(_pseudo, msg.sender);
    }

    /// @notice Updates the status of the caller's profile.
    /// @dev Requires a valid Merkle proof to verify user identity.
    /// @param _status The new status to set for the caller.
    /// @param _proof Merkle proof to verify the caller's identity.
    function updateStatus(
        bool _status,
        bytes32[] calldata _proof
    ) external onlyUser(_proof) {
        profile[msg.sender].status = _status;
        emit UpdateStatus(_status, msg.sender);
    }
}
