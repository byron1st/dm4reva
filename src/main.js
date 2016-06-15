'use strict'
import {app, BrowserWindow, ipcMain, dialog, Menu} from 'electron'
import path from 'path'
import fs from 'fs'
import * as db from './db.js'
import config from './app.config.js'
import Datastore from 'nedb'
/*
{
  dbpath: string
}
*/
const configDB = new Datastore({filename: path.join(app.getPath('userData'), 'config.json'), autoload: true})

let userConfig = {}
let exdefWindow = null
let viewerWindow = null
let initWindow = null

function handleErrors (err, message) {
  if (message) dialog.showErrorBox('An error occurs', message)
  else dialog.showErrorBox('An error occurs', err.toString())
  if (exdefWindow) exdefWindow.webContents.send('hide-loading')
}

function validateJSONFormat (kind, rawString, cb) {
  let converted = {}
  try {
    converted = JSON.parse(rawString)
  } catch (e) {
    return handleErrors(e, e.name + ': ' + e.message)
  }
  if (cb) cb(converted)
}

function initialize () {
  configDB.findOne({_id: 1}, (err, pref) => {
    if (err) return handleErrors(err)
    if (!pref) {
      return configDB.insert({_id: 1}, (err, newPref) => {
        userConfig = newPref
        getPreferences()
      })
    } else {
      userConfig = pref
      getPreferences()
    }
  })
}

function getPreferences () {
  let dbDir
  if (config.mode === 'test') loadDataAndCreateWindow('db')
  else if (userConfig.dbpath) loadDataAndCreateWindow(userConfig.dbpath)
  else createInitWindow()
}

function loadDataAndCreateWindow (dir) {
  db.initialize(dir, () => {
    if (config.mode === 'test') loadInitialTestData().then(() => createExdefWindow())
    else createExdefWindow()
  })
}

