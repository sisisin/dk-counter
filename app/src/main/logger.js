class Logger {
  constructor(isPackaged) {
    this.isPackaged = isPackaged;
  }
  log(...args) {
    if (!this.isPackaged) console.log(...args);
  }
}

module.exports = { Logger };
