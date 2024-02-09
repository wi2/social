// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

import "./SocialAccount.sol";
import "./SocialNetwork.sol";
import "./SocialNetWorkMessenger.sol";

/// @title Social Network Factory
/// @notice This contract serves as a factory to create individual social networks.
/// Each social network consists of a main account, a network platform, and a messenger service.
contract Social is Ownable {
    error SlugNameAlreadyExist();

    /// @dev Represents the structure of a single social network project.
    struct Project {
        string name; // The name of the social network project.
        address account; // The address of the social account.
        address network; // The address of the social network platform.
        address messenger; // The address of the messenger service within the social network.
    }

    /// @dev Maps the slug of a social network to its corresponding project structure.
    mapping(string => Project) socials;

    /// @notice Initializes the Social contract and sets the owner.
    constructor() Ownable(msg.sender) {}

    /// @notice Retrieves the details of a specific social network project.
    /// @param _slug The unique identifier (slug) for the social network project.
    /// @return Project The details of the project, including names and addresses of its components.
    function getProject(
        string calldata _slug
    ) external view returns (Project memory) {
        return socials[_slug];
    }

    /// @notice Creates a new social network project with a unique name.
    /// @param _name The name to be assigned to the new social network project.
    /// @param _slug The slug to be assigned to the new social network project.
    /// @param _services The services to be created.
    /// @param _to The user addresses to be added.
    /// @param _merkleRoot The Merkle root for user verification.
    /// @dev Deploys new instances of SocialAccount, SocialNetWork, and SocialNetWorkMessenger for the new project.
    function create(
        string memory _name,
        string memory _slug,
        SocialAccount.Services[] calldata _services,
        address[] calldata _to,
        bytes32 _merkleRoot
    ) external {
        if (socials[_slug].account != address(0)) {
            revert SlugNameAlreadyExist();
        }
        SocialAccount account = new SocialAccount(owner(), msg.sender);
        account.createSocial(_services, _to, _merkleRoot);

        SocialNetWork network = new SocialNetWork(address(account));

        SocialNetWorkMessenger networkMessenger = new SocialNetWorkMessenger(
            address(account)
        );

        socials[_slug] = Project(
            _name,
            address(account),
            address(network),
            address(networkMessenger)
        );
    }
}