function createExdefWindow () {
  db.read(db.nexdef, {}, {kind:1, type:1}, (err, docs) => {
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

function createViewerWindow () {
  db.read(db.nelems, {}, {kind:1, type:1}, (err, docs) => {
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

function createInitWindow () {
  initWindow = new BrowserWindow({
    width: 800,
    height: 200
  })
  initWindow.loadURL(path.join('file://', __dirname, 'index.init.html'))
  initWindow.on('closed', () => initWindow = null)
  if (config.mode === 'test') initWindow.webContents.openDevTools()
}

app.on('ready', () => {
  const menu = Menu.buildFromTemplate(mainmenu)
  Menu.setApplicationMenu(menu)
  initialize()
})

app.on('activate', () => {
  if (exdefWindow === null) createExdefWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('will-quit', () => {
})

ipcMain.on('set-db', (event, arg) => {
  configDB.update({_id: 1}, {dbpath: arg}, {upsert: true}, (err) => {
    if (err) return handleErrors(err)
    loadDataAndCreateWindow(arg)
  })
})

ipcMain.on('handle-errors', (event, arg) => {
  handleErrors(err)
})

ipcMain.on('update-anExdef', (event, arg) => {
  db.update(db.nexdef, arg, (err) => {
    if (err) {
      handleErrors(err)
      event.returnValue = false
    } else {
      event.returnValue = true
    }
  })
})

ipcMain.on('remove-anExdef', (event, arg) => {
  db.deleteOne(db.nexdef, arg, (err) => {
    if (err) {
      handleErrors(err)
      event.returnValue = false
    } else {
      event.returnValue = true
    }
  })
})

ipcMain.on('add-new-exdef', (event, arg) => {
  db.create(db.nexdef, arg, (err, doc) => {
    if (err) {
      handleErrors(err)
      event.returnValue = null
    } else {
      event.returnValue = doc
    }

  })
})

ipcMain.on('read-drs', (event, arg) => {
  db.readDRsOfInfs(arg, (err, docs) => {
    if (err) {
      handleErrors(err)
      event.returnValue = null
    } else {
      event.returnValue = docs
    }
  })
})

ipcMain.on('read-ers', (event, arg) => {
  db.readRecordsOfMUs(arg, (err, docs) => {
    if (err) {
      handleErrors(err)
      event.returnValue = null
    } else {
      event.returnValue = docs
    }
  })
})

ipcMain.on('validate-muID', (event, arg) => {
  db.validateMUID(arg, (err, num) => {
    if (num === 0) event.returnValue = true
    else event.returnValue = false
  })
})

ipcMain.on('validate-elemID', (event, arg) => {
  if (arg.value === '') {
    switch (arg.inputType) {
      case 'elemID':
      case 'parents':
        event.returnValue = true
      case 'source':
      case 'sink':
        event.returnValue = false
    }
  }
  db.validateID(arg.value, (err, num) => {
    if (num === 0) event.returnValue = false
    else event.returnValue = true
  })
})

ipcMain.on('save-elem', (event, arg) => {
  db.create(db.nelems, arg, (err, doc) => {
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
    label: 'Edit',
    submenu: [
      { label: 'Undo', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
      { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo' },
      { type: 'separator' },
      { label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut' },
      { label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' },
      { label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste' },
      { label: 'Select All', accelerator: 'CmdOrCtrl+A', role: 'selectall' }
    ]
  },
  {
    label: 'Datastore',
    submenu: [
      {
        label: 'import type definitions',
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
                validateJSONFormat('exdef', data.toString(), (jsonConverted) => {
                  db.create(db.nexdef, jsonConverted, (err, docs) => {
                    if (err) return handleErrors(err)
                    if (exdefWindow) {
                      exdefWindow.webContents.send('notify-udpate', docs)
                      exdefWindow.webContents.send('hide-loading')
                    }
                  })
                })
              })
            }
          })
        }
      },
      {
        label: 'import dependency relationships',
        accelerator: 'CmdOrCtrl+D',
        click(item, focusedWindow) {
          dialog.showOpenDialog({
            properties: ['openFile']
          }, (filenames) => {
            if (filenames) {
              if (exdefWindow) exdefWindow.webContents.send('show-loading')
              fs.readFile(filenames[0], (err, data) => {
                if (err) handleErrors(err)
                validateJSONFormat('dr', data.toString(), (jsonConverted) => {
                  db.create(db.ndr, jsonConverted, (err, docs) => {
                    if (err) return handleErrors(err)
                    if (exdefWindow) exdefWindow.webContents.send('hide-loading')
                    dialog.showMessageBox({type: 'info',
                                          title: 'Dependency relationships are added',
                                          message: docs.length + ' DRs are added.',
                                          buttons: ['OK']})
                  })
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
                validateJSONFormat('er', data.toString(), (jsonConverted) => {
                  db.create(db.ner, jsonConverted, (err, docs) => {
                    if (err) return handleErrors(err)
                    if (exdefWindow) exdefWindow.webContents.send('hide-loading')
                    dialog.showMessageBox({type: 'info',
                                          title: 'Execution records are added',
                                          message: docs.length + ' ERs are added.',
                                          buttons: ['OK']})
                  })
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
                validateJSONFormat('elems', data.toString(), (jsonConverted) => {
                  db.create(db.nelems, JSON.parse(data.toString()), (err, docs) => {
                    if (err) return handleErrors(err)
                    if (exdefWindow) exdefWindow.webContents.send('hide-loading')
                    dialog.showMessageBox({type: 'info',
                                          title: 'Execution view elements are added',
                                          message: docs.length + ' elements are added.',
                                          buttons: ['OK']})
                  })
                })
              })
            }
          })
        }
      },
      { type: 'separator' },
      {
        label: 'reset all',
        click(item, focusedWindow) {
          db.deleteAll(db.nexdef, (err, num) => {
            if (err) return handleErrors (err)
            db.deleteAll(db.ndr, (err, num) => {
              if (err) return handleErrors (err)
              db.deleteAll(db.ner, (err, num) => {
                if (err) return handleErrors (err)
                db.deleteAll(db.nelems, (err, num) => {
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
        accelerator: 'CmdOrCtrl+Shift+V',
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
    db.create(db.nexdef, exdefBDPS, (err, docs) => {
      if (err) reject()
      resolve()
    })
  })
}
