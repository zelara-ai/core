# @zelara/state

Local-first state management for Zelara.

## Usage

```typescript
import { ProgressStorage, StorageAdapter } from '@zelara/state';

// Use in-memory storage (default)
const storage = new ProgressStorage();

// Or provide platform-specific adapter
class FileSystemAdapter implements StorageAdapter {
  // Implement read, write, delete, exists
}

const storage = new ProgressStorage(new FileSystemAdapter());

// Load progress
const progress = await storage.load();

// Modify progress
progress.points += 10;

// Save progress
await storage.save(progress);
```

## Platform Adapters

Each platform app should implement its own `StorageAdapter`:

- **Desktop (Tauri)**: Filesystem adapter (JSON files)
- **Mobile (React Native)**: AsyncStorage adapter
- **Web**: IndexedDB or LocalStorage adapter

## Development

```bash
npm install
npm run build
npm run dev
```
