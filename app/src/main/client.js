const fetch = require('node-fetch');

class Client {
  constructor(endpoint, openExternal, isPackaged, logger) {
    this.endpoint = endpoint;
    this.openExternal = openExternal;
    this.isPackaged = isPackaged;
    this.logger = logger;
  }

  signInWithTwitter() {
    this.openExternal(`${this.endpoint}/twitter/auth`);
  }
  authorizeTwitter(pin) {
    return fetch(`${this.endpoint}/twitter/auth/pin?pin=${pin}`).then((res) => res.json());
  }

  tweet(newest, token, secret) {
    const body = {
      accessToken: token,
      accessSecret: secret,
      message: `${newest.dt} の打鍵数は ${newest['sum(notes)']}`,
    };
    this.logger.log(body);

    if (this.isPackaged) {
      return fetch(`${this.endpoint}/twitter/tweet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
    } else {
      return Promise.resolve({});
    }
  }
}

module.exports = { Client };
