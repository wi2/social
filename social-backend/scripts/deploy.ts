import { ethers, network } from 'hardhat';
import verify from '../utils/verify';

async function main() {
  const Social = await ethers.deployContract('Social', []);
  await Social.waitForDeployment();
  console.log(`Social deployed to ${Social.target}`);

  // eventual verification
  if (!network.name.includes('localhost') && process.env.POLYGONSCAN_API_KEY) {
    await Social.deploymentTransaction()?.wait(
      network.name.includes('localhost') ? 1 : 10
    );
    console.log('Verifying...');
    await verify(Social.target, []);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
