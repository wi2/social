import { Address } from 'viem';

export function dateFormat(timestamp: number | undefined) {
  return timestamp ? new Date(Number(timestamp)) : undefined;
}

export function displayAdress(address: Address | undefined) {
  if (!address) return null;
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}
