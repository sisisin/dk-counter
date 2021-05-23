// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('appEvents', {
  sendTwitterAnchorClicked: () => ipcRenderer.send('clickTwitterAnchor'),
  sendAuthorizeTwitterClicked: (pin) => ipcRenderer.send('authorizeTwitter', pin),
  sendScoreDBPath: (path) => ipcRenderer.send('foo', path),
  sendTweetClicked: () => ipcRenderer.send('tweet'),
  store: {
    getState: () => ipcRenderer.invoke('getStore'),
  },
});
