const { app, BrowserWindow, ipcMain } = require("electron");
const isDev = require("electron-is-dev");
const path = require("path");
const sqlite = require("./database");

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

app.whenReady().then(async () => {
  // Open database connection
  await sqlite.open(isDev ? path.join(__dirname, "../db/database.db") : path.join(process.resourcesPath, "db/database.db"));
});

/**
 * ------------
 * API Calls
 */

// - listContacts
ipcMain.handle("listContacts", async (event, args) => {
  const result = await sqlite.all("SELECT * FROM contacts ORDER BY firstName asc", []);
  return result;
});

// - createContact
ipcMain.handle("createContact", async (event, data) => {
  const JSONdata = JSON.parse(data);
  const sql = `INSERT INTO contacts(firstName, lastName, email, phone)
              VALUES('${JSONdata.firstName}', '${JSONdata.lastName}', '${JSONdata.email}', '${JSONdata.phone}')`;
  const result = await sqlite.run(sql);
  console.log(result);
  return result;
});

// - updateContact
ipcMain.handle("updateContact", async (event, data) => {
  const JSONdata = JSON.parse(data);
  const sql = `UPDATE contacts SET
              firstName = '${JSONdata.firstName}', lastName = '${JSONdata.lastName}', email = '${JSONdata.email}', phone = '${JSONdata.phone}'
              WHERE id = '${JSONdata.id}'`;
  const result = await sqlite.run(sql);
  console.log(result);
  return result;
});

// - deleteContact
ipcMain.handle("deleteContact", async (event, id) => {
  const result = await sqlite.run(`DELETE FROM contacts WHERE id = ${id}`);
  console.log(result);
  return result;
});
