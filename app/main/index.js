const { app } = require('electron')
const handlerIPC = require('./ipc')
const { create: createMainWindow } = require('./windows/main')
const {create: createControlWindow} = require('./windows/control')

app.on('ready', () => {
  // createControlWindow();
  createMainWindow();
  handlerIPC();
  require('./robot.js')();
})

// 运行在浏览器端 require('robotjs')
app.allowRendererProcessReuse = false;