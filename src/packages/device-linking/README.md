# @zelara/device-linking

Device linking and task offloading protocol for Zelara.

## Usage

### Desktop (Server)

```typescript
import { PairingManager } from '@zelara/device-linking';

const pairingManager = new PairingManager();

// Generate QR code for pairing
const deviceInfo = {
  id: 'desktop-123',
  name: 'My Desktop',
  platform: 'desktop',
  capabilities: ['cv', 'calculations'],
  ipAddress: '192.168.1.100',
  port: 8765,
};

const token = pairingManager.generatePairingToken(deviceInfo);
// Display token as QR code for mobile to scan
```

### Mobile (Client)

```typescript
import { PairingManager, TaskOffloader } from '@zelara/device-linking';

const pairingManager = new PairingManager();
const taskOffloader = new TaskOffloader();

// Scan QR code, get token
const scannedToken = /* from QR scanner */;

// Pair with desktop
await pairingManager.pairDevice(scannedToken, mobileDeviceInfo);

// Offload image validation task
const request = taskOffloader.createImageValidationRequest(imageData);
const response = await taskOffloader.offloadTask(request);

if (response.success) {
  console.log('Validation result:', response.result);
}
```

## Platform Implementation

Each platform app must implement network communication:

- **Desktop**: WebSocket or HTTP server
- **Mobile**: WebSocket or HTTP client
- Both: TLS encryption for security

## Development

```bash
npm install
npm run build
npm run dev
```
