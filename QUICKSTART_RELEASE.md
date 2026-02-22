# Quick Start: Creating Your First Release

This guide walks you through creating a test release (`v0.1.0-test`) that will build APK, EXE, and all other platform binaries.

---

## Step 1: Create and Push Tag

```bash
# Ensure you're on main branch with latest changes
git checkout main
git pull

# Create tag for test release
git tag v0.1.0-test

# Push tag to GitHub (this triggers the workflow)
git push origin v0.1.0-test
```

**Alternative** (via GitHub UI):
1. Go to: https://github.com/zelara-ai/core/releases/new
2. Click "Choose a tag" → Type `v0.1.0-test` → Click "Create new tag: v0.1.0-test on publish"
3. Title: `Release v0.1.0-test`
4. Click "Publish release" (workflow will run automatically)

---

## Step 2: Monitor Build Progress

1. Go to: https://github.com/zelara-ai/core/actions
2. You should see a new workflow run: "Build and Release"
3. Click on it to see progress

**Build jobs** (running in parallel):
- ✅ Build Android APK (~10 min)
- ✅ Build Windows EXE (~15 min)
- ✅ Build macOS App (~20 min)
- ⚠️ Build iOS IPA (~15 min, may fail without signing)
- ✅ Build Linux AppImage (~15 min)
- ✅ Create GitHub Release (~1 min, after all jobs complete)

**Total time**: ~30-45 minutes

---

## Step 3: Download Your Builds

Once workflow completes successfully:

1. Go to: https://github.com/zelara-ai/core/releases/tag/v0.1.0-test
2. Scroll to "Assets" section
3. Download files:

**For your Android phone**:
- `app-release.apk` - Install this on your Android device

**For testing Desktop**:
- Windows: `zelara-desktop_0.1.0_x64_en-US.msi` or `zelara-desktop.exe`
- macOS: `Zelara_0.1.0_universal.dmg`
- Linux: `zelara-desktop_0.1.0_amd64.AppImage` or `zelara-desktop_0.1.0_amd64.deb`

---

## Step 4: Install Android APK on Your Phone

### Method 1: Direct Download on Phone

1. On your Android phone, go to: https://github.com/zelara-ai/core/releases/tag/v0.1.0-test
2. Tap `app-release.apk` to download
3. Open the downloaded APK
4. If prompted, enable "Install from Unknown Sources":
   - Settings → Security → Unknown Sources → Enable
   - OR Settings → Apps → Special Access → Install Unknown Apps → Chrome/Browser → Allow
5. Tap "Install"

### Method 2: Transfer from Computer

1. Download `app-release.apk` on your computer
2. Connect phone via USB
3. Copy APK to phone's Downloads folder
4. On phone: Open "Files" app → Downloads → Tap APK → Install

### Method 3: ADB Install (Developer)

```bash
# Download APK to computer first
adb install app-release.apk
```

---

## Step 5: Test the App

Once installed on your Android phone:

1. **Open the app** - Tap "Zelara" icon
2. **Grant permissions** - Allow camera access when prompted
3. **Check HomeScreen** - Should show 0 points
4. **Test pairing** - Try "Link Desktop Device" (requires Desktop app running)
5. **Test task** - Try "Complete Recycling Task" → Take photo

Refer to [TESTING.md](TESTING.md) for complete testing procedures.

---

## Troubleshooting

### Workflow Fails

**Check logs**:
1. Go to Actions → Failed workflow
2. Click on failed job (red X)
3. Expand failed step to see error

**Common issues**:
- **Android build fails**: React Native dependency issues (check package.json)
- **Windows build fails**: Rust/Tauri setup issues (check Cargo.toml)
- **iOS build fails**: Expected (no signing configured)
- **macOS build fails**: Xcode version mismatch on runner

### No Release Created

If workflow succeeds but no release appears:
1. Check "Create GitHub Release" job logs
2. Verify all build jobs completed successfully
3. Ensure at least one artifact was uploaded
4. Check repository permissions (Actions needs write access)

### APK Won't Install on Phone

**"App not installed" error**:
- Ensure "Install from Unknown Sources" is enabled
- Try uninstalling any previous version first
- Check if phone has enough storage

**"Parse error"**:
- APK may be corrupted - re-download
- Check Android version (requires Android 6.0+)

---

## Next Steps

After successful test release:

1. **Test all platforms** - Install and run on Windows/Mac/Linux
2. **Verify functionality** - Follow [TESTING.md](TESTING.md)
3. **Fix any issues** - Update code, create new tag
4. **Create stable release** - Use `v0.1.0` (without `-test` suffix)

---

## Creating Future Releases

```bash
# Alpha release
git tag v0.2.0-alpha
git push origin v0.2.0-alpha

# Beta release
git tag v0.3.0-beta
git push origin v0.3.0-beta

# Stable release
git tag v1.0.0
git push origin v1.0.0
```

Each tag will trigger a new build and create a new GitHub Release.

---

## Cleanup

To delete a test release:

1. Go to: https://github.com/zelara-ai/core/releases
2. Find `v0.1.0-test`
3. Click "Delete" (top right)
4. Delete the tag:
   ```bash
   git tag -d v0.1.0-test  # Delete locally
   git push origin :refs/tags/v0.1.0-test  # Delete from GitHub
   ```

---

**Ready to release?**

```bash
git tag v0.1.0-test
git push origin v0.1.0-test
```

Then watch the magic happen at: https://github.com/zelara-ai/core/actions
