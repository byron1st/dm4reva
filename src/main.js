'use strict'
import {app, BrowserWindow, ipcMain, dialog} from 'electron'
import path from 'path'
import * as exdefDB from './exdef.db.js'
import * as drDB from './dr.db.js'
import * as erDB from './er.db.js'
import * as elemsDB from './elems.db.js'
import fs from 'fs'
import config from './app.config.js'

let exdefWindow = null

function handleErrors (err) {
  dialog.showErrorBox('An error occurs', err.toString())
}

function createExdefWindow (docs) {
  exdefWindow = new BrowserWindow({
    width: 1280,
    height: 720
  })
  exdefWindow.exdefList = docs
  exdefWindow.loadURL(path.join('file://', __dirname, 'index.exdef.html'))
  exdefWindow.on('closed', () => exdefWindow = null)
  if (config.mode === 'test') exdefWindow.webContents.openDevTools()
}

app.on('ready', () => {
  if (config.mode === 'test') {
    loadInitialTestData().then(() => exdefDB.read({}, {kind:1, type:1}, (err, docs) => {
      if (err) return handleErrors (err)
      createExdefWindow(docs)
    }))
  } else exdefDB.read({}, {kind:1, type:1}, (err, docs) => {
    if (err) return handleErrors (err)
    createExdefWindow(docs)
  })
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

ipcMain.on('save-exdefs', (event, arg) => {
  exdefDB.create(JSON.parse(arg.toString()), (err, docs) => {
    if (err) return handleErrors(err)
    event.sender.send('save-exdefs-reply', docs)
  })
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

ipcMain.on('save-drs', (event, arg) => {
  drDB.create(JSON.parse(arg.toString()), (err, docs) => {
    if (err) return handleErrors(err)
    event.sender.send('save-drs-reply')
    dialog.showMessageBox({type: 'info',
                          title: 'Dependency relationships are added',
                          message: docs.length + ' DRs are added.',
                          buttons: ['OK']})
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

ipcMain.on('save-ers', (event, arg) => {
  erDB.create(JSON.parse(arg.toString()), (err, docs) => {
    if (err) return handleErrors(err)
    event.sender.send('save-ers-reply')
    dialog.showMessageBox({type: 'info',
                          title: 'Execution records are added',
                          message: docs.length + ' ERs are added.',
                          buttons: ['OK']})
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
  if (arg === '') event.returnValue = true
  elemsDB.validateID(arg, (err, num) => {
    if (num === 0) event.returnValue = false
    else event.returnValue = true
  })
})

ipcMain.on('save-elem', (event, arg) => {
  elemsDB.create(arg, (err, doc) => {
    if (err) return handleErrors(err)
  })
})

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
