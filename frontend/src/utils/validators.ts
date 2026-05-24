/**
 * Validates if a string is a valid hexadecimal bytes32 string (with or without '0x' prefix)
 * @param value The string value to validate
 * @returns boolean indicating if the string is a valid bytes32 representation
 */
export function isValidBytes32(value: string | null | undefined): boolean {
  if (!value || typeof value !== 'string') return false;
  
  const cleanValue = value.trim();
  // Match standard 32 bytes hex string (64 hex characters, optionally starting with 0x)
  const hexPattern = /^(0x)?[0-9a-fA-F]{64}$/;
  return hexPattern.test(cleanValue);
}

/**
 * Validates if a string matches basic IPFS CID (Content Identifier) formats
 * Supports CIDv0 (starts with Qm, 46 characters) and CIDv1 (starts with bafy, standard multihash base32)
 * @param value The CID string to validate
 * @returns boolean indicating if value is a valid IPFS CID
 */
export function isValidCID(value: string | null | undefined): boolean {
  if (!value || typeof value !== 'string') return false;
  
  const cleanValue = value.trim();
  
  // CIDv0: Base58 encoded multihash, always 46 characters, starting with 'Qm'
  const cidv0Pattern = /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/;
  
  // CIDv1: Typically starts with 'ba' followed by base32 multihash characters
  // Standard base32 CIDv1 starts with 'bafy' or similar base32 prefixes, typically 59 chars long.
  const cidv1Pattern = /^bafy[a-z0-9]{55}$/;
  
  // Broader pattern to catch other multihash variants of CIDv1 (e.g. bafk)
  const genericCidv1Pattern = /^ba[a-z2-7]{57}$/;

  return cidv0Pattern.test(cleanValue) || cidv1Pattern.test(cleanValue) || genericCidv1Pattern.test(cleanValue);
}

/**
 * Checks if a value is a non-empty, non-whitespace string
 * @param value The string to test
 * @returns boolean
 */
export function isNonEmptyString(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  return value.trim().length > 0;
}
