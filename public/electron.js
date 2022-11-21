const { app, BrowserWindow, session, ipcMain } = require("electron");
const isDev = require("electron-is-dev");
const { resolve } = require("path");
const path = require("path");
const sqlite3 = require("sqlite3");

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: isDev ? path.join(app.getAppPath(), "./public/preload.js") : path.join(app.getAppPath(), "./build/preload.js"),

      contextIsolation: true,
    },
  });

  mainWindow.loadURL(isDev ? "http://localhost:3000/" : `file://${path.join(__dirname, "../build/index.html")}`);

  if (isDev) {
    mainWindow.webContents.on("did-frame-finish-load", () => {
      mainWindow.webContents.openDevTools();
    });
  }
};

// Setting the location for the userdata folder created by the Electron App
app.setPath(
  "userData",
  isDev
    ? path.join(app.getAppPath(), "userdata/") // Creates the folder 'userdata' where package.json is located
    : path.join(process.resourcesPath, "userdata/") // Creates the folder 'userdata' in the resources folder
);

// When the app is ready to load
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

process.on("uncaughtException", (error) => {
  console.log(`Exception: ${error} `);
  if (process.platform !== "darwin") {
    app.quit();
  }
});

/**
 * ------------
 * Database Functions
 */

const db = new sqlite3.Database(isDev ? path.join(__dirname, "../db/database.db") : path.join(process.resourcesPath, "db/database.db"), (err) => {
  if (err) {
    console.log(`Database Error: ${error}`);
  } else {
    console.log(`Database Loaded`);
  }
});

const dbResponse = (promise) => {
  return promise
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log("ERROR: " + err.message);
      return false;
    });
};

const dbAll = async (query, args) => {
  const p = new Promise((resolve, reject) => {
    db.all(query, args, (err, rows) => {
      if (err) reject(err.message);
      else resolve(rows);
    });
  });

  return await dbResponse(p);
};

const dbRun = async (query) => {
  const p = new Promise((resolve, reject) => {
    db.run(query, (err) => {
      if (err) reject(err.message);
      else resolve(true);
    });
  });

  return await dbResponse(p);
};

/**
 * ------------
 * API Calls
 */

ipcMain.handle("listContacts", async (event, args) => {
  const result = await dbAll("SELECT * FROM contacts ORDER BY firstName asc", []);
  return result;
});

ipcMain.handle("createContact", async (event, data) => {
  const JSONdata = JSON.parse(data);
  const sql = `INSERT INTO contacts(firstName, lastName, email, phone)
              VALUES('${JSONdata.firstName}', '${JSONdata.lastName}', '${JSONdata.email}', '${JSONdata.phone}')`;
  const result = await dbRun(sql);
  console.log(result);
  return result;
});

ipcMain.handle("updateContact", async (event, data) => {
  const JSONdata = JSON.parse(data);
  const sql = `UPDATE contacts SET
              firstName = '${JSONdata.firstName}', lastName = '${JSONdata.lastName}', email = '${JSONdata.email}', phone = '${JSONdata.phone}'
              WHERE id = '${JSONdata.id}'`;
  const result = await dbRun(sql);
  console.log(result);
  return result;
});

ipcMain.handle("deleteContact", async (event, id) => {
  const result = await dbRun(`DELETE FROM contacts WHERE id = ${id}`);
  console.log(result);
  return result;
});
