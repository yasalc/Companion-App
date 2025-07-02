# Building Zoom Connection Plugin EXE for Student Download

## Quick Setup (One-Time Only)

### Step 1: Install Node.js
1. Download Node.js from https://nodejs.org/ (choose LTS version)
2. Install with default settings
3. Restart your computer after installation

### Step 2: Build the EXE
1. Open Command Prompt as Administrator
2. Navigate to your project folder:
   ```
   cd path\to\your\project\companion-app
   ```
3. Install dependencies (first time only):
   ```
   npm install
   ```
4. Build the Windows installer:
   ```
   npm run build:win
   ```

### Step 3: Find Your EXE
- The installer will be created in: `companion-app\dist\`
- Look for a file like: `Zoom Connection Plugin Setup 1.0.0.exe`
- This is the file students need to download!

## Hosting the EXE File

### Option 1: Upload to Your Website
1. Upload the .exe file to your web server
2. Place it in a downloads folder: `/downloads/ZoomConnectionPlugin.exe`
3. Update the download link in the student portal (see instructions below)

### Option 2: Use Cloud Storage
1. Upload to Google Drive, Dropbox, or similar
2. Get a direct download link
3. Update the download link in the student portal

## Updating the Student Portal

Once you have the .exe file hosted, update this line in `movkafqkx8.html`:

```javascript
// Find this line around line 4415:
const COMPANION_DOWNLOAD_URL = 'https://yoursite.com/downloads/ZoomConnectionPlugin.exe';

// Replace with your actual download URL
```

## File Size and Requirements
- Expected file size: 50-150 MB (normal for Electron apps)
- Students need Windows 7 or newer
- No additional software required for students
- The installer will handle everything automatically

## Testing the EXE
1. Test the installer on a clean Windows machine
2. Verify the app starts and appears in system tray
3. Check that it connects to your web portal
4. Make sure it runs at startup (if desired)

## Troubleshooting

### Build Fails?
- Make sure you're using Administrator command prompt
- Try deleting `node_modules` folder and running `npm install` again
- Ensure you have at least 2GB free disk space

### EXE Too Large?
- This is normal for Electron apps
- Students download once and it works forever
- Consider mentioning file size in download instructions

### Antivirus Issues?
- Some antivirus software flags unsigned executables
- For production, consider code signing (optional but recommended)
- Add instructions for students to allow the app if needed

## Next Steps After Building
1. Upload the .exe to your server
2. Update the download URL in the web portal
3. Test the entire flow: download → install → connect → watch recordings
4. Distribute the new download link to students

Your students will now be able to download and install the "Zoom Connection Plugin" with just one click!