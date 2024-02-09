// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

/// @title SocialAccount
/// @notice Manages user accounts and services for a decentralized social network.
/// This contract handles service activations, user verifications, and payments.
contract SocialAccount is Ownable {
    /// @notice Custom error for insufficient payment for services.
    error InsufficientPayment();

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

    address admin;
    uint168 public constant TOKEN_PRICE = 1000 gwei;
    mapping(Services => bool) services;
    address[] public users;

    /// @notice Initializes the contract and sets the owner/admin.
    /// @param _owner The address of the owner/admin of the contract.
    constructor(address _owner, address _admin) Ownable(_owner) {
        admin = _admin;
    }

    /// @notice Restricts function access to the admin.
    modifier onlyAdmin() {
        if (!isAdmin()) revert NotAuthorize();
        _;
    }

    /// @notice Ensures that enough funds are provided for service activation.
    modifier enoughFund(uint256 _msgValue, uint256 _count) {
        if (_msgValue < _count * TOKEN_PRICE) revert InsufficientPayment();
        _;
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

    /// @notice Checks if a specified address is the admin.
    /// @return True if the address is the admin, false otherwise.
    function isAdmin() public view returns (bool) {
        return admin == msg.sender;
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

    function _addService(Services[] calldata _services) private {
        for (uint8 i = 0; i < _services.length; i++) {
            if (!services[_services[i]]) {
                services[_services[i]] = true;
            }
        }
    }

    function _createOrUpdate(uint256 _size, bytes32 _merkleRoot) private {
        merkleRoot = _merkleRoot;
        leavesCount += _size;
    }

    /// @notice Creates new services and registers users to the network.
    /// @param _services The services to be created.
    /// @param _to The user addresses to be added.
    /// @param _merkleRoot The Merkle root for user verification.
    function createSocial(
        Services[] calldata _services,
        address[] calldata _to,
        bytes32 _merkleRoot
    ) external payable onlyAdmin enoughFund(msg.value, _services.length) {
        users = _to;
        users.push(msg.sender);
        _createOrUpdate(_to.length, _merkleRoot);
        _addService(_services);
    }

    /// @notice Adds more users to existing services.
    /// @param _to User addresses to be added.
    /// @param _merkleRoot The Merkle root for user verification.
    function addMoreUser(
        address[] calldata _to,
        bytes32 _merkleRoot
    ) external onlyAdmin {
        _createOrUpdate(_to.length, _merkleRoot);
        for (uint8 i = 0; i < _to.length; i++) {
            users.push(_to[i]);
        }
    }

    /// @notice Allows the admin to add new services to the network.
    /// @param _services The services to be added.
    function addService(
        Services[] calldata _services
    ) external payable onlyAdmin enoughFund(msg.value, _services.length) {
        _addService(_services);
    }

    /// @notice Withdraws all funds from the contract to the owner's address.
    function withdraw() external onlyOwner {
        (bool res, ) = msg.sender.call{value: address(this).balance}("");
        require(res, "WithdrawFailed");
    }
}
