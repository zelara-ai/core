# Release Process

This document describes how to create releases for Zelara using GitHub Actions.

---

## Overview

Releases are automated via GitHub Actions and triggered by Git tags. The workflow builds binaries for all platforms and creates a GitHub Release with downloadable artifacts.

---

## Supported Platforms

### Mobile
- **Android**: APK (armv7, arm64, x86, x86_64)
- **iOS**: IPA (unsigned - requires manual signing for distribution)

### Desktop
- **Windows**: MSI installer + portable EXE
- **macOS**: DMG installer (Universal Binary - Intel + Apple Silicon)
- **Linux**: AppImage (portable) + DEB package

---

## Creating a Release

### Step 1: Choose a Version Tag

Tag format: `v{MAJOR}.{MINOR}.{PATCH}-{SUFFIX}`

**Examples**:
- `v0.1.0-test` - Test release (prerelease)
- `v0.1.0-alpha` - Alpha release (prerelease)
- `v0.1.0-beta` - Beta release (prerelease)
- `v0.1.0` - Stable release
- `v1.0.0` - Major stable release

**Prerelease Detection**:
Tags containing `alpha`, `beta`, or `test` are marked as prereleases in GitHub.

---

### Step 2: Create and Push Tag

```bash
# Create tag locally
git tag v0.1.0-test

# Push tag to GitHub
git push origin v0.1.0-test
```

**Alternative**: Create tag via GitHub UI:
1. Go to repository → Releases → "Create a new release"
2. Click "Choose a tag" → Type new tag → "Create new tag"
3. Fill release details → "Publish release"

---

### Step 3: Monitor Build

GitHub Actions will automatically:
1. Build Android APK
2. Build Windows EXE + MSI
3. Build macOS DMG + App
4. Build Linux AppImage + DEB
5. (Attempt) Build iOS IPA
6. Create GitHub Release with all artifacts

**Monitor progress**:
- Go to repository → Actions tab
- Click on the running workflow
- Check build logs for each job

**Build time**: ~30-45 minutes (all platforms in parallel)

---

### Step 4: Download and Test

Once the workflow completes:
1. Go to repository → Releases
2. Find your release
3. Download artifacts for testing
4. Verify installations on each platform

---

## Build Configuration

### Android Signing (Optional)

To sign APKs for production release, add these GitHub Secrets:

