import { digest } from 'multiformats';
import { CID } from 'multiformats/cid';
import { fromHex } from 'viem';
import pinataSDK, { PinataPinOptions } from '@pinata/sdk';

const pinata = new pinataSDK({ pinataJWTKey: process.env.NEXT_PUBLIC_PINATA });

const PINATA_URL = 'https://red-glamorous-bonobo-190.mypinata.cloud/ipfs/';

function concatenate(resultConstructor: any, ...arrays: any) {
  let totalLength = 0;
  for (const arr of arrays) {
    totalLength += arr.length;
  }
  const result = new resultConstructor(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}

export async function ipfsGet(val: any) {
  console.log(val);
  if (!val) {
    return null;
  }
  const digBytes = fromHex(val, 'bytes');
  const bytes = concatenate(Uint8Array, Uint8Array.of(18, 32), digBytes);
  const dig = new digest.Digest(18, 32, digBytes, bytes);
  const cid = CID.createV0(dig);

  const reponse = await fetch(PINATA_URL + cid.toString());
  const content = await reponse.json();

  return content;
}

export async function ipfsPin(name: string, body: any) {
  const options: PinataPinOptions | undefined = {
    pinataMetadata: { name: 'test' },
    pinataOptions: { cidVersion: 0 },
  };

  const res = await pinata.pinJSONToIPFS(body, options);
  return res.IpfsHash;
}
