const { app, BrowserWindow, Tray, Menu, nativeImage, dialog, shell, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const WebSocket = require('ws');
const psList = require('ps-list');
const Store = require('electron-store');
const log = require('electron-log');
const { autoUpdater } = require('electron-updater');
const si = require('systeminformation');

// Configure logging
log.transports.file.level = 'debug';
log.info('Application Starting...');

// Configuration store
const store = new Store({
  schema: {
    firstRun: {
      type: 'boolean',
      default: true
    },
    autoLaunch: {
      type: 'boolean',
      default: true
    },
    userId: {
      type: 'string',
      default: ''
    },
    studentName: {
      type: 'string',
      default: ''
    }
  }
});

// List of recording software to detect
const RECORDING_SOFTWARE = [
  { name: 'OBS Studio', processes: ['obs64.exe', 'obs32.exe', 'obs'] },
  { name: 'Xbox Game Bar', processes: ['gamebar.exe', 'GameBar.exe', 'GameBarFTServer.exe'] },
  { name: 'NVIDIA ShadowPlay', processes: ['nvcontainer.exe'], windowNames: ['NVIDIA Share', 'NVIDIA ShadowPlay'] },
  { name: 'Bandicam', processes: ['bandicam.exe'] },
  { name: 'Camtasia', processes: ['camtasiastudio.exe', 'camtasia.exe'] },
  { name: 'Fraps', processes: ['fraps.exe'] },
  { name: 'Action!', processes: ['action.exe'] },
  { name: 'ScreenCastify', processes: ['screencastify'] },
  { name: 'ScreenRec', processes: ['screenrec.exe'] },
  { name: 'Movavi Screen Recorder', processes: ['movaviscreenrecorder.exe'] },
];

// Global variables
let mainWindow = null;
let tray = null;
let wss = null;
let connections = new Set();
let isAppQuitting = false;
let detectionInterval = null;
let currentUser = {
  id: store.get('userId', ''),
  name: store.get('studentName', '')
};
let isRecording = false;
let detectedSoftware = null;

// Port for WebSocket
const WS_PORT = 8080;

// Create main application window
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 300,
    show: false, // Hidden by default, only show for setup
    icon: path.join(__dirname, 'assets/icon.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    resizable: false,
    minimizable: false,
    maximizable: false,
    skipTaskbar: true,
    title: 'Zoom Connection Plugin'
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'app/index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Prevent window from being destroyed, hide it instead
  mainWindow.on('close', (event) => {
    if (!isAppQuitting) {
      event.preventDefault();
      mainWindow.hide();
      return false;
    }
    return true;
  });

  // Check if this is the first run, if so show the setup window
  if (store.get('firstRun', true)) {
    mainWindow.once('ready-to-show', () => {
      mainWindow.show();
    });
  }

  // Debug purposes - open developer tools
  // mainWindow.webContents.openDevTools();
}

// Create system tray icon
function createTray() {
  // Create system tray icon
  const iconPath = path.join(__dirname, 'assets/tray-icon.png');
  const trayIcon = nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 });
  
  tray = new Tray(trayIcon);
  tray.setToolTip('Zoom Connection Plugin');
  
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Zoom Connection Plugin', enabled: false },
    { type: 'separator' },
    { 
      label: 'Status: Connected to Zoom',
      enabled: false,
      id: 'status'
    },
    { 
      label: currentUser.name ? `User: ${currentUser.name}` : 'Not logged in',
      enabled: false,
      id: 'user'
    },
    { type: 'separator' },
    { 
      label: 'Connect to Zoom Meeting', 
      click: () => {
        if (mainWindow) {
          mainWindow.show();
        }
      }
    },
    { type: 'separator' },
    { 
      label: 'Quit', 
      click: () => {
        isAppQuitting = true;
        app.quit();
      }
    }
  ]);
  
  tray.setContextMenu(contextMenu);
  
  // Show the window when clicking the tray icon
  tray.on('click', () => {
    if (mainWindow) {
      mainWindow.show();
    }
  });
}

