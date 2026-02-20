# Zelara Core

Anchor repository for Zelara: a client-side, cross-platform lifestyle app with skill tree progression.

## Overview

This repository contains:
- Shared systems (skill tree engine, state management, device linking)
- Build orchestration (conditional compilation based on unlocked features)
- Git submodules for feature modules and platform apps

## Architecture

**Client-side application** - Not a web service. Runs locally on user devices.

**Edge-first execution** - All processing happens on-device. Optional device linking for distributed computing (Desktop > Mobile > Web priority).

**Modular structure** - Feature modules and platform apps are separate repos included as git submodules.

**Conditional builds** - Build system compiles custom binaries containing only user's unlocked features.

## Repository Structure

```
core/
├── modules/           (feature modules as submodules)
├── apps/             (platform apps as submodules)
├── org/              (organization files)
└── wikis/            (technical documentation)
```

## Documentation

See [wiki](wikis/) for:
- Architecture decisions
- Technology stack
- Device linking protocol
- Build system mechanics
- Development workflow

## Development

This is an AI-coordinated project. See [CLAUDE.md](CLAUDE.md) for AI development guidelines.

All architectural decisions require human approval before implementation.
