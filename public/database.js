const sqlite3 = require("sqlite3");

/**
 * Module used to return data from SQLlite using promises.
 * Use each function with an await-keyword
 */

let db;
exports.db = db;

exports.open = (path) => {
  return new Promise((resolve, reject) => {
    this.db = new sqlite3.Database(path, (err) => {
      if (err) reject("ERROR: " + err.message);
      else resolve(true);
    });
  });
};

const getResponse = (promise) => {
  return promise
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log("ERROR: " + err.message);
      return false;
    });
};

exports.all = async (query, args) => {
  const p = new Promise((resolve, reject) => {
    this.db.all(query, args, (err, rows) => {
      if (err) reject(err.message);
      else resolve(rows);
    });
  });

  return await getResponse(p);
};

exports.run = async (query, args) => {
  const p = new Promise((resolve, reject) => {
    this.db.run(query, (err) => {
      if (err) reject(err.message);
      else resolve(true);
    });
  });

  return await getResponse(p);
};
