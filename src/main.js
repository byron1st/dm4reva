'use strict'

import {app, BrowserWindow, ipcMain, dialog, Menu} from 'electron'
import path from 'path'
import fs from 'fs'

import * as db from './db'
import config from './app.config'

let prefFilePath = ''
let preferences = {}
let exdefWindow = null
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
    if (cb) cb(converted)
  } catch (e) {
    return handleErrors(e, e.name + ': ' + e.message)
  }
}

function initialize () {
  if (config.mode === 'test') prefFilePath = './test/pref.json'
  else prefFilePath = path.join(app.getPath('userData'), 'pref.json')

  try {
    fs.accessSync(prefFilePath, fs.F_OK)
    preferences = JSON.parse(fs.readFileSync(prefFilePath))
  } catch(err) {
    preferences = { savePath:'' }
  }

  if (preferences.savePath) loadDataAndCreateWindow(preferences.savePath)
  else createInitWindow()
}

function loadDataAndCreateWindow (dir) {
  db.initialize(dir, () => {
    if (config.mode === 'test') loadInitialTestData().then(() => createExdefWindow()).catch((err) => handleErrors(err))
    else createExdefWindow()
  })
}

function createExdefWindow () {
  db.read(db.nexdef, {}, {kind:1, type:1}, (err, exdefs) => {
    if (err) return handleErrors(err)

    db.read(db.mu, {}, {muID:1}, (err, mus) => {
      if (err) return handleErrors(err)

      db.read(db.ner, {}, {}, (err, records) => {
        if (err) return handleErrors(err)

        exdefWindow = new BrowserWindow({
          width: 1280,
          height: 720
        })
        exdefWindow.exdefList = exdefs
        exdefWindow.muList = mus
        exdefWindow.recordsList = records
        exdefWindow.loadURL(path.join('file://', __dirname, 'index.exdef.html'))
        exdefWindow.on('closed', () => exdefWindow = null)
        if (config.mode === 'test') {
          exdefWindow.webContents.openDevTools()
        }
      })
    })
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
  fs.writeFileSync(prefFilePath, JSON.stringify(preferences))
})

ipcMain.on('set-db', (event, arg) => {
  preferences.savePath = arg
  if (initWindow) initWindow.close()
  if (exdefWindow) exdefWindow.close()
  loadDataAndCreateWindow(preferences.savePath)
})

ipcMain.on('handle-errors', (event, arg) => {
  handleErrors(new Error(arg))
})

ipcMain.on('update-exdef', (event, arg) => {
  if (arg._id) {
    db.update(db.nexdef, arg, (err, doc) => {
      if (err) {
        handleErrors(err)
        event.returnValue = false
      } else event.returnValue = doc
    })
  } else {
    handleErrors(new Error('No _id exists'))
    event.returnValue = false
  }
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
  let argToArray = []
  if (!Array.isArray(arg)) argToArray.push(arg)
  else argToArray = arg
  db.create(db.nexdef, argToArray, (err, doc) => {
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

ipcMain.on('read-ers-exdef', (event, exdefType) => {
  db.read(db.mu, {exdefType: exdefType}, {muID: 1}, (err, muList) => {
    if (err) {
      handleErrors(err)
      event.returnValue = null
    } else {
      let muIdList = muList.map((e) => e.muID)
      db.readRecordsOfMUs(muIdList, (err, docs) => {
        if (err) {
          handleErrors(err)
          event.returnValue = null
        } else {
          event.returnValue = docs
        }
      })
    }
  })
})

ipcMain.on('read-mus', (event, arg) => {
  db.read(db.mu, {exdefType: arg}, {muID: 1}, (err, docs) => {
    if (err) {
      handleErrors(err)
      event.returnValue = null
    } else event.returnValue = docs
  })
})

ipcMain.on('validate-muID', (event, arg) => {
  db.validateMUID(arg, (err, num) => {
    if (num === 0) event.returnValue = true
    else event.returnValue = false
  })
})

ipcMain.on('save-mu-list', (event, arg) => {
  db.deleteByQuery(db.mu, {exdefType: arg[0].exdefType}, (err) => {
    if (err) {
      handleErrors(err)
      event.returnValue = false
    } else {
      db.create(db.mu, arg, (err, docs) => {
        if (err) {
          handleErrors(err)
          event.returnValue = false
        } else event.returnValue = docs
      })
    }
  })
})

ipcMain.on('remove-all-mu-by-exdef', (event, arg) => {
  db.deleteByQuery(db.mu, {exdefType: arg}, (err) => {
    if (err) {
      handleErrors(err)
      event.returnValue = false
    }
    event.returnValue = true
  })
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
        label: 'change the workspace',
        click(item, focusedWindow) {
          createInitWindow()
        }
      },
      { type: 'separator' },
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
        label: 'import monitoring units',
        accelerator: 'CmdOrCtrl+M',
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
                validateJSONFormat('mu', data.toString(), (jsonConverted) => {
                  db.create(db.mu, jsonConverted, (err, docs) => {
                    if (err) return handleErrors(err)
                    if (exdefWindow) {
                      exdefWindow.webContents.send('notify-mu-add', docs)
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
                    if (exdefWindow) {
                      exdefWindow.webContents.send('notify-records-add', docs)
                      exdefWindow.webContents.send('hide-loading')
                    }
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
      { type: 'separator' },
      {
        label: 'reset records',
        click(item, focusedWindow) {
          db.deleteAll(db.ner, (err, num) => {
            if (err) return handleErrors (err)
            exdefWindow.close()
            createExdefWindow()
          })
        }
      },
      {
        label: 'reset all',
        click(item, focusedWindow) {
          db.deleteAll(db.nexdef, (err, num) => {
            if (err) return handleErrors (err)
            db.deleteAll(db.ndr, (err, num) => {
              if (err) return handleErrors (err)
              db.deleteAll(db.ner, (err, num) => {
                if (err) return handleErrors (err)
                db.deleteAll(db.mu, (err, num) => {
                  if (err) return handleErrors (err)
                  exdefWindow.close()

                  if (config.mode === 'test') loadDataAndCreateWindow('db')
                  else if (preferences.savePath) loadDataAndCreateWindow(preferences.savePath)
                  else createInitWindow()
                })
              })
            })
          })
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
  let muBDPS = JSON.parse(fs.readFileSync('./test/resources/mu.bdps.json'))
  return new Promise((resolve, reject) => {
    db.create(db.nexdef, exdefBDPS, (err, docs) => {
      if (err) reject()
      db.create(db.mu, muBDPS, (err, docs) => {
        if (err) reject()
        resolve()
      })
    })
  })
}
