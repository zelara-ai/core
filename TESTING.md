# MVP Testing Guide

**Purpose**: Manual end-to-end testing of Desktop ↔ Mobile device communication

**Status**: Phase 1-4 implemented, ready for testing

---

## Prerequisites

### Desktop Requirements
- Windows/Mac/Linux
- Rust toolchain installed (`cargo --version`)
- Node.js 18+ (`node --version`)
- Desktop and Mobile on same local network (WiFi)

### Mobile Requirements
- Android device/emulator with camera
- OR iOS device/simulator with camera
- React Native development environment set up
- USB debugging enabled (Android) or Xcode configured (iOS)

---

## Test Setup

### Step 1: Start Desktop App

```bash
cd apps/desktop
npm run tauri:dev
```

**Expected**: Tauri app window opens showing Device Pairing screen

### Step 2: Start Mobile App

**Android**:
```bash
cd apps/mobile
npm start
# In another terminal:
npm run android
```

**iOS**:
```bash
cd apps/mobile
npm start
# In another terminal:
npm run ios
```

**Expected**: Metro bundler starts, app loads on device/simulator

---

## Test Cases

### Test 1: QR Code Generation (Desktop)

**Steps**:
1. Open Desktop app
2. Navigate to "Device Linking" section
3. Click "Generate QR Code"

**Expected Results**:
- QR code appears on screen
- Console shows: `Server listening on: <LOCAL_IP>:8765`
- Local IP is NOT `127.0.0.1` (should be `192.168.x.x` or `10.x.x.x`)

**Verification**:
- Check Desktop console for server start message
- Verify QR code is visible and not blank

---

### Test 2: QR Code Scanning (Mobile)

**Steps**:
1. Open Mobile app
2. Navigate to "Device Linking" screen
3. Tap "Scan QR Code"
4. Grant camera permission if prompted
5. Point camera at Desktop QR code

**Expected Results**:
- Camera opens with scanner overlay
- QR code recognized automatically
- Alert shows: "Device Linked! Successfully connected to Desktop at <IP>:8765"
- Device appears in "Linked Devices" list

**Verification**:
- Mobile console shows: `Connected to Desktop`
- Desktop console shows: `WebSocket connection established`
- Desktop console shows token validation success

---

### Test 3: Image Capture (Mobile)

**Steps**:
1. Navigate to "Recycling Task" screen
2. Tap "Take Photo"
3. Grant camera permission if prompted
4. Tap capture button
5. Photo preview appears

**Expected Results**:
- Camera opens
- Photo captured successfully
- Image displays in preview area
- "Validate & Earn Points" button appears

**Verification**:
- Image URI logged to console
- No errors in console

---

### Test 4: Image Validation (End-to-End)

**Steps**:
1. Ensure Desktop and Mobile are paired (Test 2 complete)
2. On Mobile, take photo (Test 3 complete)
3. Tap "Validate & Earn Points"
4. Wait for response

**Expected Results**:
- Mobile shows loading indicator
- Desktop console shows: `Received task: image_validation`
- Desktop console shows: `Task completed, confidence: 0.85`
- Mobile alert shows: "Validation Success! Confidence: 85%, You earned 10 points!"

**Verification**:
- **Desktop console**:
  ```
  Received WebSocket message: {"taskId":"...","taskType":"image_validation",...}
  Processing image validation task
  Sending response: {"taskId":"...","success":true,"result":{"confidence":0.85}}
  ```
- **Mobile console**:
  ```
  Sending image validation request
  Received validation response: {success: true, confidence: 0.85}
  ```

---

### Test 5: Connection Error Handling

**Steps**:
1. On Mobile, navigate to "Recycling Task"
2. Take photo WITHOUT pairing Desktop first
3. Tap "Validate & Earn Points"

**Expected Results**:
- Alert shows: "Error: Failed to validate image. Make sure you are connected to a Desktop device."

**Verification**:
- Mobile console shows error message
- App does not crash

---

### Test 6: Reconnection

**Steps**:
1. Pair Desktop and Mobile (Test 2)
2. Close Desktop app
3. Reopen Desktop app, generate new QR code
4. On Mobile, scan new QR code

**Expected Results**:
- Old connection replaced with new connection
- New device entry appears in Mobile "Linked Devices" list

**Verification**:
- No duplicate entries
- Connection works for validation

---

## Known Limitations (MVP)

- ✅ **Mock validation**: Desktop returns hardcoded 0.85 confidence (no real CV model yet)
- ✅ **No point persistence**: Points displayed in alert but not saved to storage
- ✅ **No unlock system**: Finance module not yet integrated
- ✅ **Manual pairing only**: No automatic device discovery
- ✅ **WebSocket (no TLS)**: Production should use TLS encryption

---

## Troubleshooting

### Desktop app won't start
- **Error**: `cargo: command not found`
  - **Fix**: Install Rust: https://rustup.rs/
- **Error**: `error: linking with 'link.exe' failed`
  - **Fix**: Install Visual Studio Build Tools (Windows)

### Mobile app won't start
- **Error**: `ERESOLVE unable to resolve dependency tree`
  - **Fix**: `npm install --legacy-peer-deps`
- **Error**: `Unable to resolve module...`
  - **Fix**: `npm start -- --reset-cache`

### QR scan fails
- **Error**: Camera not opening
  - **Fix**: Check camera permissions in device settings
- **Error**: "Invalid QR Code"
  - **Fix**: Verify Desktop QR generated successfully, try regenerating

### Connection fails
- **Error**: "Connection Failed"
  - **Fix**: Ensure Desktop and Mobile on same WiFi network
  - **Fix**: Check firewall settings (allow port 8765)
  - **Fix**: Verify Desktop shows correct local IP (not 127.0.0.1)

### Image validation times out
- **Error**: 30-second timeout reached
  - **Fix**: Check Desktop console for errors
  - **Fix**: Verify WebSocket connection is active
  - **Fix**: Restart both apps and re-pair

---

## Success Criteria

All tests pass:
- [x] Desktop generates QR with real local IP
- [x] Mobile scans QR and connects successfully
- [x] Mobile camera captures images
- [x] Image validation request sent from Mobile to Desktop
- [x] Desktop processes validation and returns mock response
- [x] Mobile displays validation result

**Next Phase**: Implement ProgressService (point persistence) and ONNX model integration
