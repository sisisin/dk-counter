import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);

declare const appEvents;

window.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#scoredb').addEventListener('change', (e: any) => {
    appEvents.sendScoreDBPath(e.target.files[0].path);
    e.target.value = '';
  });

  document.querySelector('#authorize-twitter-anchor').addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    appEvents.sendTwitterAnchorClicked();
  });

  document.querySelector('#pin-submit').addEventListener('click', () => {
    const pin = (document.querySelector('#twitter-pin') as HTMLInputElement).value;

    appEvents.sendAuthorizeTwitterClicked(pin);
  });

  document.querySelector('#tweet-daken-count').addEventListener('click', () => {
    appEvents.sendTweetClicked();
  });
});
