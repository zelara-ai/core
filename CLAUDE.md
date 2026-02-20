# CLAUDE.md - AI Development Guidelines

This document guides AI assistants (Claude, Cursor, etc.) working on Zelara.

## Project Context

**What**: Client-side, cross-platform lifestyle app with skill tree progression system

**Why**: Help users organize their lives (finance, productivity, home) while contributing to green causes

**How**:
- **Not SaaS** - Installable client app, not web service
- **Edge-first** - Runs locally, works offline, no cloud dependency
- **Device linking** - Cross-device distributed computing (Desktop > Mobile > Web priority)
- **Git submodules as feature gates** - Each module is a separate repo
- **Conditional builds** - Build system creates custom app binaries containing only unlocked features
- **Cross-platform** - Web, Desktop (Windows/Mac/Linux), Mobile (iOS/Android)

## Development Philosophy

1. **Human approval required** - Propose architecture/major changes, wait for approval before implementing
2. **Step-by-step** - Break complex work into discrete steps with checkpoints
3. **Modular first** - Every feature should be isolatable as a submodule
4. **Edge-first** - Prioritize local/offline functionality (no server dependency unless critical)
5. **No premature optimization** - Build for clarity first, optimize when necessary

## Critical Architecture Concepts

### This is NOT a SaaS Product
- No backend API servers (unless absolutely necessary for specific features)
- No "deploy to cloud" mentality
- Users **install** the app on their devices
- Data lives on user's device by default
- Think: desktop software, mobile app, not web service

### Conditional Compilation System
The build system is central to how Zelara works:

1. User progresses through skill tree → unlocks features
2. User's unlock state is local (stored on device)
3. When rebuilding/updating app, build system:
   - Reads user's unlocked features
   - Pulls only relevant git submodules
   - Compiles custom binary with just those modules
4. Result: User A with finance unlocked has different app than User B with health unlocked

### Git Submodules = Feature Modularity
- Each major feature domain is a separate git repository
- `core` repo includes them as submodules in `modules/`
- Submodules can have their own submodules (nested unlocks)
- Build system conditionally includes/excludes submodules

Example:
```
modules/finance/               (submodule - unlocks at skill tree level 2)
├── basic-budget/             (included by default when finance unlocked)
└── tax-automation/           (nested submodule - unlocks at level 5)
```

### Code Reuse Strategy
- Maximum code sharing across platforms
- Shared business logic in platform-agnostic language/framework (TBD)
- Platform-specific UI layers as thin as possible
- Same module code runs on Web/Desktop/Mobile

### State Management
- **Local-first**: User progress, unlocked features, app data stored on device
- **Device-to-device sync**: No cloud. Devices link directly for state sync and task offloading
- **No auth walls**: App works without accounts
- Skill tree definitions version-controlled in `core` repo

### Edge Processing Priority
When a task requires more compute than current device can handle:
1. **Desktop** - Full CV models, complex calculations (highest priority)
2. **Mobile** - Lightweight models, acceptable accuracy
3. **Web** - Very lightweight or rule-based (lowest capability)

If user's device can't process task → offload to linked capable device → prompt to link if none available

## Working with This Repo

### Before Major Changes
1. Read relevant existing code
2. Propose changes with reasoning
3. Wait for human approval
4. Implement incrementally
5. Document decisions in ARCHITECTURE.md

### When Adding Features
Ask yourself:
- Is this a new submodule or part of existing module?
- What skill tree prerequisites unlock this?
- Does this work offline/on-edge?
- Does this require platform-specific code or is it cross-platform?

Document answers in ARCHITECTURE.md before implementing.

### When Writing Code
- Assume **local execution** (not server/cloud)
- Prefer **file system storage** over databases (SQLite acceptable)
- Assume **no network** unless feature explicitly requires device linking
- Consider **edge processing priority** (Desktop > Mobile > Web)
- Test on multiple platforms (Web, Desktop, Mobile simulators)

### Commit Standards
- Concise, imperative messages ("Add skill tree schema", not "Added skill tree schema")
- Reference issues when relevant
- AI commits include co-author tag (handled by Claude Code)

## Technology Stack

**Status**: To be determined collaboratively

Pending decisions:
- Cross-platform framework (Electron/Tauri for desktop? React Native/Flutter for mobile?)
- Shared logic language (TypeScript? Rust?)
- Build system tooling (How to orchestrate submodule conditional inclusion?)
- State storage (File-based? SQLite? IndexedDB for web?)

## Documentation Structure

- **Root READMEs** (core/, modules/, apps/) - Vision-only, no technical details
- **Wikis** (as submodules) - All technical documentation, architecture, planning
- **This file** (CLAUDE.md) - Minimal AI guidelines, points to wiki for details

See [wikis/](wikis/) for detailed technical documentation.
