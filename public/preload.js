const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  listContacts: () => ipcRenderer.invoke("listContacts"),
  createContact: (data) => ipcRenderer.invoke("createContact", data),
  updateContact: (data) => ipcRenderer.invoke("updateContact", data),
  deleteContact: (id) => ipcRenderer.invoke("deleteContact", id),
});
