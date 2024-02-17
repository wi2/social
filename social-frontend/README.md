# Decentralized Social Networks Maker (dsnMaker) - Frontend

**dsnMaker**, a cutting-edge platform for creating and managing decentralized social networks. This frontend is built using a modern stack including Next.js, TypeScript, Tailwind CSS with DaisyUI, and several other key technologies to ensure a robust, efficient, and user-friendly experience.

This frontend harnesses the power of blockchain and decentralized technologies to redefine social networking, providing a secure, user-driven, and censorship-resistant platform.

The **dsnMaker** frontend offers a unique and decentralized platform for creating and managing social networks. Key features include:

### Social Networking Capabilities:

Users can create a social network that supports posting articles, following users, liking and pinning articles, and retweeting content.

### User-Managed Networks:

Each social network is managed by the user who initiates the project. They can invite others to join their network using wallet addresses, ensuring a decentralized and user-centric management system.

### Messaging:

The platform facilitates direct message exchanges between users, enhancing communication within each network.

### Decentralized Storage:

All content, including articles and messages, is stored on Pinata (IPFS), ensuring secure, decentralized, and persistent storage of data.

### Deployment on Fleek.co (IPFS):

The site is deployed on Fleek.co, leveraging IPFS for a fully decentralized hosting solution, enhancing the platform's resilience and accessibility.

## Project Deployment

The static site, exported to the `/out` directory, is deployed on Fleek.co (IPFS), making the entire project completely decentralized. This approach ensures that the dsnMaker platform remains resilient and censorship-resistant.

## Local Development

To test and develop the dsnMaker frontend locally, follow these steps:

1. **Install Dependencies**:

   ```bash
   npm install
   ```

before starting, Add file `./.env.local`

```
NEXT_PUBLIC_CONTRACT_ADDRESS=[SOCIAL_CONTRACT_ADDRESS]
NEXT_PUBLIC_RAINBOWKIT_PROJECT_ID=[YOUR_PROJECT_ID]
NEXT_PUBLIC_ENABLE_TESTNETS=false
NEXT_PUBLIC_ALCHEMY_KEY=[YOUR_ALCHEMY_KEY]
PINATA=[YOUR_PINATA_JWT]
```

change `NEXT_PUBLIC_ENABLE_TESTNETS` to `true` to deploy in testnet

2. **Run Development Server**:
   ```bash
   npm run dev
   ```
   This command will start the development server, typically accessible at `http://localhost:3000`.

## Building for Production

To build the project for production deployment:

1. **Install Dependencies** (if not already done):

   ```bash
   npm install
   ```

2. **Build the Project**:
   ```bash
   npm run build
   ```
   This command generates a static version of the site in the `out/` directory, ready for deployment on Fleek or any other static hosting service compatible with IPFS.

## Techno

- Next.js
- Wagmi
- Viem
- Tailwind CSS with DaisyUI Plugin
- Pinata sdk(IPFS)
- Typescript

## Author

Project created and developed by GAETA Michael
