const { app, BrowserWindow, screen, Notification, session } = require('electron');
// const { enableLiveReload } = require('electron-compile');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const isDevMode = !app.isPackaged;
const autoFullScreen = isDevMode ? false : true; // 自动把另外两个屏幕全屏到两个副屏幕
let HTML_BASE = isDevMode ? 'http://localhost:3000' : `file://${__dirname + '/view/'}`;

console.log('execPath', process.execPath, 'isDevMode', isDevMode, 'HTML_BASE', HTML_BASE)
// if (isDevMode) enableLiveReload();

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1080,
    height: 700,
    frame: true,
    autoHideMenuBar: false,
    webPreferences: {
      nodeIntegration: false,
      preload: __dirname + '/preload.js'
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`${HTML_BASE}/index.html`);

  // Open the DevTools.
  if (isDevMode) {
    console.log('isDevMode=', isDevMode);
    const path = require('path');
    session.defaultSession.loadExtension(path.join(__dirname, '../devtools/react-devtools'))
      .then(({ name }) => {
        console.log(`Added Extension:  ${name}`);
        mainWindow.webContents.openDevTools();
      })
      .catch((err) => console.log('installExtension error: ', err));
  }
  require('./events')({ mainWindow })

};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
