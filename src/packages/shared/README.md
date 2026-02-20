# @zelara/shared

Shared TypeScript utilities and types for Zelara ecosystem.

## Usage

```typescript
import { UserProgress, MODULES, UNLOCK_THRESHOLDS } from '@zelara/shared';

const progress: UserProgress = {
  points: 60,
  unlockedModules: [MODULES.GREEN, MODULES.FINANCE],
  availableUnlocks: [MODULES.PRODUCTIVITY],
  lastUpdated: new Date().toISOString(),
};
```

## Development

```bash
npm install
npm run build    # Compile TypeScript
npm run dev      # Watch mode
```
