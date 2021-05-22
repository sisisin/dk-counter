// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type]);
  }

  const input = document.querySelector('#scoredb');
  console.log(input);

  input.addEventListener('change', (e) => {
    ipcRenderer.send('foo', e.target.files[0].path);
    e.target.value = '';
  });

  const authorizeTwitterAnchor = document.querySelector('#authorize-twitter-anchor');
  authorizeTwitterAnchor.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    ipcRenderer.send('clickTwitterAnchor');
  });

  const pinSubmit = document.querySelector('#pin-submit');
  pinSubmit.addEventListener('click', () => {
    const pinInput = document.querySelector('#twitter-pin');
    const pin = pinInput.value;
    ipcRenderer.send('authorizeTwitter', pin);
  });

  document.querySelector('#tweet-daken-count').addEventListener('click', () => {
    ipcRenderer.send('tweet');
  });
});
