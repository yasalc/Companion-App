# Zoom Connection Plugin - GitHub Repository

This repository contains the source code and build automation for the Zoom Connection Plugin, a desktop application that enhances the experience when watching Zoom class recordings.

## 🚀 Quick Start for Developers

### Repository Setup
1. **Clone this repository** to your GitHub account
2. **Make it public** (required for GitHub releases)
3. **Update the repository name** in your web application

### Automatic Building
- **Triggers**: Pushes to main/master branch (in companion-app folder)
- **Platforms**: Windows, macOS, Linux
- **Output**: Automatic releases with downloadable installers
- **Duration**: 5-10 minutes per build

### First Release
1. Push any change to the `companion-app` folder
2. Wait for GitHub Actions to complete (check Actions tab)
3. New release will appear in Releases section
4. Students can now download directly from your web portal

## 📁 Repository Structure

```
├── companion-app/              # Main application source
│   ├── main.js                # Electron main process
│   ├── app/                   # UI and renderer process
│   ├── assets/                # Icons and resources
│   ├── package.json           # Dependencies and build config
│   └── README.md              # User documentation
├── .github/workflows/          # Build automation
│   └── build-companion.yml    # CI/CD pipeline
├── GITHUB_SETUP_GUIDE.md      # Setup instructions
└── README.md                  # This file
```

## 🔧 Development

### Local Development
```bash
cd companion-app
npm install
npm start                # Run in development mode
```

### Building Locally
```bash
npm run build           # Build for all platforms
npm run build:win       # Windows only
npm run build:mac       # macOS only
npm run build:linux     # Linux only
```

### Version Management
- Update version in `companion-app/package.json`
- Push changes to trigger new release
- Releases are automatically versioned and tagged

## 🌐 Web Integration

Your web application should be configured to point to this repository:

```javascript
// In your student portal (movkafqkx8.html)
const GITHUB_REPO = 'yourusername/yourrepository';
```

This enables:
- ✅ Automatic OS detection for downloads
- ✅ Latest version information display
- ✅ Direct download links from GitHub releases
- ✅ Cross-platform installer distribution

## 📦 Release Assets

Each release automatically includes:
- **`ZoomConnectionPlugin-Setup.exe`** - Windows installer (~80-120 MB)
- **`ZoomConnectionPlugin.dmg`** - macOS installer (~90-130 MB)
- **`ZoomConnectionPlugin.AppImage`** - Linux installer (~85-125 MB)

## 🎯 Student Experience

### Download Process
1. Student visits your portal
2. Clicks "Download Plugin"
3. System detects their OS automatically
4. Downloads appropriate installer
5. Follows platform-specific installation instructions

### Installation
- **Windows**: Run .exe → Setup wizard → Auto-start
- **macOS**: Open .dmg → Drag to Applications → Launch
- **Linux**: Make executable → Run AppImage

## 🔒 Security & Privacy

### Code Transparency
- ✅ Full source code available for review
- ✅ No hidden functionality or data collection
- ✅ Open build process via GitHub Actions
- ✅ Deterministic builds from source

### Student Privacy
- ✅ All communication stays localhost
- ✅ No personal data transmitted
- ✅ No internet connection required after installation
- ✅ Students can uninstall anytime

## 📊 Analytics & Monitoring

### GitHub Insights
- View download statistics in Releases section
- Monitor build success/failure in Actions tab
- Track version adoption over time

### Build Status
- ✅ Successful builds create releases automatically
- ❌ Failed builds are visible in Actions tab
- 📧 Email notifications for build failures

## 🛠 Customization

### Release Notes
Edit `.github/workflows/build-companion.yml` to customize release descriptions.

### Build Configuration
Modify `companion-app/package.json` for:
- Application name and description
- Build targets and options
- Dependencies and versions

### Branding
Update assets in `companion-app/assets/` for:
- Application icons
- Installer graphics
- System tray icons

## 📞 Support

### For Students
- Installation issues → Contact course administrator
- Technical problems → Check troubleshooting in companion-app/README.md
- System requirements → See platform-specific requirements

### For Developers
- Build failures → Check GitHub Actions logs
- Release issues → Verify repository is public
- API problems → Test GitHub API endpoints manually

## 🚀 Deployment Checklist

- [ ] Repository is public on GitHub
- [ ] GitHub Actions are enabled
- [ ] Repository name updated in web app
- [ ] First successful build completed
- [ ] Release assets are downloadable
- [ ] Web app detects and downloads correctly
- [ ] Installation tested on target platforms

## 📝 License

This software is provided for educational use with Attorney's At Law Classes.

## 🔄 Updates & Maintenance

### Updating the Plugin
1. Make changes in `companion-app/` folder
2. Update version in `package.json` (optional)
3. Commit and push to repository
4. GitHub automatically builds and releases
5. Students get new version on next download

### Monitoring
- Check Actions tab regularly for build status
- Review download statistics in Releases
- Monitor student feedback for issues

---

**Ready to deploy?** Follow the [GITHUB_SETUP_GUIDE.md](GITHUB_SETUP_GUIDE.md) for step-by-step instructions!