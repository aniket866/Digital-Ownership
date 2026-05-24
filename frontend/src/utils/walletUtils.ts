import { isAddress, formatUnits } from 'ethers';

/**
 * Shortens an Ethereum address to the format 0x1234...abcd
 * @param address The address to shorten
 * @param chars The number of characters to keep at the start and end (excluding '0x')
 * @returns The shortened address, or an empty string if address is invalid
 */
export function shortenAddress(address: string | null | undefined, chars = 4): string {
  if (!address || !isAddress(address)) return '';
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
}

/**
 * Validates whether the given string is a valid Ethereum address
 * @param address The address string to validate
 * @returns boolean indicating if the address is valid
 */
export function isValidAddress(address: string | null | undefined): boolean {
  if (!address) return false;
  return isAddress(address);
}

/**
 * Formats a raw balance (wei/atomic units) into a human-readable string with specified precision
 * @param balance Raw balance as bigint or string representation of integer
 * @param decimals Number of decimal places (default 18 for Wei)
 * @param precision Number of decimal places to show in formatted string
 * @returns Formatted balance string
 */
export function formatBalance(
  balance: bigint | string | null | undefined,
  decimals = 18,
  precision = 4
): string {
  if (balance === null || balance === undefined) return '0.0000';
  
  try {
    const valBig = typeof balance === 'string' ? BigInt(balance) : balance;
    const formatted = formatUnits(valBig, decimals);
    const parsed = parseFloat(formatted);
    
    if (isNaN(parsed)) return '0.0000';
    
    // Check if we need to fix decimals or just return as is
    return parsed.toLocaleString(undefined, {
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
    });
  } catch (error) {
    console.error('Error formatting balance:', error);
    return '0.0000';
  }
}

/**
 * Returns the block explorer URL for a given transaction hash or address
 * @param chainId The active network chain ID
 * @param hash The transaction hash or address
 * @param type The type of link ('address' | 'tx')
 * @returns The full explorer URL string
 */
export function getExplorerUrl(
  chainId: number | string | null | undefined,
  hash: string,
  type: 'address' | 'tx'
): string {
  const cleanChainId = chainId ? Number(chainId) : 1;
  let baseUrl = 'https://etherscan.io';

  switch (cleanChainId) {
    case 1: // Mainnet
      baseUrl = 'https://etherscan.io';
      break;
    case 11155111: // Sepolia
      baseUrl = 'https://sepolia.etherscan.io';
      break;
    case 17000: // Holesky
      baseUrl = 'https://holesky.etherscan.io';
      break;
    case 31337: // Hardhat / Anvil Localhost
      // Return local-friendly string or default to local block explorer mock if desired
      return `http://localhost:8545/${type}/${hash}`;
    default:
      baseUrl = 'https://etherscan.io';
  }

  return `${baseUrl}/${type}/${hash}`;
}
