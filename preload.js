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

contextBridge.exposeInMainWorld('orbitdb', {
  run: (dbaddress) => ipcRenderer.invoke('orbitdb_run', dbaddress),
  add: (obj) => ipcRenderer.invoke('orbitdb_add', obj),
  query: (size) => ipcRenderer.invoke('orbitdb_query', size),
  handleUpdated: (callback) => ipcRenderer.on('updated', callback)
  // we can also expose variables, not just functions
})
