import { formatEther as ethersFormatEther } from 'ethers';

/**
 * Formats a value in Wei (bigint or string) to Ether string representation
 * @param wei Raw balance in Wei
 * @returns Formatted Ether string
 */
export function formatEther(wei: bigint | string | null | undefined): string {
  if (wei === null || wei === undefined) return '0.0';
  try {
    const valBig = typeof wei === 'string' ? BigInt(wei) : wei;
    return ethersFormatEther(valBig);
  } catch (error) {
    console.error('Error formatting ether:', error);
    return '0.0';
  }
}

/**
 * Formats a block timestamp (seconds since epoch) into a human-readable date/time string
 * @param timestamp Unix timestamp in seconds (as number or bigint)
 * @returns Formatted date-time string
 */
export function formatTimestamp(timestamp: number | bigint | null | undefined): string {
  if (timestamp === null || timestamp === undefined) return 'N/A';
  
  try {
    const timeMs = typeof timestamp === 'bigint' ? Number(timestamp) * 1000 : timestamp * 1000;
    if (isNaN(timeMs) || timeMs <= 0) return 'Invalid Date';
    
    return new Date(timeMs).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return 'Invalid Date';
  }
}

/**
 * Shortens a transaction hash to the format 0x123456...789abc
 * @param hash The transaction hash string
 * @param chars The number of characters to keep at the start and end (excluding '0x')
 * @returns The shortened transaction hash, or an empty string if invalid
 */
export function formatTxHash(hash: string | null | undefined, chars = 6): string {
  if (!hash || typeof hash !== 'string') return '';
  const cleanHash = hash.trim();
  if (!cleanHash.startsWith('0x') || cleanHash.length < 10) return cleanHash;
  
  return `${cleanHash.substring(0, chars + 2)}...${cleanHash.substring(cleanHash.length - chars)}`;
}
