'use strict'
import {app, BrowserWindow, ipcMain, dialog} from 'electron'
import path from 'path'
import * as exdefDB from './exdef.db.js'
import fs from 'fs'
import config from './app.config.js'

let exdefWindow = null

function handleErrors (err) {
  dialog.showErrorBox('An error occurs', err.toString())
  console.log(err)
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
    if (err) return handleErrors(err)
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
  // exdefDB.create(JSON.parse(arg.toString()), (err, docs))
  // event.sender.send('save-drs-reply', ...)
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
}
