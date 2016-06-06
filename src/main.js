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
let viewerWindow = null

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

function loadDataAndCreateWindow () {
  if (config.mode === 'test') {
    loadInitialTestData().then(() => exdefDB.read({}, {kind:1, type:1}, (err, docs) => {
      if (err) return handleErrors (err)
      createExdefWindow(docs)
    }))
  } else exdefDB.read({}, {kind:1, type:1}, (err, docs) => {
    if (err) return handleErrors (err)
    createExdefWindow(docs)
  })
}

function createViewerWindow (docs) {
  viewerWindow = new BrowserWindow({
    width: 1280,
    height: 720
  })
  viewerWindow.elemsList = docs
  viewerWindow.loadURL(path.join('file://', __dirname, 'index.viewer.html'))
  viewerWindow.on('closed', () => viewerWindow = null)
  if (config.mode === 'test') viewerWindow.webContents.openDevTools()
}

app.on('ready', () => {
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
    event.sender.send('save-reply')
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
    event.sender.send('save-reply')
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

ipcMain.on('save-elems', (event, arg) => {
  elemsDB.create(JSON.parse(arg.toString()), (err, docs) => {
    if (err) return handleErrors(err)
    event.sender.send('save-reply')
    dialog.showMessageBox({type: 'info',
                          title: 'Execution view elements are added',
                          message: docs.length + ' elements are added.',
                          buttons: ['OK']})
  })
})

ipcMain.on('reset', (event) => {
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
})

ipcMain.on('open-viewer', (event) => {
  if (viewerWindow) viewerWindow.focus()
  else {
    elemsDB.read({}, {kind:1, type:1}, (err, docs) => {
      if (err) return handleErrors(err)
      createViewerWindow(docs)
    })
  }
})

ipcMain.on('refresh-elems', (event) => {
  viewerWindow.close()
  elemsDB.read({}, {kind:1, type:1}, (err, docs) => {
    if (err) return handleErrors(err)
    createViewerWindow(docs)
  })
})

/** Test Mode **/
function loadInitialTestData() {
  let exdefBDPS = JSON.parse(fs.readFileSync('./test/resources/exdef.bdps.json'))
  // let elemsBDPS = JSON.parse(fs.readFileSync('./test/resources/elems.bdps.json'))
  return new Promise((resolve, reject) => {
    exdefDB.create(exdefBDPS, (err, docs) => {
      if (err) reject()
      // elemsDB.create(elemsBDPS, (err, elems) => resolve())
      resolve()
    })
  })
}

function unloadInitialTestData() {
  exdefDB.deleteAll()
  drDB.deleteAll()
}
