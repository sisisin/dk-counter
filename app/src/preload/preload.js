// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { ipcRenderer, contextBridge } = require('electron');

const handlers = [];
ipcRenderer.on('storeUpdated', (event, state) => {
  handlers.forEach((cb) => cb(state));
});

contextBridge.exposeInMainWorld('appEvents', {
  sendTweetClicked: () => ipcRenderer.send('tweet'),
  store: {
    dispatch(eventType, ...args) {
      ipcRenderer.send(eventType, ...args);
    },

    subscribe(cb) {
      handlers.push(cb);

      return () => handlers.filter((handler) => handler !== cb);
    },
    getState: () => ipcRenderer.invoke('getStore'),
  },
});
