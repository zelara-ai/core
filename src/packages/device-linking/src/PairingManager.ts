import { DeviceInfo, DEVICE_LINKING } from '@zelara/shared';
import { PairingToken, DeviceLinkStatus } from './types';

/**
 * Manages device pairing and connection state
 */
export class PairingManager {
  private linkedDevice: DeviceInfo | null = null;
  private pairingToken: PairingToken | null = null;

  /**
   * Generate pairing token (Desktop)
   */
  generatePairingToken(deviceInfo: DeviceInfo): PairingToken {
    const token: PairingToken = {
      deviceId: deviceInfo.id,
      ipAddress: deviceInfo.ipAddress || '127.0.0.1',
      port: deviceInfo.port || DEVICE_LINKING.DEFAULT_PORT,
      token: this.generateRandomToken(),
      expiresAt: new Date(
        Date.now() + DEVICE_LINKING.PAIRING_TIMEOUT_MS
      ).toISOString(),
    };

    this.pairingToken = token;
    return token;
  }

  /**
   * Validate pairing token (Desktop)
   */
  validatePairingToken(token: string): boolean {
    if (!this.pairingToken) {
      return false;
    }

    if (this.pairingToken.token !== token) {
      return false;
    }

    if (new Date(this.pairingToken.expiresAt) < new Date()) {
      this.pairingToken = null;
      return false;
    }

    return true;
  }

  /**
   * Pair device (Mobile scans QR, connects)
   */
  async pairDevice(token: PairingToken, deviceInfo: DeviceInfo): Promise<boolean> {
    // Validate token not expired
    if (new Date(token.expiresAt) < new Date()) {
      return false;
    }

    // Store linked device
    this.linkedDevice = deviceInfo;

    return true;
  }

  /**
   * Unpair device
   */
  unpairDevice(): void {
    this.linkedDevice = null;
    this.pairingToken = null;
  }

  /**
   * Get link status
   */
  getLinkStatus(): DeviceLinkStatus {
    return {
      isLinked: this.linkedDevice !== null,
      linkedDevice: this.linkedDevice || undefined,
      lastSync: undefined, // TODO: Track last sync
    };
  }

  /**
   * Get linked device info
   */
  getLinkedDevice(): DeviceInfo | null {
    return this.linkedDevice;
  }

  /**
   * Generate random pairing token
   */
  private generateRandomToken(): string {
    return Math.random().toString(36).substring(2, 15) +
           Math.random().toString(36).substring(2, 15);
  }
}
