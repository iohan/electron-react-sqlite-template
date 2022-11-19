const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
    getContacts: () => ipcRenderer.invoke("get-contacts"),
    testInvoke: (args) => ipcRenderer.invoke("test-invoke", args),
    testSend: (args) => ipcRenderer.send("test-send", args),
    testRecive: (callback) =>
        ipcRenderer.on("test-receive", (event, data) => {
            callback(data);
        }),
});
