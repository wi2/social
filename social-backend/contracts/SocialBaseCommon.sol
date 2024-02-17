// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import "./SocialAccount.sol";

/// @author Michael GAETA
/// @title SocialBaseCommon
/// @notice This abstract contract provides common functionalities for Social Network contracts.
/// It includes mechanisms to verify service activation and user authenticity.
/// Inherit from this contract to create specific social network features like posting, liking, etc.
abstract contract SocialBaseCommon {
    /// @notice Custom error for calling functions without an active service.
    error OnlyService();

    /// @notice Custom error for calling functions by a non-registered user.
    error OnlyUser();

    SocialAccount internal socialContract;
    SocialAccount.Services internal service;

    /// @notice Initializes the contract by setting the social contract address and the service type.
    /// @param _socialContractAddress Address of the main SocialAccount contract.
    /// @param _service The service type as defined in the SocialAccount contract.
    constructor(
        address _socialContractAddress,
        SocialAccount.Services _service
    ) {
        service = _service;
        socialContract = SocialAccount(_socialContractAddress);
    }

    /// @notice Modifier to restrict function calls to when the service is active.
    /// Reverts with OnlyService if the service is not active.
    modifier onlyService() {
        if (!socialContract.isServiceActive(service)) {
            revert OnlyService();
        }
        _;
    }

    /// @notice Modifier to restrict function calls to registered users only.
    /// A Merkle proof is used to verify the user's existence in the social network.
    /// Reverts with OnlyUser if the user is not registered or the proof is invalid.
    /// @param _proof The Merkle proof to verify the user's registration.
    modifier onlyUser(bytes32[] calldata _proof) {
        if (!socialContract.isUser(msg.sender, _proof)) {
            revert OnlyUser();
        }
        _;
    }
}
