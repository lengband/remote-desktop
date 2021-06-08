const { BrowserWindow } = require('electron')
const isDev = require('electron-is-dev')
const path = require('path')

function create() {
  win = new BrowserWindow({
    width: 600,
    height: 300,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
  })
  win.webContents.openDevTools()
  if (isDev) {
    win.loadURL('http://localhost:3000')
  } else {
    // 第三章用到
    win.loadFile(
      path.resolve(__dirname, '../../renderer/pages/main/index.html')
    )
  }
}
function send(channel, ...args) {
  win.webContents.send(channel, ...args)
}
function show() {
  if (win.isMinimized()) win.restore()
  win.show()
}

function close() {
  willQuitApp = true
  win.close()
}
module.exports = { create, send, show, close }
