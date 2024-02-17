// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./SocialAccount.sol";
import "./SocialNetwork.sol";
import "./SocialNetWorkMessenger.sol";
import "./SocialProfile.sol";

/// @author Michael GAETA
/// @title Social Network Factory
/// @notice This contract serves as a factory to create individual social networks.
/// Each social network consists of a main account, a network platform, and a messenger service.
contract Social is Ownable {
    error SlugNameAlreadyExist();

    /// @dev Represents the structure of a single social network project.
    /// Includes the project's name, owner address, and the addresses of its account, network, messenger, and profile.
    struct Project {
        string name; // The name of the social network project.
        address owner; // The address owner of the social account.
        address account; // The address of the social account.
        address network; // The address of the social network platform.
        address messenger; // The address of the messenger service within the social network.
        address profile; // The address of the social profile service.
    }

    /// @dev Maps the slug of a social network to its corresponding project structure.
    mapping(string => Project) socials;

    event Create(string indexed _slug, string name);

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

    /// @notice Retrieves the name of a specific social network project.
    /// @param _slug The unique identifier (slug) for the social network project.
    /// @return The name of the project.
    function getProjectName(
        string calldata _slug
    ) external view returns (string memory) {
        return socials[_slug].name;
    }

    /// @notice Creates a new social network project with a unique name.
    /// @param _name The name to be assigned to the new social network project.
    /// @param _slug The slug to be assigned to the new social network project.
    /// @param _to The user addresses to be added.
    /// @param _merkleRoot The Merkle root for user verification.
    /// @dev Deploys new instances of SocialAccount, SocialNetwork, SocialNetWorkMessenger, and SocialProfile for the new project.
    function create(
        string memory _name,
        string memory _slug,
        address[] calldata _to,
        bytes32 _merkleRoot
    ) external {
        if (socials[_slug].account != address(0)) {
            revert SlugNameAlreadyExist();
        }
        SocialAccount account = new SocialAccount(
            owner(),
            msg.sender,
            _to,
            _merkleRoot
        );
        SocialNetWork network = new SocialNetWork(address(account));
        SocialNetworkMessenger messenger = new SocialNetworkMessenger(
            address(account)
        );
        SocialProfile profile = new SocialProfile(msg.sender, address(account));

        socials[_slug] = Project(
            _name,
            msg.sender,
            address(account),
            address(network),
            address(messenger),
            address(profile)
        );
        emit Create(_slug, _name);
    }
}
