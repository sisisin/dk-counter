// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, shell, dialog } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');
const packageJson = require('../../package.json');

let mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: `daken-counter v${packageJson.version}`,
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
    },
  });

  mainWindow.setMenu(null);
  mainWindow.loadFile('src/renderer-dist/index.html');

  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }
}

autoUpdater.on('update-downloaded', async (info) => {
  const opts = {
    type: 'info',
    buttons: ['更新して再起動'],
    message: 'アップデート',
    detail: '新しいバージョンをダウンロードしました。再起動して更新を適用します',
  };

  await dialog.showMessageBox(mainWindow, opts);
  autoUpdater.quitAndInstall();
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  autoUpdater.checkForUpdatesAndNotify();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

const Store = require('electron-store');

const { countTodayDaken, getDakenCountBy } = require('./score-db');
const { Client } = require('./client');
const { Logger } = require('./logger');
const store = new Store({
  defaults: {
    twitter: {},
    oraja: {},
    dakenCountTemplate: '%daken_time%は%daken_count%ノーツ叩いた',
  },
});
const endpoint = 'https://us-central1-daken-counter-4be99.cloudfunctions.net';
const logger = new Logger(app.isPackaged);
const client = new Client(endpoint, shell.openExternal, app.isPackaged, logger);

ipcMain.on('foo', (event, arg) => {
  store.set('oraja.scoredbPath', arg);
  event.reply('storeUpdated', getAppState());
});

ipcMain.on('clickTwitterAnchor', () => {
  client.signInWithTwitter();
});

ipcMain.on('authorizeTwitter', async (event, arg) => {
  const res = await client.authorizeTwitter(arg);
  store.set('twitter', res);
  event.reply('storeUpdated', getAppState());
});

ipcMain.on('tweetTemplateSaveRequested', (event, template) => {
  store.set('dakenCountTemplate', template);
  event.reply('storeUpdated', getAppState());
});

ipcMain.on('tweet', async (event, message) => {
  const { token, secret } = store.get('twitter');
  client.tweet(message, token, secret);
});

ipcMain.handle('getStore', () => {
  return getAppState();
});

ipcMain.handle('getDakenCountBy', (event, { from, to }) => {
  const scoredbPath = store.get('oraja.scoredbPath');

  return getDakenCountBy(scoredbPath, { from, to });
});

function getAppState() {
  const twitter = store.get('twitter');
  const oraja = store.get('oraja');
  const dakenCountTemplate = store.get('dakenCountTemplate');
  return { twitter, oraja, dakenCountTemplate };
}
