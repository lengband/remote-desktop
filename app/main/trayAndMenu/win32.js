const { app, Menu, Tray } = require('electron')
const path = require('path')
const { show: showMainWindow } = require('../windows/main')
const { create: createAboutWindow } = require('../windows/about')

let tray
app.whenReady().then(() => {
  tray = new Tray(path.resolve(__dirname, './icon_win32.png'))
  const menus = [
    { label: '打开' + app.name, click: showMainWindow },
    { label: '关于' + app.name, click: createAboutWindow },
    { type: 'separator' },
    {
      label: '退出',
      click: () => {
        app.quit()
      },
    },
  ]
  const contextMenu = Menu.buildFromTemplate(menus)
  tray.setContextMenu(contextMenu)
  menu = Menu.buildFromTemplate(menus)
  app.applicationMenu = menu
})
