/**
 * Global type definitions for the SecureMediaNet application.
 */

import { SecurePacket } from './lib/networking';

/**
 * Represents a log entry for the sender (Data Producer).
 */
export interface SenderLog {
  id: number;
  packet: SecurePacket;
}

/**
 * Represents a log entry for the receiver (Central Processing Unit).
 */
export interface ReceiverLog {
  id: number;
  packet: SecurePacket;
  result: {
    isValid: boolean;
    error?: string;
    decryptedData?: string;
  };
  receivedAt: number;
}

/**
 * Represents a network metric data point.
 */
export interface MetricData {
  time: string;
  latency: number;
}
