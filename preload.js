// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})

const { contextBridge, ipcRenderer, ipcMain } = require('electron')

contextBridge.exposeInMainWorld('db', {
  run: (dbaddress) => ipcRenderer.invoke('db_open', dbaddress),
  add: (obj) => ipcRenderer.invoke('db_add', obj),
  query: (size) => ipcRenderer.invoke('db_query', size),
  onUpdated: (callback) => ipcRenderer.on('updated', callback)
  // we can also expose variables, not just functions
})
