// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const path = require('path')

const regex = /(.*google.*?)\//

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width         : 800,
    height        : 600,
    webPreferences: {
      preload: path.join(__dirname, 'lib/preload.js'),
    },
    autoHideMenuBar: false,
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // @gtts/core使用的是axios，好处是他会切换node和browser环境。
  // 我本来想在useGttsAudio中直接使用@gtts/core的getAudio方法，但是chrome和axios的XHR都不允许在request的head中设置Referer和User-Agent。
  // 后来把它写到了preload.js中，然后在index.html中通过window.myAPI.makeAudio调用它，因为preload.js是一个electron-main环境，想当然的认为
  // axios可以使用node环境的http。但是axios的默认adapter是browser的XHR，因为它先判断是否有XmlHttpRequest是否存在，如果存在，就使用XHR，
  // 如果不存在，就使用node的http。而electron的环境又恰好能结合node和chrome的环境，因此就算写到preload.js中，也不会用node的http。
  // 做过的尝试1：手动在@gtts/core中fetch.default.adapter = require('axios/lib/adapters/http')，这种方法可用，但太丑了。2：就是用下面的方
  // 法，参考文档在https://pratikpc.medium.com/bypassing-cors-with-electron-ab7eaf331605，此方法的一个小毛病是页面还会有两个错误在console。
  mainWindow.webContents.session.webRequest.onBeforeSendHeaders((details, next) => {
    const m = regex.exec(details.url)

    if (m) {
      next({
        requestHeaders: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          Referer       : m[1],
          'User-Agent'  : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
        },
      })
    } else {
      next({})
    }
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady()
  .then(() => {
    createWindow()

    app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
