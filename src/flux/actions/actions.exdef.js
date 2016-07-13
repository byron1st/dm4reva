'use strict'

import {ipcRenderer} from 'electron'
import showdown from 'showdown'

import * as util from './util'
import constants from './const'

export function init (dispatcher) {
  dispatcher.register([
    {type: type.updateExdef, func: updateExdef},
    {type: type.updateValue, func: updateValue},
    {type: type.updateExdefWithMu, func: updateExdefWithMu}
  ])
}

export const type = {
  updateExdef: 'update-exdef',
  updateValue: 'update-value',
  setUpdatedExdef: 'set-updatedExdef',
  updateExdefWithMu: 'update-exdef-with-mu'
}

/**
 * updateExdef - description
 *
 * @param  {type} editPage the editPage where this action was called.
 */
function updateExdef (store, editPage) {
  let kindValidation = constants.exdefKindsList.indexOf(store.getValue(['updated', 'exdef', 'kind'])) !== -1
  if (kindValidation) {
    let willBeUpdatedExdef = store.copyValue(['updated', 'exdef'])
    let updatedExdef = ipcRenderer.sendSync(constants.ipcEventType.updateExdef, willBeUpdatedExdef)
    if (updatedExdef) {
      let updatedExdefList = util.replaceAnItem(store.getValue(['exdefList']), '_id', updatedExdef._id, updatedExdef)
      updatedExdefList.sort(util.sortKindAndType)
      store.update([
        {keyPath: ['exdefList'], value: updatedExdefList},
        {keyPath: ['selected', 'exdef'], value: updatedExdef},
        {keyPath: ['editMode', editPage], value: !store.getValue(['editMode', editPage])}
      ])
    } else ipcRenderer.send(constants.ipcEventType.handleErrors, 'Saving the changes to DB is failed.')
  } else ipcRenderer.send(constants.ipcEventType.handleErrors, 'The value of the Kind should be one of EComponent, EConnector, and EPort.')
}

/**
 * updateValue - description
 *
 * @param  {type} keyValueObj {key: , value: }
 */
function updateValue (store, keyValueObj) {
  store.update([{keyPath: ['updated', 'exdef', keyValueObj.key], value: keyValueObj.value}])
}

function updateExdefWithMu (store, editPage) {
  let willBeUpdatedExdef = store.copyValue(['updated', 'exdef'])
  let converter = new showdown.Converter()
  willBeUpdatedExdef.id_rules_html = converter.makeHtml(willBeUpdatedExdef.id_rules)
  let willBeUpdatedMuList = store.copyValue(['updated', 'muList'])
  let updatedResult = ipcRenderer.sendSync(constants.ipcEventType.updateExdefWithMuList, {exdef: willBeUpdatedExdef, muList: willBeUpdatedMuList})
  if (updatedResult) {
    let updatedExdefList = util.replaceAnItem(store.getValue(['exdefList']), '_id', updatedResult.exdef._id, updatedResult.exdef)
    updatedExdefList.sort(util.sortKindAndType)
    store.update([
      {keyPath: ['exdefList'], value: updatedExdefList},
      {keyPath: ['selected', 'exdef'], value: updatedResult.exdef},
      {keyPath: ['selected', 'muList'], value: updatedResult.muList},
      {keyPath: ['editMode', editPage], value: !store.getValue(['editMode', editPage])}
    ])
  }
}
