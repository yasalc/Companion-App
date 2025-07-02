# Zoom Connection Plugin - Deployment Guide

## Overview
This guide helps you create a downloadable .exe file that students can install with one click.

## Quick Start (For Non-Technical Users)

### Step 1: Build the EXE (One Time Setup)
1. **Install Node.js**
   - Go to https://nodejs.org/
   - Download the LTS version (recommended)
   - Install with default settings
   - **Restart your computer**

2. **Build the Installer**
   - Open the `companion-app` folder
   - Double-click `SIMPLE_BUILD_SCRIPT.bat`
   - Wait 2-5 minutes for it to complete
   - The script will create a file like `Zoom Connection Plugin Setup 1.0.0.exe`

### Step 2: Host the EXE File
Upload the .exe file to your website so students can download it.

**Option A: Your Web Server**
```
Upload to: yoursite.com/downloads/ZoomConnectionPlugin.exe
```

**Option B: Cloud Storage**
- Upload to Google Drive, Dropbox, or OneDrive
- Get a direct download link
- Make sure the link downloads the file directly (not a preview page)

### Step 3: Update the Download Link
1. Open `movkafqkx8.html` in a text editor
2. Find this line (around line 4430):
   ```javascript
   const COMPANION_DOWNLOAD_URL = 'https://yourdomain.com/downloads/ZoomConnectionPlugin.exe';
   ```
3. Replace with your actual download URL:
   ```javascript
   const COMPANION_DOWNLOAD_URL = 'https://yoursite.com/downloads/ZoomConnectionPlugin.exe';
   ```
4. Update the file size if needed:
   ```javascript
   const COMPANION_FILE_SIZE = '~85 MB'; // Update this to match your actual file size
   ```

## Testing the Complete Flow

### Test 1: Download
1. Go to your student portal
2. Click "Download Plugin"
3. Verify the download starts automatically
4. Check that the downloaded file runs without errors

### Test 2: Installation
1. Run the downloaded .exe on a clean Windows machine
2. Follow the installation wizard
3. Check that the app appears in the system tray
4. Verify it connects to your web portal

### Test 3: Integration
1. Open the student portal
2. Verify it shows "Connected to Zoom services"
3. Try accessing a recording
4. Confirm the recording plays successfully

## File Information
- **Expected file size:** 50-150 MB (normal for Electron apps)
- **Windows compatibility:** Windows 7 and newer
- **Installation time:** 30-60 seconds
- **Internet required:** Only for downloading and connecting to your portal

## Student Instructions (Copy this for students)

### How to Install Zoom Connection Plugin

1. **Download the Plugin**
   - Go to the student portal
   - Click "Download Plugin" 
   - Save the file when prompted

2. **Install the Plugin**
   - Run the downloaded file (ZoomConnectionPlugin.exe)
   - Click "Yes" if Windows asks for permission
   - Follow the installation wizard
   - The plugin will start automatically

3. **Verify Installation**
   - Return to the student portal
   - Look for "Connected to Zoom services" 
   - You can now watch class recordings

4. **Troubleshooting**
   - If antivirus blocks the file, temporarily disable it during installation
   - The plugin icon appears in your system tray (bottom-right corner)
   - Restart your computer if connection issues persist

## Advanced Configuration

### Updating the App
To release a new version:
1. Update version in `package.json`
2. Rebuild using the build script
3. Replace the old .exe file with the new one
4. The app will auto-update when students restart it

### Antivirus Issues
If students report antivirus warnings:
1. The warnings are false positives (common with unsigned executables)
2. Consider code signing for production (requires certificate purchase)
3. Provide instructions for adding exceptions

### Download Analytics
To track downloads:
1. Use your web server's access logs
2. Monitor the download URL for 200 vs 404 responses
3. Track installation success via WebSocket connections

## Security Notes
- The app only monitors for screen recording software
- No personal data is collected or transmitted
- All communication stays on localhost (port 8080)
- Students can uninstall anytime via Windows Control Panel

## Support Script
Create this text file for easy student support:

```
Zoom Connection Plugin Support

Download Link: [YOUR_DOWNLOAD_URL]
File Size: ~85 MB
Requirements: Windows 7 or newer

Common Issues:
1. Download fails → Check internet connection, try different browser
2. Installation blocked → Temporarily disable antivirus
3. Connection issues → Restart computer, check Windows Firewall
4. App not starting → Run as Administrator once

Contact: [YOUR_SUPPORT_EMAIL]
```

Your students now have a professional, one-click installation experience!