// Initialize WebSocket Server
function initWebSocketServer() {
  try {
    if (wss) {
      wss.close();
    }
    
    wss = new WebSocket.Server({ port: WS_PORT });
    log.info(`WebSocket server started on port ${WS_PORT}`);

    wss.on('connection', (ws, req) => {
      log.info(`New connection from ${req.socket.remoteAddress}`);
      connections.add(ws);

      // Send initial status to the web app
      sendStatusToWebSocket(ws);

      // Handle messages from web application
      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);
          log.info('Received message:', data);
          
          if (data.type === 'SET_USER') {
            currentUser = {
              id: data.userId || '',
              name: data.name || ''
            };
            
            // Update stored user info
            store.set('userId', currentUser.id);
            store.set('studentName', currentUser.name);
            
            // Update tray menu
            updateTrayMenu();
            
            // Send confirmation back
            ws.send(JSON.stringify({
              type: 'USER_SET',
              success: true,
              userId: currentUser.id
            }));
          }
        } catch (error) {
          log.error('Error handling WebSocket message:', error);
        }
      });

      // Handle disconnection
      ws.on('close', () => {
        log.info('Connection closed');
        connections.delete(ws);
      });
      
      // Handle errors
      ws.on('error', (error) => {
        log.error('WebSocket error:', error);
        connections.delete(ws);
      });
    });

    // Handle server errors
    wss.on('error', (error) => {
      log.error('WebSocket server error:', error);
      
      // Try to restart the server after a delay
      setTimeout(() => {
        initWebSocketServer();
      }, 5000);
    });
  } catch (error) {
    log.error('Error initializing WebSocket server:', error);
    
    // Try to restart the server after a delay
    setTimeout(() => {
      initWebSocketServer();
    }, 5000);
  }
}

// Send status to a specific WebSocket connection
function sendStatusToWebSocket(ws) {
  try {
    ws.send(JSON.stringify({
      type: 'STATUS_UPDATE',
      isRecording: isRecording,
      detectedSoftware: detectedSoftware,
      companionVersion: app.getVersion(),
      userId: currentUser.id,
      timestamp: new Date().toISOString()
    }));
  } catch (error) {
    log.error('Error sending status to WebSocket:', error);
  }
}

// Send status to all connected clients
function broadcastStatus() {
  connections.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      sendStatusToWebSocket(ws);
    }
  });
}

// Update tray menu with current status
function updateTrayMenu() {
  if (!tray) return;
  
  // In the fake Zoom plugin, we don't show recording status to the user
  const statusLabel = connections.size > 0
    ? `✅ Connected to Zoom` 
    : `❌ Not connected to Zoom`;
    
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Zoom Connection Plugin', enabled: false },
    { type: 'separator' },
    { 
      label: statusLabel,
      enabled: false,
      id: 'status'
    },
    { 
      label: currentUser.name ? `User: ${currentUser.name}` : 'Not logged in',
      enabled: false,
      id: 'user'
    },
    { type: 'separator' },
    { 
      label: 'Connect to Zoom', 
      click: () => {
        if (mainWindow) {
          mainWindow.show();
        }
      }
    },
    { type: 'separator' },
    { 
      label: 'Quit', 
      click: () => {
        isAppQuitting = true;
        app.quit();
      }
    }
  ]);
  
  tray.setContextMenu(contextMenu);
}

// Check for recording software
async function checkForRecordingSoftware() {
  try {
    // Get list of running processes
    const processes = await psList();
    
    // Check for recording software
    let foundRecording = false;
    let softwareName = null;
    
    for (const software of RECORDING_SOFTWARE) {
      const foundProcess = processes.find(process => 
        software.processes.some(p => 
          process.name.toLowerCase() === p.toLowerCase() || 
          process.name.toLowerCase().includes(p.toLowerCase())
        )
      );
      
      if (foundProcess) {
        foundRecording = true;
        softwareName = software.name;
        break;
      }
    }
    
    // If status changed, update it
    if (foundRecording !== isRecording || detectedSoftware !== softwareName) {
      isRecording = foundRecording;
      detectedSoftware = softwareName;
      
      // Update tray menu
      updateTrayMenu();
      
      // Send status to all connected clients
      broadcastStatus();
      
      // Log the detection
      if (isRecording) {
        log.info(`Recording software detected: ${detectedSoftware}`);
      } else if (detectedSoftware !== softwareName) {
        log.info('No recording software detected');
      }
      
      // Send to main window
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('recording-status', { isRecording, detectedSoftware });
      }
    }
  } catch (error) {
    log.error('Error checking for recording software:', error);
  }
}

// Start monitoring for recording software
function startMonitoring() {
  // Clear existing interval if it exists
  if (detectionInterval) {
    clearInterval(detectionInterval);
  }
  
  // Set up interval for checking recording software (every 5 seconds)
  detectionInterval = setInterval(() => {
    checkForRecordingSoftware();
  }, 5000);
  
  // Run an initial check
  checkForRecordingSoftware();
}

