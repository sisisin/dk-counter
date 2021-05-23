const sqlite3 = require('sqlite3').verbose();

module.exports = { countTodayDaken };

function countTodayDaken(scoreDBPath) {
  const db = new sqlite3.Database(scoreDBPath);

  return new Promise((resolve, reject) => {
    db.all(
      `
    select date(datetime(\`date\`, 'unixepoch'), 'localtime') dt ,sum(notes) from score
    group by dt
    ;`,
      (err, rows) => {
        if (err) return reject(err);

        db.close();
        resolve(rows);
      },
    );
  });
}
