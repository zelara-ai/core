/**
 * Core type definitions shared across Zelara apps and modules
 */

export interface UserProgress {
  points: number;
  unlockedModules: string[];
  availableUnlocks: string[];
  lastUpdated: string;
}

export interface Module {
  id: string;
  name: string;
  description: string;
  unlockThreshold: number;
  version: string;
}

export interface Task {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  completedAt?: string;
}

export interface DeviceInfo {
  id: string;
  name: string;
  platform: 'desktop' | 'mobile' | 'web';
  capabilities: string[];
  ipAddress?: string;
  port?: number;
}

export interface ValidationResult {
  success: boolean;
  confidence: number;
  message: string;
  metadata?: Record<string, any>;
}
