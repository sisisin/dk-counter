window.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#scoredb').addEventListener('change', (e) => {
    appEvents.sendScoreDBPath(e.target.files[0].path);
    e.target.value = '';
  });

  document.querySelector('#authorize-twitter-anchor').addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    appEvents.sendTwitterAnchorClicked();
  });

  document.querySelector('#pin-submit').addEventListener('click', () => {
    const pinInput = document.querySelector('#twitter-pin');
    const pin = pinInput.value;
    appEvents.sendAuthorizeTwitterClicked(pin);
  });

  document.querySelector('#tweet-daken-count').addEventListener('click', () => {
    appEvents.sendTweetClicked();
  });
});
