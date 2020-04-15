'use strict'

import { app, BrowserWindow, dialog } from 'electron'
const EAU = require('electron-asar-hot-updater')
const ProgressBar = require('electron-progressbar')

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9088`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    webPreferences: {
      nativeWindowOpen: true,
      nodeIntegration: true
    }
  })

  mainWindow.loadURL(winURL)

  EAU.init({
    'api': 'http://127.0.0.1:3000', // The API EAU will talk to
    'server': false, // Where to check. true: server side, false: client side, default: true.
    'debug': false // Default: false.
  })

  EAU.check(function (error, last, body) {
    if (error) {
      if (error === 'no_update_available') { return false }
      if (error === 'version_not_specified' && process.env.NODE_ENV === 'development') { return false }
      dialog.showErrorBox('info', error)
      return false
    }

    dialog.showMessageBox({
      type: 'info',
      buttons: ['OK', 'Cancel'],
      title: 'Update or not',
      message: `Update or not ${last}`,
      detail: body.info,
      defaultId: 0
    }, (callIndex) => {
      switch (callIndex) {
        case 0:
          var progressBar = new ProgressBar({
            indeterminate: false,
            text: 'Preparing data...',
            detail: 'Wait...',
            style: {
              bar: { 'background-color': '#fff', 'height': '10px' },
              value: { 'background-color': '#2CD3A9', 'height': '10px' }
            },
            browserWindow: {
              parent: mainWindow
            }
          })

          progressBar
            .on('completed', function () {
              console.info('completed...')
              progressBar.detail = 'Task completed. Exiting...'
            })
            .on('aborted', function (value) {
              console.info(`aborted... ${value}`)
            })
            .on('progress', function (value) {
              progressBar.detail = `Value ${value} out of ${progressBar.getOptions().maxValue}...`
            })

          EAU.progress(function (state) {
            if (!progressBar.isCompleted()) {
              progressBar.value = parseInt(100 * state.percent)
            }
          })

          EAU.download(function (error) {
            progressBar.value = 100
            progressBar.close()
            if (error) {
              dialog.showErrorBox('error', error)
              return false
            }
            if (process.platform === 'darwin') {
              dialog.showMessageBox({
                type: 'info',
                buttons: ['ok', 'cancel'],
                title: `Update completed!`,
                message: `Update completed! `,
                detail: `Restart the application to experience new features.`,
                defaultId: 0
              }, (updateIndex) => {
                switch (updateIndex) {
                  case 0:
                    app.relaunch()
                    app.quit()
                    break

                  default:
                    break
                }
              })
            } else {
              app.quit()
            }
            app.quit()
          })
          break

        case 1:
          break

        default:
          break
      }
    })
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
