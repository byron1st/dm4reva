'use strict'
import {app, BrowserWindow, ipcMain} from 'electron'
import path from 'path'
import * as exdefDB from './exdef.db.js'
import fs from 'fs'
import config from './app.config.js'

let exdefWindow = null

function createExdefWindow () {
  exdefWindow = new BrowserWindow({
    width: 1280,
    height: 720
  })

  exdefWindow.loadURL(path.join('file://', __dirname, 'index.exdef.html'))
  exdefWindow.on('closed', () => exdefWindow = null)
  if (config.mode === 'test') exdefWindow.webContents.openDevTools()
}

app.on('ready', () => {
  if (config.mode === 'test') {
    loadInitialTestData().then(createExdefWindow)
  } else createExdefWindow()
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
