# GitHub-Based Deployment Guide

## Overview
This guide helps you set up automatic building and distribution of the Zoom Connection Plugin using GitHub Actions. Students will be able to download the latest version directly from your GitHub repository with one click.

## 🚀 Quick Setup (5 minutes)

### Step 1: Create GitHub Repository
1. Go to [GitHub](https://github.com) and create a new repository
2. Make it **public** (required for GitHub releases to work with the web app)
3. Upload your entire project to this repository

### Step 2: Configure the Web App
1. Open `movkafqkx8.html`
2. Find this line (around line 4430):
   ```javascript
   const GITHUB_REPO = 'yourusername/yourrepository';
   ```
3. Replace with your actual GitHub username and repository name:
   ```javascript
   const GITHUB_REPO = 'johnsmith/attorney-law-classes';
   ```

### Step 3: Push and Build
1. Commit and push your code to GitHub
2. The GitHub Action will automatically trigger
3. Wait 5-10 minutes for the build to complete
4. Check the "Releases" section of your GitHub repository

### Step 4: Test Downloads
1. Go to your student portal
2. Click "Download Plugin"
3. Verify the download works and shows the correct file size/version

## 🔧 How It Works

### Automatic Building
- **Trigger**: Every time you push changes to the `companion-app` folder
- **Platforms**: Builds for Windows (.exe), macOS (.dmg), and Linux (.AppImage)
- **Duration**: 5-10 minutes per build
- **Output**: Creates a new GitHub release with downloadable files

### Smart Downloads
- **OS Detection**: Automatically detects student's operating system
- **Direct Download**: One-click download from GitHub releases
- **Version Info**: Shows latest version, file size, and download count
- **Fallback**: Manual platform selection available

### GitHub Releases
Your releases will be available at:
```
https://github.com/yourusername/yourrepository/releases
```

Each release includes:
- `ZoomConnectionPlugin-Setup.exe` (Windows installer)
- `ZoomConnectionPlugin.dmg` (macOS installer)
- `ZoomConnectionPlugin.AppImage` (Linux installer)

## 📱 Student Experience

### Automatic Download (Recommended)
1. Student clicks "Download Plugin"
2. System detects their OS (Windows/Mac/Linux)
3. Downloads the correct installer automatically
4. Student runs installer and plugin starts

### Manual Platform Selection
1. Student can choose specific platform from buttons
2. Downloads the selected platform's installer
3. Platform-specific installation instructions shown

### Version Information
Students see:
- Current version number
- Release date
- File size
- Download statistics

## 🛠 Advanced Configuration

### Custom Release Messages
Edit `.github/workflows/build-companion.yml` to customize release notes:
```yaml
body: |
  ## Your Custom Release Message
  - New features added
  - Bug fixes included
  - Important announcements
```

### Versioning
- Version numbers come from `companion-app/package.json`
- Update the version there to create new releases
- Format: `1.0.0`, `1.1.0`, `2.0.0`, etc.

### Build Triggers
The workflow triggers on:
- Push to main/master branch (in companion-app folder)
- Manual trigger from GitHub Actions tab
- When you create a new release manually

### File Sizes
Typical sizes:
- **Windows**: 80-120 MB
- **macOS**: 90-130 MB  
- **Linux**: 85-125 MB

## 🔒 Security Features

### Code Signing (Optional)
For production deployments, consider:
1. Windows: Get a code signing certificate
2. macOS: Apple Developer account + notarization
3. Linux: GPG signing

### Antivirus Compatibility
- Unsigned executables may trigger antivirus warnings
- This is normal for Electron apps
- Students can add exceptions if needed
- Consider code signing for production use

## 📊 Monitoring Downloads

### GitHub Analytics
View download statistics at:
```
https://github.com/yourusername/yourrepository/releases
```

Each release shows:
- Total downloads per platform
- Download history over time
- Most popular versions

### Web Analytics
The web app logs:
- OS detection results
- Download attempts
- Version information requests

## 🚨 Troubleshooting

### Build Fails
1. Check GitHub Actions tab for error details
2. Verify `package.json` has correct build scripts
3. Ensure all dependencies are listed
4. Check if repository is public

### Downloads Don't Work
1. Verify `GITHUB_REPO` variable is set correctly
2. Check if repository exists and is public
3. Ensure at least one release exists
4. Test the GitHub API URL manually

### Wrong Platform Detected
The system detects OS from `navigator.userAgent`:
- Windows: Contains "win"
- macOS: Contains "mac"  
- Linux: Contains "linux"
- Default: Windows (if detection fails)

## 🎯 Best Practices

### Repository Structure
```
your-repo/
├── companion-app/          # Electron app
├── .github/workflows/      # Build automation
├── movkafqkx8.html        # Student portal
└── README.md              # Instructions
```

### Release Management
1. Test locally before pushing
2. Use semantic versioning (1.0.0, 1.1.0, etc.)
3. Write clear release notes
4. Monitor download statistics

### Student Communication
- Announce new versions in class
- Provide download link: `https://yoursite.com/student-portal`
- Include file size in announcements
- Offer technical support for installation issues

## 🚀 Going Live

Once everything is set up:

1. **Test the complete flow**:
   - Push code → Build completes → Download works → Installation succeeds

2. **Update your documentation**:
   - Give students the student portal URL
   - Include system requirements
   - Provide installation troubleshooting

3. **Monitor and maintain**:
   - Check build status after changes
   - Update versions as needed
   - Respond to student technical issues

Your students now have a professional, automatically-updated download experience powered by GitHub!