// Setup auto updater
function setupAutoUpdater() {
  autoUpdater.logger = log;
  autoUpdater.checkForUpdatesAndNotify();
  
  autoUpdater.on('update-available', () => {
    log.info('Update available');
  });
  
  autoUpdater.on('update-downloaded', () => {
    log.info('Update downloaded');
    dialog.showMessageBox({
      type: 'info',
      title: 'Update Ready',
      message: 'A new version has been downloaded. Restart the application to apply the updates.',
      buttons: ['Restart', 'Later']
    }).then((returnValue) => {
      if (returnValue.response === 0) {
        autoUpdater.quitAndInstall();
      }
    });
  });
}

// Handle IPC messages from the renderer process
function setupIPC() {
  ipcMain.on('set-first-run-complete', () => {
    store.set('firstRun', false);
    mainWindow.hide();
  });
  
  ipcMain.on('get-system-info', async (event) => {
    const systemInfo = {
      os: await si.osInfo(),
      cpu: await si.cpu(),
      system: await si.system(),
      memory: await si.mem()
    };
    event.reply('system-info', systemInfo);
  });
  
  ipcMain.on('set-user-info', (event, { userId, name }) => {
    currentUser = { id: userId, name };
    store.set('userId', userId);
    store.set('studentName', name);
    updateTrayMenu();
    event.reply('user-info-set', true);
  });
  
  ipcMain.on('check-recording-now', () => {
    checkForRecordingSoftware();
  });
  
  // New handlers for the Zoom plugin UI
  ipcMain.on('check-first-run', (event) => {
    event.reply('first-run-status', store.get('firstRun', true));
  });

  ipcMain.on('check-connection-status', (event) => {
    event.reply('connection-status', connections.size > 0);
  });

  ipcMain.on('connect-to-zoom', () => {
    log.info('Connect to Zoom requested');
    // This actually doesn't connect to Zoom, but it will give the appearance
    // that it's doing something by updating the UI status
    if (mainWindow) {
      mainWindow.webContents.send('connection-status', true);
    }
  });

  ipcMain.on('hide-window', () => {
    if (mainWindow) {
      mainWindow.hide();
    }
  });
  
  ipcMain.on('complete-setup', () => {
    log.info('Setup completed');
    store.set('firstRun', false);
    mainWindow.hide();
  });
}

// Register protocol handler for custom URL scheme
function registerProtocolHandler() {
  if (process.defaultApp) {
    if (process.argv.length >= 2) {
      app.setAsDefaultProtocolClient('zoomconnect', process.execPath, [path.resolve(process.argv[1])])
    }
  } else {
    app.setAsDefaultProtocolClient('zoomconnect')
  }
}

// Handle custom protocol URLs
function handleProtocolUrls() {
  // Windows: handle customerprotocol://path/ URLs
  app.on('second-instance', (event, commandLine) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
    
    const url = commandLine.pop();
    if (url) {
      processProtocolUrl(url);
    }
  });
  
  // macOS: handle customerprotocol://path/ URLs
  app.on('open-url', (event, url) => {
    event.preventDefault();
    processProtocolUrl(url);
  });
}

// Process custom protocol URLs
function processProtocolUrl(urlStr) {
  try {
    const parsed = new URL(urlStr);
    if (parsed.protocol === 'zoomconnect:') {
      const userId = parsed.searchParams.get('userId');
      const name = parsed.searchParams.get('name');
      
      if (userId) {
        currentUser = {
          id: userId,
          name: name || ''
        };
        
        store.set('userId', userId);
        store.set('studentName', name || '');
        updateTrayMenu();
        
        // Send update to all connected clients
        broadcastStatus();
      }
    }
  } catch (error) {
    log.error('Error processing protocol URL:', error);
  }
}

// App events
app.on('ready', () => {
  registerProtocolHandler();
  createMainWindow();
  createTray();
  initWebSocketServer();
  startMonitoring();
  setupAutoUpdater();
  setupIPC();
  handleProtocolUrls();
});

// Prevent multiple instances of the app
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

// Quit when all windows are closed
app.on('window-all-closed', () => {
  // On macOS it's common for apps to stay active until explicitly quit
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window on dock icon click
  if (mainWindow === null) {
    createMainWindow();
  }
});

app.on('before-quit', () => {
  isAppQuitting = true;
  
  // Close WebSocket server
  if (wss) {
    wss.close();
  }
  
  // Clear detection interval
  if (detectionInterval) {
    clearInterval(detectionInterval);
  }
});