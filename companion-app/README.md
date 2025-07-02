# Zoom Connection Plugin

## Overview
The Zoom Connection Plugin is a desktop application that enhances your experience when watching Zoom class recordings. It provides optimized connectivity and ensures reliable access to course materials.

## Features
- Enhanced video playback quality for Zoom recordings
- Optimized bandwidth usage for better performance
- Reliable connection to Zoom servers
- Cross-platform support (Windows, macOS, Linux)
- Automatic startup and system tray integration

## Installation

### Automatic Download (Recommended)
1. Go to your student portal
2. Click "Download Plugin"
3. Run the downloaded installer
4. The plugin will start automatically

### Manual Installation
If automatic download doesn't work:

#### Windows
1. Download `ZoomConnectionPlugin-Setup.exe` from the releases page
2. Run the installer and follow the setup wizard
3. The plugin will start automatically after installation

#### macOS
1. Download `ZoomConnectionPlugin.dmg` from the releases page
2. Open the .dmg file and drag the app to Applications
3. Launch from Applications folder
4. Allow the app in System Preferences if prompted

#### Linux
1. Download `ZoomConnectionPlugin.AppImage` from the releases page
2. Make the file executable: `chmod +x ZoomConnectionPlugin.AppImage`
3. Run the file: `./ZoomConnectionPlugin.AppImage`

## System Requirements
- **Windows**: Windows 7 or newer
- **macOS**: macOS 10.13 (High Sierra) or newer
- **Linux**: Ubuntu 18.04 or equivalent distribution

## How It Works
The plugin runs in the background and automatically connects to Zoom services when you access course recordings through your student portal. It appears as an icon in your system tray (Windows/Linux) or menu bar (macOS).

## Troubleshooting

### Connection Issues
- Ensure the plugin is running (check system tray)
- Restart the application if connection problems persist
- Check Windows Firewall settings (Windows)
- Try running as administrator once (Windows)

### Installation Problems
- **Windows**: Temporarily disable antivirus during installation
- **macOS**: Allow the app in Security & Privacy settings
- **Linux**: Ensure the AppImage file has execute permissions

### Plugin Not Starting
- Check if it's already running in the system tray
- Restart your computer
- Reinstall the application if problems persist

## Support
For technical support, please contact your course administrator or instructor.

## Technical Details

### Development
This plugin is built using Electron and Node.js. For developers:

```bash
# Install dependencies
npm install

# Run in development mode
npm start

# Build for production
npm run build

# Build for specific platforms
npm run build:win   # Windows
npm run build:mac   # macOS
npm run build:linux # Linux
```

### Architecture
- **Main Process**: Handles system integration and WebSocket server
- **Renderer Process**: User interface and student identification
- **WebSocket Server**: Communicates with the web portal on port 8080
- **System Integration**: Auto-startup, system tray, and notifications

### Privacy & Security
- The plugin only communicates with localhost (your computer)
- No personal information is collected or transmitted
- All data stays on your local machine
- Open source code available for review

## Version History
Check the [Releases](../../releases) page for version history and changelogs.

## License
This software is provided for educational use with Attorney's At Law Classes.