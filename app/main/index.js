const { app } = require('electron')
const handlerIPC = require('./ipc')
const { create: createMainWindow } = require('./windows/main')

app.on('ready', () => {
  createMainWindow()
  handlerIPC()
})