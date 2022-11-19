const { app, BrowserWindow, session, ipcMain } = require("electron");
const isDev = require("electron-is-dev");
const path = require("path");
const sqlite3 = require("sqlite3");

let mainWindow;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: isDev
                ? path.join(app.getAppPath(), "./public/preload.js")
                : path.join(app.getAppPath(), "./build/preload.js"),

            contextIsolation: true,
        },
    });

    mainWindow.loadURL(
        isDev
            ? "http://localhost:3000/"
            : `file://${path.join(__dirname, "../build/index.html")}`
    );

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

const db = new sqlite3.Database(
    isDev
        ? path.join(__dirname, "../db/database.db")
        : path.join(process.resourcesPath, "db/database.db"),
    (err) => {
        if (err) {
            console.log(`Database Error: ${error}`);
        } else {
            console.log(`Database Loaded`);
        }
    }
);

const getContacts = () => {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM contacts", [], (err, rows) => {
            if (err) {
                reject(err);
            }
            resolve(rows);
        });
    });
};

ipcMain.handle("get-contacts", async (event, args) => {
    console.log("IPC MAIN HANDLED");

    const sql = getContacts();

    const result = await sql.then((rows) => {
        return rows;
    });

    return result;

    /*var promise = Promise.resolve("HEJ");

    console.log(promise);

    const result = await promise.then((value) => {
        console.log(value);
        return value;
    });

    console.log("Result:", result);
    return result;*/

    //getContacts();

    /*let contacts;
    await db.all("SELECT * FROM contacts", []).then((data) => {
        contacts = data;
    });
    console.log(contacts);*/
    /*let contactsResult;
    const contacts = new Promise((resolve, reject) => {
        db.all("SELECT * FROM contacts", [], (err, rows) => {
            if (err) {
                reject(err);
            }
            resolve(rows);
            db.close();
        });
    });

    contactsResult = contacts.then((result) => {
        return result;
    });
    console.log(contactsResult);*/
    //return [{ id: 1, name: "Johan", email: "greken" }];
});
