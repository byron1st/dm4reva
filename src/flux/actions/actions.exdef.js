import {ipcRenderer} from 'electron'

import * as util from './util'

export function init (dispatcher) {
  dispatcher.register([
    {type: type.updateExdef, func: updateExdef}
  ])
}

export const type = {
  updateExdef: 'update-exdef'
}

/**
 * updateExdef - description
 *
 * @param  {object} willBeUpdatedExdef the object of updated exdef
 */
function updateExdef (store, willBeUpdatedExdef) {
  let updatedExdef = ipcRenderer.sendSync('update-exdef', willBeUpdatedExdef)
  if (updatedExdef) {
    let updatedExdefList = util.replaceAnItem(store.getValue(['exdefList']), '_id', updatedExdef._id, updatedExdef)
    updatedExdefList.sort(util.sortKindAndType)
    store.update([{keyPath: ['exdefList'], value: updatedExdefList}])
  }
}
