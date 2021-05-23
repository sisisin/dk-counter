// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#scoredb').addEventListener('change', (e) => {
    ipcRenderer.send('foo', e.target.files[0].path);
    e.target.value = '';
  });

  document.querySelector('#authorize-twitter-anchor').addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    ipcRenderer.send('clickTwitterAnchor');
  });

  document.querySelector('#pin-submit').addEventListener('click', () => {
    const pinInput = document.querySelector('#twitter-pin');
    const pin = pinInput.value;
    ipcRenderer.send('authorizeTwitter', pin);
  });

  document.querySelector('#tweet-daken-count').addEventListener('click', () => {
    ipcRenderer.send('tweet');
  });
});
