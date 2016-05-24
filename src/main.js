'use strict'
import {app, BrowserWindow, ipcMain} from 'electron'
import * as path from 'path'
import * as exdefDB from './exdef.db.js'
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
  createExdefWindow()
})

app.on('activate', () => {
  if (exdefWindow === null) createExdefWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
