const {ipcMain} = require('electron')
const {send: sendMainWindow} = require('./windows/main')
const {create: createControlWindow, send: sendControlWindow} = require('./windows/control')

module.exports = function () {
  ipcMain.handle('login', async () => {
      return Math.floor(Math.random() * 1000000) + 100000
  })
  ipcMain.on('control', async (e, remote) => {
    // 这里是跟服务端的交互，成功后我们会唤起面板
    // signal.send('control', {remote})
    sendMainWindow('control-state-change', remote, 1)
    createControlWindow()
  })
}

