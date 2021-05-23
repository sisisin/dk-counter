// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
    },
  });

  mainWindow.loadFile('src/renderer-dist/index.html');

  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

const Store = require('electron-store');

const store = new Store();
const { countTodayDaken } = require('./score-db');
const { Client } = require('./client');
const { Logger } = require('./logger');
const endpoint = 'https://us-central1-daken-counter-4be99.cloudfunctions.net';
const logger = new Logger(app.isPackaged);
const client = new Client(endpoint, shell.openExternal, app.isPackaged, logger);

ipcMain.on('foo', (event, arg) => {
  store.set('oraja.scoredbPath', arg);
});

ipcMain.on('clickTwitterAnchor', () => {
  client.signInWithTwitter();
});

ipcMain.on('authorizeTwitter', async (event, arg) => {
  const res = await client.authorizeTwitter(arg);
  store.set('twitter', res);
});

ipcMain.on('tweet', async () => {
  const { token, secret } = store.get('twitter') ?? {};
  const scoredbPath = store.get('oraja.scoredbPath');
  const dakens = await countTodayDaken(scoredbPath);

  const newest = dakens.pop();

  client.tweet(newest, token, secret);
});
