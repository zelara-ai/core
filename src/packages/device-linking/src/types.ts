import { DeviceInfo, ValidationResult } from '@zelara/shared';

export interface PairingToken {
  deviceId: string;
  ipAddress: string;
  port: number;
  token: string;
  expiresAt: string;
}

export interface TaskRequest {
  taskId: string;
  taskType: 'image_validation' | 'calculation' | 'sync';
  payload: any;
  timestamp: string;
}

export interface TaskResponse {
  taskId: string;
  success: boolean;
  result: any;
  error?: string;
  timestamp: string;
}

export interface DeviceLinkStatus {
  isLinked: boolean;
  linkedDevice?: DeviceInfo;
  lastSync?: string;
}