1. **Generate keystore**:
   ```bash
   keytool -genkey -v -keystore release.keystore \
     -alias zelara-key -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **Convert to base64**:
   ```bash
   cat release.keystore | base64 > keystore.base64
   ```

3. **Add GitHub Secrets**:
   - `ANDROID_KEYSTORE_BASE64`: Contents of `keystore.base64`
   - `ANDROID_KEY_ALIAS`: Your key alias (e.g., `zelara-key`)
   - `ANDROID_KEY_PASSWORD`: Key password
   - `ANDROID_STORE_PASSWORD`: Keystore password

4. **Update workflow**: Uncomment signing steps in `.github/workflows/release.yml`

---

### iOS Signing (Required for Distribution)

iOS builds are **unsigned** by default. To distribute:

**Option 1: Manual Signing (Recommended)**
1. Download `.xcarchive` from build artifacts
2. Open in Xcode
3. Product → Archive → Distribute App
4. Sign with your Apple Developer account
5. Upload to TestFlight or App Store

**Option 2: GitHub Actions Signing** (Advanced)
1. Export certificates and provisioning profiles
2. Add as GitHub Secrets
3. Update workflow with signing configuration
4. See: [Fastlane iOS signing guide](https://docs.fastlane.tools/codesigning/getting-started/)

---

### macOS Notarization (Optional)

For distribution outside App Store, notarize the app:

1. **Add GitHub Secrets**:
   - `APPLE_ID`: Your Apple ID
   - `APPLE_PASSWORD`: App-specific password
   - `APPLE_TEAM_ID`: Developer Team ID

2. **Update Tauri config** (`apps/desktop/src-tauri/tauri.conf.json`):
   ```json
   {
     "bundle": {
       "macOS": {
         "signingIdentity": "Developer ID Application: Your Name (TEAM_ID)"
       }
     }
   }
   ```

3. **Update workflow**: Add notarization step after build

---

## Workflow File

The release workflow is defined in: `.github/workflows/release.yml`

### Jobs

1. **build-android**: Builds Android APK
2. **build-windows**: Builds Windows EXE + MSI
3. **build-macos**: Builds macOS DMG (Universal Binary)
4. **build-ios**: Builds iOS IPA (unsigned)
5. **build-linux**: Builds Linux AppImage + DEB
6. **create-release**: Creates GitHub Release with all artifacts

### Artifacts

All build artifacts are uploaded with 7-day retention. Download from:
- Actions → Workflow run → Artifacts section
- OR Releases → Latest release → Assets section

---

## Troubleshooting

### Build Failures

**Android APK build fails**:
- Check Java version (requires JDK 17)
- Check Gradle configuration in `apps/mobile/android/build.gradle`
- Verify React Native version compatibility

**Windows build fails**:
- Check Rust installation
- Verify Tauri dependencies in `apps/desktop/src-tauri/Cargo.toml`
- Check Windows-specific WebView2 requirements

**macOS build fails**:
- Verify Xcode version on GitHub runner
- Check code signing configuration
- Ensure universal binary targets are installed

**iOS build fails**:
- Expected if no signing configured
- Check CocoaPods installation
- Verify Xcode workspace configuration

**Linux build fails**:
- Check system dependencies (GTK, WebKit)
- Verify AppImage bundler configuration

---

### Release Not Created

**Workflow runs but no release appears**:
- Check `create-release` job logs
- Verify `GITHUB_TOKEN` permissions (needs `contents: write`)
- Ensure at least one artifact was uploaded

**Release marked as draft**:
- Change `draft: false` in workflow
- Manually publish from GitHub UI

---

## Manual Release (Without GitHub Actions)

If GitHub Actions is unavailable:

### Android
```bash
cd apps/mobile/android
./gradlew assembleRelease
# APK: android/app/build/outputs/apk/release/app-release.apk
```

### Windows
```bash
cd apps/desktop
npm run tauri build
# Installer: src-tauri/target/release/bundle/msi/*.msi
# EXE: src-tauri/target/release/zelara-desktop.exe
```

### macOS
```bash
cd apps/desktop
npm run tauri build -- --target universal-apple-darwin
# DMG: src-tauri/target/universal-apple-darwin/release/bundle/dmg/*.dmg
```

### Linux
```bash
cd apps/desktop
npm run tauri build
# AppImage: src-tauri/target/release/bundle/appimage/*.AppImage
# DEB: src-tauri/target/release/bundle/deb/*.deb
```

---

## Version Management

### Updating Version Numbers

Before creating a release, update version in:

1. **Core package.json**: `package.json` (if exists)
2. **Mobile**: `apps/mobile/package.json`
3. **Desktop**: `apps/desktop/package.json`
4. **Tauri**: `apps/desktop/src-tauri/Cargo.toml`
5. **Tauri config**: `apps/desktop/src-tauri/tauri.conf.json`

**Automation** (future):
- Use `npm version` or `cargo bump` scripts
- Create pre-release hook to sync versions

---

## Distribution Channels

### Android
- **GitHub Releases**: Direct APK download
- **Google Play**: Requires Play Console account + signed APK
- **F-Droid**: Open-source app store (requires submission)

### iOS
- **TestFlight**: Beta testing (requires Apple Developer account)
- **App Store**: Production release (requires Apple Developer account)

### Desktop
- **GitHub Releases**: Direct download (all platforms)
- **Windows**: Microsoft Store (requires account + signing)
- **macOS**: App Store or notarized DMG
- **Linux**: Flathub, Snap Store, or direct download

---

## Release Checklist

Before creating a release:

- [ ] All tests pass locally
- [ ] Version numbers updated in all package files
- [ ] CHANGELOG.md updated with changes
- [ ] Documentation updated (README, wikis)
- [ ] Submodules committed and pushed
- [ ] Main branch merged and pushed
- [ ] Manual testing completed on target platforms
- [ ] Known issues documented in release notes

After release:

- [ ] Download and test all artifacts
- [ ] Verify installation on each platform
- [ ] Update installation documentation if needed
- [ ] Announce release (Discord, social media, etc.)
- [ ] Monitor for bug reports

---

## Future Improvements

- [ ] Automated version bumping
- [ ] Changelog generation from commits
- [ ] Code signing for all platforms
- [ ] Automated testing before release
- [ ] Beta/stable release channels
- [ ] Auto-update mechanism (Tauri updater)
- [ ] Release to app stores (Play Store, App Store)

---

*Last updated: 2026-02-22*
