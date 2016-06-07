'use strict'
import {app, BrowserWindow, ipcMain, dialog, Menu} from 'electron'
import path from 'path'
import fs from 'fs'
import * as exdefDB from './exdef.db.js'
import * as drDB from './dr.db.js'
import * as erDB from './er.db.js'
import * as elemsDB from './elems.db.js'
import config from './app.config.js'

let exdefWindow = null
let viewerWindow = null

function handleErrors (err) {
  dialog.showErrorBox('An error occurs', err.toString())
  ipcRenderer.send('hide-loading')
}

function createExdefWindow () {
  exdefDB.read({}, {kind:1, type:1}, (err, docs) => {
    if (err) return handleErrors (err)

    exdefWindow = new BrowserWindow({
      width: 1280,
      height: 720
    })
    exdefWindow.exdefList = docs
    exdefWindow.loadURL(path.join('file://', __dirname, 'index.exdef.html'))
    exdefWindow.on('closed', () => exdefWindow = null)
    if (config.mode === 'test') exdefWindow.webContents.openDevTools()
  })
}

function loadDataAndCreateWindow () {
  if (config.mode === 'test') loadInitialTestData().then(() => createExdefWindow())
  else createExdefWindow()
}

function createViewerWindow (docs) {
  elemsDB.read({}, {kind:1, type:1}, (err, docs) => {
    if (err) return handleErrors(err)

    viewerWindow = new BrowserWindow({
      width: 1280,
      height: 720
    })
    viewerWindow.elemsList = docs
    viewerWindow.loadURL(path.join('file://', __dirname, 'index.viewer.html'))
    viewerWindow.on('closed', () => viewerWindow = null)
    if (config.mode === 'test') viewerWindow.webContents.openDevTools()
  })
}

app.on('ready', () => {
  const menu = Menu.buildFromTemplate(mainmenu)
  Menu.setApplicationMenu(menu)
  loadDataAndCreateWindow()
})

