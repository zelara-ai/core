# @zelara/skill-tree

Skill tree progression system for Zelara.

## Usage

```typescript
import { SkillTreeEngine, UnlockManager } from '@zelara/skill-tree';

// Initialize engine
const engine = new SkillTreeEngine();

// Award points for task completion
engine.awardPoints(10);

// Check progress
const progress = engine.getProgress();
console.log(`Points: ${progress.points}`);
console.log(`Unlocked: ${progress.unlockedModules}`);

// Unlock a module
if (engine.unlockModule('finance')) {
  console.log('Finance module unlocked!');
}

// Get module metadata
const unlockManager = new UnlockManager();
const financeModule = unlockManager.getModule('finance');
console.log(financeModule?.description);
```

## Development

```bash
npm install
npm run build
npm run dev
```
