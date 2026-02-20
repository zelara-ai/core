/**
 * Constants shared across Zelara ecosystem
 */

export const MODULES = {
  GREEN: 'green',
  FINANCE: 'finance',
  PRODUCTIVITY: 'productivity',
  HOMEOWNER: 'homeowner',
} as const;

export const UNLOCK_THRESHOLDS = {
  [MODULES.GREEN]: 0, // Always unlocked (starter)
  [MODULES.FINANCE]: 50,
  [MODULES.PRODUCTIVITY]: 100,
  [MODULES.HOMEOWNER]: 150,
} as const;

export const TASK_POINTS = {
  RECYCLING_VALIDATION: 10,
  EXPENSE_LOG: 5,
  FOCUS_SESSION: 5,
} as const;

export const DEVICE_LINKING = {
  DEFAULT_PORT: 8765,
  PAIRING_TIMEOUT_MS: 30000,
  CONNECTION_TIMEOUT_MS: 5000,
} as const;
