import { Module, MODULES, UNLOCK_THRESHOLDS } from '@zelara/shared';

/**
 * Manages module metadata and unlock requirements
 */
export class UnlockManager {
  private modules: Map<string, Module>;

  constructor() {
    this.modules = new Map();
    this.initializeModules();
  }

  private initializeModules(): void {
    // Green module (starter)
    this.modules.set(MODULES.GREEN, {
      id: MODULES.GREEN,
      name: 'Green Living',
      description: 'Recycling validation, carbon footprint tracking, sustainable living',
      unlockThreshold: UNLOCK_THRESHOLDS[MODULES.GREEN],
      version: '0.1.0',
    });

    // Finance module
    this.modules.set(MODULES.FINANCE, {
      id: MODULES.FINANCE,
      name: 'Finance Manager',
      description: 'Expense tracking, budget analysis, donation suggestions',
      unlockThreshold: UNLOCK_THRESHOLDS[MODULES.FINANCE],
      version: '0.1.0',
    });

    // Productivity module (future)
    this.modules.set(MODULES.PRODUCTIVITY, {
      id: MODULES.PRODUCTIVITY,
      name: 'Productivity Tools',
      description: 'Focus timers, calendar/email AI, task management',
      unlockThreshold: UNLOCK_THRESHOLDS[MODULES.PRODUCTIVITY],
      version: '0.1.0',
    });

    // Homeowner module (future)
    this.modules.set(MODULES.HOMEOWNER, {
      id: MODULES.HOMEOWNER,
      name: 'Homeowner Tools',
      description: 'Carbon footprint reduction, solar research, energy efficiency',
      unlockThreshold: UNLOCK_THRESHOLDS[MODULES.HOMEOWNER],
      version: '0.1.0',
    });
  }

  /**
   * Get module metadata by ID
   */
  getModule(moduleId: string): Module | undefined {
    return this.modules.get(moduleId);
  }

  /**
   * Get all modules
   */
  getAllModules(): Module[] {
    return Array.from(this.modules.values());
  }

  /**
   * Get modules available at a certain point threshold
   */
  getModulesAtThreshold(points: number): Module[] {
    return this.getAllModules().filter(
      (module) => module.unlockThreshold <= points
    );
  }
}
