const { ipcMain } = require('electron')
const { send: sendMainWindow } = require('./windows/main')
const {
  create: createControlWindow,
  send: sendControlWindow,
} = require('./windows/control')
const signal = require('./signal')

module.exports = function () {
  ipcMain.handle('login', async () => {
    let { code } = await signal.invoke('login', null, 'logined')
    return code
  })
  ipcMain.on('control', async (e, remote) => {
    signal.send('control', { remote })
  })

  signal.on('controlled', (data) => {
    sendMainWindow('control-state-change', data.remote, 1)
    createControlWindow()
  })

  signal.on('be-controlled', (data) => {
    sendMainWindow('control-state-change', data.remote, 2)
  })

  // puppet、control共享的信道，就是转发
  ipcMain.on('forward', (e, event, data) => {
    signal.send('forward', { event, data })
  })

  // 收到控制端的offer，发送到傀儡端
  signal.on('offer', (data) => {
    sendMainWindow('offer', data)
  })

  // 收到傀儡端的answer，发送到控制端
  signal.on('answer', (data) => {
    sendControlWindow('answer', data)
  })

  // 收到傀儡端的candidate，转发给 控制端
  signal.on('puppet-candidate', (data) => {
    sendControlWindow('candidate', data)
  })

  // 收到控制端的candidate，转发给傀儡端
  signal.on('control-candidate', (data) => {
    sendMainWindow('candidate', data)
  })
}
