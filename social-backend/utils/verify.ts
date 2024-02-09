import { Addressable } from 'ethers';
import { run } from 'hardhat';
import { Address } from 'viem';

const verify = async (contractAddress: string | Addressable, args: any[]) => {
  console.log('Verifying the contract...');
  try {
    await run('verify:verify', {
      address: contractAddress,
      constructorArguments: args || [],
    });
  } catch (e: any) {
    if (e.message.toLowerCase().includes('already verified')) {
      console.log('Already verified !');
    } else {
      console.log(e);
    }
  }
};

export default verify;