app.on('activate', () => {
  if (exdefWindow === null) createExdefWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('will-quit', () => {
  if (config.mode === 'test') unloadInitialTestData()
})

ipcMain.on('handle-errors', (event, arg) => {
  handleErrors(err)
})

ipcMain.on('update-anExdef', (event, arg) => {
  exdefDB.update(arg, (err) => {
    if (err) {
      handleErrors(err)
      event.returnValue = false
    } else {
      event.returnValue = true
    }
  })
})

ipcMain.on('remove-anExdef', (event, arg) => {
  exdefDB.deleteOne(arg, (err) => {
    if (err) {
      handleErrors(err)
      event.returnValue = false
    } else {
      event.returnValue = true
    }
  })
})

ipcMain.on('add-new-exdef', (event, arg) => {
  exdefDB.create(arg, (err, doc) => {
    if (err) {
      handleErrors(err)
      event.returnValue = null
    } else {
      event.returnValue = doc
    }

  })
})

ipcMain.on('read-drs', (event, arg) => {
  drDB.readDRsOfInfs(arg, (err, docs) => {
    if (err) {
      handleErrors(err)
      event.returnValue = null
    } else {
      event.returnValue = docs
    }
  })
})

ipcMain.on('read-ers', (event, arg) => {
  erDB.readRecordsOfMUs(arg, (err, docs) => {
    if (err) {
      handleErrors(err)
      event.returnValue = null
    } else {
      event.returnValue = docs
    }
  })
})

ipcMain.on('validate-muID', (event, arg) => {
  exdefDB.validateMUID(arg, (err, num) => {
    if (num === 0) event.returnValue = true
    else event.returnValue = false
  })
})

ipcMain.on('validate-elemID', (event, arg) => {
  if (arg.value === '') {
    switch (arg.inputType) {
      case 'elemID':
        event.returnValue = true
      case 'source':
      case 'sink':
      case 'parents':
        event.returnValue = false
    }
  }
  elemsDB.validateID(arg.value, (err, num) => {
    if (num === 0) event.returnValue = false
    else event.returnValue = true
  })
})

ipcMain.on('save-elem', (event, arg) => {
  elemsDB.create(arg, (err, doc) => {
    if (err) return handleErrors(err)
  })
})

ipcMain.on('refresh-elems', (event) => {
  viewerWindow.close()
  createViewerWindow()
})

/** Main menu **/
const mainmenu = [
  {
    label: 'Datastore',
    submenu: [
      {
        label: 'import Exdef.s',
        accelerator: 'CmdOrCtrl+E',
        click(item, focusedWindow) {
          dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [
              {name: 'json File', extensions: ['json']}
            ]
          }, (filenames) => {
            if (filenames) {
              if (exdefWindow) exdefWindow.webContents.send('show-loading')
              fs.readFile(filenames[0], (err, data) => {
                if (err) handleErrors(err)
                exdefDB.create(JSON.parse(data.toString()), (err, docs) => {
                  if (err) return handleErrors(err)
                  if (exdefWindow) {
                    exdefWindow.webContents.send('notify-udpate', docs)
                    exdefWindow.webContents.send('hide-loading')
                  }
                })
              })
            }
          })
        }
      },
      {
        label: 'import DRs',
        accelerator: 'CmdOrCtrl+D',
        click(item, focusedWindow) {
          dialog.showOpenDialog({
            properties: ['openFile']
          }, (filenames) => {
            if (filenames) {
              if (exdefWindow) exdefWindow.webContents.send('show-loading')
              fs.readFile(filenames[0], (err, data) => {
                if (err) handleErrors(err)
                drDB.create(JSON.parse(data.toString()), (err, docs) => {
                  if (err) return handleErrors(err)
                  if (exdefWindow) exdefWindow.webContents.send('hide-loading')
                  dialog.showMessageBox({type: 'info',
                                        title: 'Dependency relationships are added',
                                        message: docs.length + ' DRs are added.',
                                        buttons: ['OK']})
                })
              })
            }
          })
        }
      },
      {
        label: 'import records',
        accelerator: 'CmdOrCtrl+R',
        click(item, focusedWindow) {
          dialog.showOpenDialog({
            properties: ['openFile']
          }, (filenames) => {
            if (filenames) {
              if (exdefWindow) exdefWindow.webContents.send('show-loading')
              fs.readFile(filenames[0], (err, data) => {
                if (err) handleErrors(err)
                erDB.create(JSON.parse(data.toString()), (err, docs) => {
                  if (err) return handleErrors(err)
                  if (exdefWindow) exdefWindow.webContents.send('hide-loading')
                  dialog.showMessageBox({type: 'info',
                                        title: 'Execution records are added',
                                        message: docs.length + ' ERs are added.',
                                        buttons: ['OK']})
                })
              })
            }
          })
        }
      },
      {
        label: 'import elements',
        click(item, focusedWindow) {
          dialog.showOpenDialog({
            properties: ['openFile']
          }, (filenames) => {
            if (filenames) {
              if (exdefWindow) exdefWindow.webContents.send('show-loading')
              fs.readFile(filenames[0], (err, data) => {
                if (err) handleErrors(err)
                elemsDB.create(JSON.parse(data.toString()), (err, docs) => {
                  if (err) return handleErrors(err)
                  if (exdefWindow) exdefWindow.webContents.send('hide-loading')
                  dialog.showMessageBox({type: 'info',
                                        title: 'Execution view elements are added',
                                        message: docs.length + ' elements are added.',
                                        buttons: ['OK']})
                })
              })
            }
          })
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'reset all',
        click(item, focusedWindow) {
          exdefDB.deleteAll((err, num) => {
            if (err) return handleErrors (err)
            drDB.deleteAll((err, num) => {
              if (err) return handleErrors (err)
              erDB.deleteAll((err, num) => {
                if (err) return handleErrors (err)
                elemsDB.deleteAll((err, num) => {
                  if (err) return handleErrors (err)
                  exdefWindow.close()
                  loadDataAndCreateWindow()
                })
              })
            })
          })
        }
      }
    ]
  },
  {
    label: 'Viewer',
    submenu: [
      {
        label: 'Open a diagram',
        accelerator: 'CmdOrCtrl+V',
        click(item, focusedWindow) {
          if (viewerWindow) viewerWindow.focus()
          else createViewerWindow()
        }
      }
    ]
  }
]

if (process.platform === 'darwin') {
  const name = app.getName();
  mainmenu.unshift({
    label: name,
    submenu: [
      {
        label: 'About ' + name,
        role: 'about'
      },
      {
        type: 'separator'
      },
      {
        label: 'Services',
        role: 'services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        label: 'Hide ' + name,
        accelerator: 'Command+H',
        role: 'hide'
      },
      {
        label: 'Hide Others',
        accelerator: 'Command+Alt+H',
        role: 'hideothers'
      },
      {
        label: 'Show All',
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click() { app.quit() }
      },
    ]
  })
}

/** Test Mode **/
function loadInitialTestData() {
  let exdefBDPS = JSON.parse(fs.readFileSync('./test/resources/exdef.bdps.json'))
  return new Promise((resolve, reject) => {
    exdefDB.create(exdefBDPS, (err, docs) => {
      if (err) reject()
      resolve()
    })
  })
}

function unloadInitialTestData() {
  exdefDB.deleteAll()
  drDB.deleteAll()
}
