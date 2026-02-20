import { UserProgress, Module, MODULES, UNLOCK_THRESHOLDS } from '@zelara/shared';

/**
 * Skill tree progression engine
 * Manages points, unlocks, and module availability
 */
export class SkillTreeEngine {
  private progress: UserProgress;

  constructor(initialProgress?: UserProgress) {
    this.progress = initialProgress || {
      points: 0,
      unlockedModules: [MODULES.GREEN], // Green always unlocked
      availableUnlocks: [],
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Award points for completing a task
   */
  awardPoints(points: number): void {
    this.progress.points += points;
    this.progress.lastUpdated = new Date().toISOString();
    this.checkForUnlocks();
  }

  /**
   * Check if any new modules can be unlocked
   */
  private checkForUnlocks(): void {
    const availableModules = Object.values(MODULES).filter(
      (moduleId) =>
        !this.progress.unlockedModules.includes(moduleId) &&
        this.progress.points >= UNLOCK_THRESHOLDS[moduleId]
    );

    this.progress.availableUnlocks = availableModules;
  }

  /**
   * Unlock a module (user-triggered)
   */
  unlockModule(moduleId: string): boolean {
    if (!this.progress.availableUnlocks.includes(moduleId)) {
      return false;
    }

    this.progress.unlockedModules.push(moduleId);
    this.progress.availableUnlocks = this.progress.availableUnlocks.filter(
      (id) => id !== moduleId
    );
    this.progress.lastUpdated = new Date().toISOString();

    return true;
  }

  /**
   * Check if a module is unlocked
   */
  isModuleUnlocked(moduleId: string): boolean {
    return this.progress.unlockedModules.includes(moduleId);
  }

  /**
   * Get current progress
   */
  getProgress(): UserProgress {
    return { ...this.progress };
  }

  /**
   * Get points until next unlock
   */
  getPointsUntilNextUnlock(): number | null {
    const allModules = Object.values(MODULES);
    const lockedModules = allModules.filter(
      (moduleId) => !this.progress.unlockedModules.includes(moduleId)
    );

    if (lockedModules.length === 0) {
      return null; // All modules unlocked
    }

    const nextThreshold = Math.min(
      ...lockedModules.map((moduleId) => UNLOCK_THRESHOLDS[moduleId])
    );

    return Math.max(0, nextThreshold - this.progress.points);
  }
}
