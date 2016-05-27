import {ipcRenderer, remote} from 'electron'
import fs from 'fs'

function handleErrors (err) {
  remote.dialog.showErrorBox('Error occurs', err)
}

const template = [
  {
    label: 'Datastore',
    submenu: [
      {
        label: 'import Exdef.s',
        accelerator: 'CmdOrCtrl+E',
        click(item, focusedWindow) {
          remote.dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [
              {name: 'json File', extensions: ['json']}
            ]
          }, (filenames) => {
            if (filenames) {
              //TODO: progressBar show.
              fs.readFile(filenames[0], (err, data) => {
                if (err) handleErrors(err)
                //TODO: send ipc!
              })
            }
          })
        }
      },
      {
        label: 'import DRs',
        accelerator: 'CmdOrCtrl+D',
        click(item, focusedWindow) {
          remote.dialog.showOpenDialog({
            properties: ['openFile']
          }, (filenames) => {
            if (filenames) {
              //TODO: show progressBar
              fs.readFile(filenames[0], (err, data) => {
                if (err) handleErrors(err)
                //TODO: send ipc!
              })
            }
          })
        }
      },
      {
        label: 'import records',
        accelerator: 'CmdOrCtrl+R',
        click(item, focusedWindow) {
          remote.dialog.showOpenDialog({
            properties: ['openFile']
          }, (filenames) => {
            if (filenames) {
              //TODO: show progressBar
              fs.readFile(filenames[0], (err, data) => {
                if (err) handleErrors(err)
                //TODO: send ipc!
              })
            }
          })
        }
      },
      {
        label: 'reset all',
        click(item, focusedWindow) {
          //TODO: send ipc!
        }
      }
    ]
  }
]

if (process.platform === 'darwin') {
  const name = remote.app.getName();
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
        click() { remote.app.quit(); }
      },
    ]
  })
}

const menu = remote.Menu.buildFromTemplate(template);
remote.Menu.setApplicationMenu(menu);
