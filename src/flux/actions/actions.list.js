'use strict'

import {ipcRenderer} from 'electron'

import * as util from './util'
import constants from './const'

export function init (dispatcher) {
  dispatcher.register([
    {type: type.removeExdef, func: removeExdef},
    {type: type.addExdef, func: addExdef}
  ])
}

export const type = {
  removeExdef: 'remove-exdef',
  addExdef: 'add-exdef'
}

/**
 * removeExdef - description
 *
 * @param  {string} _id   _id of exdef
 */
function removeExdef(store, _id) {
  let updatedExdefList = util.removeAnItemFromList(store.getValue(['exdefList']), '_id', _id)
  let success = ipcRenderer.sendSync(constants.ipcEventType.removeExdef, _id)
  if (success) store.update([{keyPath: ['exdefList'], value: updatedExdefList}])
}

/**
 * addExdef - description
 *
 * @param  {object} newExdefObj object of new exdef
 */
function addExdef(store, newExdefObj) {
  let kindValidation = constants.exdefKindsList.indexOf(newExdefObj.kind) !== -1
  if (kindValidation) {
    let newExdef = ipcRenderer.sendSync(constants.ipcEventType.addExdef, newExdefObj)
    if (newExdef) {
      let updatedExdefList = util.addItemsToList(store.getValue(['exdefList']), newExdef)
      updatedExdefList.sort(util.sortKindAndType)
      store.update([{keyPath: ['exdefList'], value: updatedExdefList}])
    }
  } else ipcRenderer.send(constants.ipcEventType.handleErrors, 'The value of the Kind should be one of EComponent, EConnector, and EPort.')
}
