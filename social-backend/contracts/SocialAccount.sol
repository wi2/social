// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

/// @title SocialAccount
/// @notice Manages user accounts and services for a decentralized social network.
/// This contract handles service activations, user verifications, and payments.
contract SocialAccount is Ownable {
    /// @notice Custom error for invalid Merkle proof during user verification.
    error MerkleProofIsNotValid();

    /// @notice Custom error when trying to add a service that already exists.
    error ServiceAlreadyAdded();

    /// @notice Custom error for unauthorized administrative actions.
    error NotAuthorize();

    /// @notice Custom error for unauthorized user actions.
    error NotUserAuthorize();

    uint256 leavesCount;
    bytes32 public merkleRoot;

    enum Services {
        None,
        SocialNetworkPublic,
        SocialMessenger,
        SocialDiscord
    }

    mapping(Services => bool) services;
    address[] public users;

    /// events
    event UsersCreated(address[] _users);

    /// @notice Initializes the contract and sets the owner/admin.
    /// @param _owner The address of the owner/admin of the contract.
    constructor(
        address _owner,
        address[] memory _to,
        bytes32 _merkleRoot
    ) Ownable(_owner) {
        _createOrUpdate(_to.length, _merkleRoot);
        _addServices();
        emit UsersCreated(_to);
    }

    function _verifyMessage(
        address _user,
        bytes32[] calldata _proof
    ) private view returns (bool) {
        return
            MerkleProof.verify(
                _proof,
                merkleRoot,
                keccak256(abi.encodePacked(_user))
            );
    }

    /// @notice Verifies if a specified service is active.
    /// @param _service The service to check.
    /// @return True if the service is active, false otherwise.
    function isServiceActive(Services _service) external view returns (bool) {
        return services[_service];
    }

    /// @notice Verifies if a user is registered in the network.
    /// @param _user The user's address.
    /// @param _proof Merkle proof for user verification.
    /// @return True if the user is registered, false otherwise.
    function isUser(
        address _user,
        bytes32[] calldata _proof
    ) external view returns (bool) {
        return _verifyMessage(_user, _proof);
    }

    /*     function _addService(Services[] calldata _services) private {
        for (uint8 i = 0; i < _services.length; i++) {
            if (!services[_services[i]]) {
                services[_services[i]] = true;
            }
        }
    }
 */
    function _createOrUpdate(uint256 _size, bytes32 _merkleRoot) private {
        merkleRoot = _merkleRoot;
        leavesCount += _size;
    }

    /// @notice Adds more users to existing services.
    /// @param _to User addresses to be added.
    /// @param _merkleRoot The Merkle root for user verification.
    function addMoreUser(
        address[] calldata _to,
        bytes32 _merkleRoot
    ) external onlyOwner {
        _createOrUpdate(_to.length, _merkleRoot);
        for (uint8 i = 0; i < _to.length; i++) {
            users.push(_to[i]);
        }
        emit UsersCreated(users);
    }

    /// @notice Allows the admin to add new services to the network.
    function _addServices() private {
        services[Services.SocialNetworkPublic] = true;
        services[Services.SocialMessenger] = true;
        services[Services.SocialDiscord] = true;
    }
}
