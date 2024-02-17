// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @author Michael GAETA
/// @title SocialAccount
/// @notice Manages user accounts and services for a decentralized social network.
/// @dev This contract handles service activations, user verifications, and payments.
/// It uses MerkleProof from OpenZeppelin to verify user data.
contract SocialAccount is Ownable {
    error OnlyAdmin();

    address admin;
    bytes32 public merkleRoot;

    /// @dev Enum representing various services available in the network.
    enum Services {
        None,
        SocialNetworkPublic,
        SocialMessenger,
        SocialProfile
    }
    uint256 leavesCount;

    mapping(Services => bool) services;
    address[] public users;

    event UsersCreated(address[] _users);

    /// @notice Initializes the contract with the owner, admin, initial users, and Merkle root.
    /// @param _owner The address of the owner/admin of the contract.
    /// @param _admin The address of the admin.
    /// @param _to Initial list of user addresses.
    /// @param _merkleRoot The Merkle root used for user verification.
    constructor(
        address _owner,
        address _admin,
        address[] memory _to,
        bytes32 _merkleRoot
    ) Ownable(_owner) {
        admin = _admin;
        _createOrUpdate(_to.length, _merkleRoot);
        _updateService(true);
        emit UsersCreated(_to);
    }

    /// @dev Internal function to verify a user's address using a Merkle proof.
    /// @param _user The user's address to verify.
    /// @param _proof The Merkle proof to validate the user's address.
    /// @return True if the user's address is verified, false otherwise.
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

    /// @dev Internal function to update the status of services in the network.
    /// @param _val Boolean value to enable or disable services.
    function _updateService(bool _val) private {
        services[Services.SocialNetworkPublic] = _val;
        services[Services.SocialMessenger] = _val;
    }

    /// @notice Checks if a specified service is currently active.
    /// @param _service The service to check.
    /// @return True if the service is active, false otherwise.
    function isServiceActive(Services _service) external view returns (bool) {
        return services[_service];
    }

    /// @notice Verifies if a user is registered in the network.
    /// @param _user The user's address to verify.
    /// @param _proof The Merkle proof for the user's verification.
    /// @return True if the user is registered, false otherwise.
    function isUser(
        address _user,
        bytes32[] calldata _proof
    ) external view returns (bool) {
        return _verifyMessage(_user, _proof);
    }

    /// @dev Internal function to add or update the Merkle root and increment the leaves count.
    /// @param _size The number of new leaves (users) to add.
    /// @param _merkleRoot The new Merkle root.
    function _createOrUpdate(uint256 _size, bytes32 _merkleRoot) private {
        merkleRoot = _merkleRoot;
        leavesCount += _size;
    }

    /// @notice Adds more users to the network and updates the Merkle root.
    /// @param _to Array of user addresses to be added.
    /// @param _merkleRoot The new Merkle root for user verification.
    function addMoreUser(address[] calldata _to, bytes32 _merkleRoot) external {
        if (admin != msg.sender) {
            revert OnlyAdmin();
        }
        _createOrUpdate(_to.length, _merkleRoot);
        for (uint16 i = 0; i < _to.length; i++) {
            users.push(_to[i]);
        }
        emit UsersCreated(users);
    }

    /// @notice Toggles the activation status of services in the network.
    function toggleServices() external onlyOwner {
        _updateService(!services[Services.SocialNetworkPublic]);
    }
}
