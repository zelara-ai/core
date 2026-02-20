/**
 * Storage adapter interface
 * Platform-specific implementations (filesystem, AsyncStorage, IndexedDB)
 */
export interface StorageAdapter {
  read(key: string): Promise<string | null>;
  write(key: string, value: string): Promise<void>;
  delete(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
}

/**
 * In-memory storage adapter (for testing/fallback)
 */
export class InMemoryStorageAdapter implements StorageAdapter {
  private store: Map<string, string> = new Map();

  async read(key: string): Promise<string | null> {
    return this.store.get(key) || null;
  }

  async write(key: string, value: string): Promise<void> {
    this.store.set(key, value);
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }

  async exists(key: string): Promise<boolean> {
    return this.store.has(key);
  }
}
