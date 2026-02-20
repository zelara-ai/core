import { UserProgress, MODULES } from '@zelara/shared';
import { StorageAdapter, InMemoryStorageAdapter } from './StorageAdapter';

/**
 * Manages user progress persistence
 * Uses platform-specific storage adapter
 */
export class ProgressStorage {
  private static readonly PROGRESS_KEY = 'zelara_user_progress';
  private adapter: StorageAdapter;

  constructor(adapter?: StorageAdapter) {
    this.adapter = adapter || new InMemoryStorageAdapter();
  }

  /**
   * Load user progress from storage
   */
  async load(): Promise<UserProgress> {
    const data = await this.adapter.read(ProgressStorage.PROGRESS_KEY);

    if (!data) {
      // Return default progress if none exists
      return this.getDefaultProgress();
    }

    try {
      const progress = JSON.parse(data) as UserProgress;
      return this.validateProgress(progress);
    } catch (error) {
      console.error('Failed to parse progress data:', error);
      return this.getDefaultProgress();
    }
  }

  /**
   * Save user progress to storage
   */
  async save(progress: UserProgress): Promise<void> {
    const validatedProgress = this.validateProgress(progress);
    const data = JSON.stringify(validatedProgress, null, 2);
    await this.adapter.write(ProgressStorage.PROGRESS_KEY, data);
  }

  /**
   * Reset progress to default
   */
  async reset(): Promise<void> {
    await this.adapter.delete(ProgressStorage.PROGRESS_KEY);
  }

  /**
   * Check if progress exists
   */
  async exists(): Promise<boolean> {
    return this.adapter.exists(ProgressStorage.PROGRESS_KEY);
  }

  /**
   * Get default progress (new user)
   */
  private getDefaultProgress(): UserProgress {
    return {
      points: 0,
      unlockedModules: [MODULES.GREEN], // Green always unlocked
      availableUnlocks: [],
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Validate and sanitize progress data
   */
  private validateProgress(progress: UserProgress): UserProgress {
    return {
      points: Math.max(0, progress.points || 0),
      unlockedModules: Array.isArray(progress.unlockedModules)
        ? progress.unlockedModules
        : [MODULES.GREEN],
      availableUnlocks: Array.isArray(progress.availableUnlocks)
        ? progress.availableUnlocks
        : [],
      lastUpdated: progress.lastUpdated || new Date().toISOString(),
    };
  }
}
