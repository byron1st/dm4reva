import {ipcRenderer} from 'electron'

import * as util from './util'
import constants from './const'

export function init (dispatcher) {
  dispatcher.register([
    {type: type.changeMu, func: changeMu},
    {type: type.removeMu, func: removeMu},
    {type: type.addMu, func: addMu}
  ])
}

export const type = {
  changeMu: 'change-mu',
  removeMu: 'remove-mu',
  addMu: 'add-mu'
}

/**
 * changeMu - description
 *
 * @param  {type} changedData {muID: '', desc: ''}
 */
function changeMu (store, changedData) {
  let changedMu = {
    muID: changedData.muID,
    desc: changedData.desc,
    exdefType: store.getValue(['updated', 'exdef', 'type'])
  }
  let updatedMuList = util.replaceAnItem(store.getValue(['updated', 'muList']), 'muID', changedMu.muID, changedMu)
  store.update([{keyPath: ['updated', 'muList'], value: updatedMuList}])
}

/**
 * removeMu - description
 *
 * @param  {type} muID  muID of the mu that will be removed
 */
function removeMu (store, muID) {
  let updatedMuList = util.removeAnItemFromList(store.copyValue(['updated', 'muList']), 'muID', muID)
  store.update([{keyPath: ['updated', 'muList'], value: updatedMuList}])
}

/**
 * addMu - description
 *
 * @param  {type} muData {muID: '', desc: ''}
 */
function addMu (store, muData) {
  let newMu = {
    muID: muData.muID,
    desc: muData.desc,
    exdefType: store.getValue(['updated', 'exdef', 'type'])
  }
  let updatedMuList = util.addItemsToList(store.getValue(['updated', 'muList']), newMu)
  console.log(updatedMuList)
  store.update([{keyPath: ['updated', 'muList'], value: updatedMuList}])
}
