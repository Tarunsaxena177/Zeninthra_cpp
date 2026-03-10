/**
 * Networking utility library for secure packet creation and validation.
 * Uses CryptoJS for encryption, hashing, and signatures.
 */

import CryptoJS from 'crypto-js';

/**
 * Packet Header containing metadata about the transmission.
 */
export interface PacketHeader {
  version: string;
  seq: number;
  timestamp: number;
  senderId: string;
}

/**
 * Authentication metadata for verifying the sender's identity.
 */
export interface PacketAuth {
  signature: string;
}

/**
 * Integrity metadata for ensuring the payload hasn't been tampered with.
 */
export interface PacketIntegrity {
  hash: string;
}

/**
 * Complete Secure Packet structure used for network transmission.
 */
export interface SecurePacket {
  header: PacketHeader;
  auth: PacketAuth;
  payload: string; // Encrypted Base64 string
  integrity: PacketIntegrity;
}

/**
 * Shared secret key for demonstration purposes.
 * In a production environment, this would be managed securely via key exchange.
 */
export const SHARED_SECRET = 'startup-internship-challenge-secret-2024';

/**
 * Creates a secure packet by encrypting data and adding security metadata.
 * 
 * @param senderId - Unique identifier for the sending device
 * @param seq - Sequence number for ordering packets
 * @param data - Raw data string to be transmitted
 * @returns A fully constructed SecurePacket
 */
export function createPacket(senderId: string, seq: number, data: string): SecurePacket {
  const timestamp = Date.now();
  
  // 1. Encrypt Payload (AES-256)
  const encrypted = CryptoJS.AES.encrypt(data, SHARED_SECRET).toString();
  
  // 2. Generate Integrity Hash (SHA-256 of the encrypted payload)
  const hash = CryptoJS.SHA256(encrypted).toString();
  
  // 3. Generate Authentication Signature (HMAC-SHA256 of header metadata + hash)
  const headerStr = `${senderId}:${seq}:${timestamp}`;
  const signature = CryptoJS.HmacSHA256(headerStr + hash, SHARED_SECRET).toString();

  return {
    header: {
      version: '1.0',
      seq,
      timestamp,
      senderId,
    },
    auth: {
      signature,
    },
    payload: encrypted,
    integrity: {
      hash,
    },
  };
}

/**
 * Validates a received secure packet by checking integrity, authenticity, and decrypting the payload.
 * 
 * @param packet - The SecurePacket received from the network
 * @returns Validation result including status, potential error, and decrypted data
 */
export function validatePacket(packet: SecurePacket): { isValid: boolean; error?: string; decryptedData?: string } {
  try {
    // 1. Verify Integrity (Ensure hash matches the payload)
    const currentHash = CryptoJS.SHA256(packet.payload).toString();
    if (currentHash !== packet.integrity.hash) {
      return { isValid: false, error: 'Integrity Check Failed: Hash mismatch' };
    }

    // 2. Verify Authenticity (Ensure signature matches the metadata and hash)
    const headerStr = `${packet.header.senderId}:${packet.header.seq}:${packet.header.timestamp}`;
    const expectedSignature = CryptoJS.HmacSHA256(headerStr + packet.integrity.hash, SHARED_SECRET).toString();
    if (expectedSignature !== packet.auth.signature) {
      return { isValid: false, error: 'Authentication Failed: Invalid signature' };
    }

    // 3. Decrypt Payload using the shared secret
    const bytes = CryptoJS.AES.decrypt(packet.payload, SHARED_SECRET);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedData) {
      return { isValid: false, error: 'Decryption Failed: Invalid key or corrupted data' };
    }

    return { isValid: true, decryptedData };
  } catch (e) {
    return { isValid: false, error: `Processing Error: ${e instanceof Error ? e.message : 'Unknown error'}` };
  }
}
