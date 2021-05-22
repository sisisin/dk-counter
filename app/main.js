// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'src/preload.js'),
    },
  });

  mainWindow.loadFile('src/index.html');

  // mainWindow.webContents.openDevTools();
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

const fetch = require('node-fetch');
const Store = require('electron-store');

const store = new Store();
const { countTodayDaken } = require('./main-src/index');
const endpoint = 'https://us-central1-daken-counter-4be99.cloudfunctions.net';

ipcMain.on('foo', (event, arg) => {
  store.set('oraja.scoredbPath', arg);
});

ipcMain.on('clickTwitterAnchor', () => {
  shell.openExternal(`${endpoint}/twitter/auth`);
});

ipcMain.on('authorizeTwitter', async (event, arg) => {
  const res = await fetch(`${endpoint}/twitter/auth/pin?pin=${arg}`).then((res) => res.json());
  store.set('twitter', res);
});

ipcMain.on('tweet', async () => {
  const { token, secret } = store.get('twitter');
  const scoredbPath = store.get('oraja.scoredbPath');
  const dakens = await countTodayDaken(scoredbPath);

  const newest = dakens.pop();

  fetch(`${endpoint}/twitter/tweet`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      accessToken: token,
      accessSecret: secret,
      message: `${newest.dt} の打鍵数は ${newest['sum(notes)']}`,
    }),
  });
});
