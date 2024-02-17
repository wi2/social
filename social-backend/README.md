# Decentralized Social Networks Maker (dsnMaker)

## Social.sol

Acts as a factory to create decentralized social networks. Each social network created by this contract includes a main account, a network platform, and a messenger service. The contract automates the deployment of these components, allowing for the easy setup of independent social networks.

## SocialNetWorkMessenger.sol

Manages a messaging service within the social network. Allows users to send encrypted messages, manage chat invitations, and exchange secret keys for secure communication.

### SocialBaseCommon.sol

This foundational contract sets the basic rules and access controls for the other contracts in the social network. It defines who can use certain functionalities, like admins or verified users, and ensures that services are active before being used.

### SocialNetWork.sol

The core of the social network. It combines all functionalities of the other contracts (articles, likes, user following, messaging) into one platform. Users can interact in various ways, like posting articles, liking, following other users, sending messages, etc.

### SocialBaseCommon.sol

This foundational contract sets the basic rules and access controls for the other contracts in the social network. It defines who can use certain functionalities, like admins or verified users, and ensures that services are active before being used.

### SocialNetWorkArticle.sol

This contract allows users to post and retrieve articles in a social network. Each user can publish an article, and the contract keeps track of the last article posted by each user.

### SocialNetWorkLikes.sol

A "likes" system for articles. Users can "like" or "unlike" articles. The contract tracks which articles have been liked and the total number of "likes" for each article.

### SocialNetWorkFollowers.sol

Enables users to "follow" or "unfollow" other users, similar to subscribing to their posts or activities on the social network. It keeps track of who is following whom.

### SocialNetWorkPins.sol

Allows users to pin articles. Pinning an article means marking it as important or for later reading. Users can pin and unpin articles as they wish.

## SocialAccount: Managing User Accounts and Services in a Decentralized Social Network

The `SocialAccount` contract is a key component of a decentralized social network, overseeing the management of user accounts and the services they can access. Its main functionalities include:

- **Service Management**: It controls which services are available on the network and ensures they are operational.
- **User Verification**: The contract employs mechanisms like Merkle proofs to verify the authenticity of users on the network.
- **Payments and Financial Oversight**: It manages payments related to accessing various services, ensuring that sufficient funds are provided for service activation.
- **Admin Control**: Certain actions within the network, like adding new services or users, are restricted to administrators for better governance.
- **Withdrawal of Funds**: The contract allows for the withdrawal of funds, typically managed by network owners or administrators.

In essence, `SocialAccount` acts as the administrative layer of the social network, facilitating a secure and regulated environment where users can engage with various social features, from posting content to messaging, while ensuring a fair and managed financial system.

# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

![Test](https://github.com/wi2/social/images/master/test-1.png?raw=true)
![Text](https://github.com/wi2/social/images/master/test-1.png?raw=true)
![Coverage](https://github.com/wi2/social/images/master/coverage.png?raw=true)

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```
