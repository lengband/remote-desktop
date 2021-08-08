const { app } = require('electron')
const handlerIPC = require('./ipc')
const {
  create: createMainWindow,
  show: showMainWindow,
  close: closeMainWindow,
} = require('./windows/main')

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    console.log({ event, commandLine, workingDirectory })
    // 当运行第二个实例时,将会聚焦到myWindow这个窗口
    showMainWindow()
  })
  app.on('ready', () => {
    createMainWindow()
    handlerIPC()
    require('./trayAndMenu')
    require('./robot.js')()
  })
  app.on('activate', () => {
    // process.crash()
    showMainWindow()
  })
  app.on('before-quit', () => {
    closeMainWindow()
  })

  // 运行在浏览器端 require('robotjs')
  app.allowRendererProcessReuse = false
}
