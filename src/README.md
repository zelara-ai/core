# Zelara Core - Source Code

Shared TypeScript packages for Zelara ecosystem.

## Packages

### [@zelara/shared](packages/shared)
Shared utilities, types, and constants used across all apps and modules.

**Exports**:
- Types: `UserProgress`, `Module`, `Task`, `DeviceInfo`, `ValidationResult`
- Constants: `MODULES`, `UNLOCK_THRESHOLDS`, `TASK_POINTS`, `DEVICE_LINKING`

### [@zelara/skill-tree](packages/skill-tree)
Skill tree progression system - points, unlocks, module availability.

**Exports**:
- `SkillTreeEngine`: Award points, check unlocks, manage progression
- `UnlockManager`: Module metadata and unlock requirements

### [@zelara/state](packages/state)
Local-first state management with platform-specific storage adapters.

**Exports**:
- `ProgressStorage`: Load/save user progress
- `StorageAdapter`: Interface for platform-specific storage (filesystem, AsyncStorage, IndexedDB)

### [@zelara/device-linking](packages/device-linking)
Device linking and task offloading protocol.

**Exports**:
- `PairingManager`: QR pairing, device linking, connection status
- `TaskOffloader`: Offload tasks to linked devices, handle responses

## Development

### Install Dependencies

```bash
cd src/packages/shared && npm install
cd ../skill-tree && npm install
cd ../state && npm install
cd ../device-linking && npm install
```

### Build All Packages

```bash
# From each package directory
npm run build
```

### Watch Mode (Development)

```bash
# From each package directory
npm run dev
```

## Usage in Apps

Apps (desktop, mobile) import these packages:

```typescript
import { UserProgress, MODULES } from '@zelara/shared';
import { SkillTreeEngine } from '@zelara/skill-tree';
import { ProgressStorage } from '@zelara/state';
import { PairingManager } from '@zelara/device-linking';
```

## Architecture

All packages are TypeScript-based, compiled to CommonJS for compatibility.

Dependencies:
```
shared (no dependencies)
  ├── skill-tree
  ├── state
  └── device-linking
```

Platform-specific implementations (network, storage) are handled by apps, not these core packages.
