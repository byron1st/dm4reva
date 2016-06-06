import {ipcRenderer, dialog, app, Menu} from 'electron'
import fs from 'fs'

function handleErrors (err) {
  // ipcRenderer.send('handle-errors', err)
}

const template = [
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
              window.$('#progressBar').show()
              fs.readFile(filenames[0], (err, data) => {
                if (err) handleErrors(err)
                // ipcRenderer.send('save-exdefs', data)
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
              window.$('#progressBar').show()
              fs.readFile(filenames[0], (err, data) => {
                if (err) handleErrors(err)
                // ipcRenderer.send('save-drs', data)
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
              window.$('#progressBar').show()
              fs.readFile(filenames[0], (err, data) => {
                if (err) handleErrors(err)
                // ipcRenderer.send('save-ers', data)
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
              window.$('#progressBar').show()
              fs.readFile(filenames[0], (err, data) => {
                if (err) handleErrors(err)
                // ipcRenderer.send('save-elems', data)
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
          // ipcRenderer.send('reset')
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
          // ipcRenderer.send('open-viewer')
        }
      }
    ]
  }
]

if (process.platform === 'darwin') {
  const name = app.getName();
  template.unshift({
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
        click() { app.quit(); }
      },
    ]
  })
}

// ipcRenderer.on('save-reply', (event, arg) => {
//   window.$('#progressBar').hide()
// })

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
