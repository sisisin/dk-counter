const sqlite3 = require('sqlite3').verbose();

module.exports = { countTodayDaken, getDakenCountBy };

function countTodayDaken(scoreDBPath) {
  const db = new sqlite3.Database(scoreDBPath);

  return new Promise((resolve, reject) => {
    db.all(
      `
    select date(datetime(\`date\`, 'unixepoch'), 'localtime') dt ,sum(notes) noteCount from score
    group by dt
    ;`,
      (err, rows) => {
        if (err) return reject(err);

        resolve(rows);
      },
    );
  }).finally(() => {
    db.close();
  });
}

function getDakenCountBy(scoreDBPath, { from, to }) {
  const db = new sqlite3.Database(scoreDBPath);
  db.on('profile', (sql) => {});
  return new Promise((resolve, reject) => {
    db.get(
      `
    select date(datetime(\`date\`, 'unixepoch'), 'localtime') dakenDate ,sum(notes) noteCount
    from score
    where date between ? and ?`,
      [from.getTime() / 1000, to.getTime() / 1000],
      (err, row) => {
        if (err) return reject(err);
        resolve(row);
      },
    );
  }).finally(() => {
    db.close();
  });
}
