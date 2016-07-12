import constants from './const'
import * as util from './util'

export function init (dispatcher) {
  dispatcher.register([
    {type: type.toggleEdit, func: toggleEdit},
    {type: type.selectExdef, func: selectExdef},
    {type: type.selectTab, func: selectTab}
  ])
}

export const type = {
  toggleEdit: 'toggle-edit',
  selectTab: 'select-tab',
  selectExdef: 'select-exdef'
}

/**
 * toggleEdit - description
 *
 * @param  {type} editPage the value of editPage of const.js
 */
function toggleEdit(store, editPage) {
  let keyPath
  switch (editPage) {
    case constants.editPage.list:
      keyPath = ['editMode', 'list']
      store.update([{keyPath: keyPath, value: !store.getValue(keyPath)}])
      break
    case constants.editPage.def:
      keyPath = ['editMode', 'def']
      store.update([{keyPath: keyPath, value: !store.getValue(keyPath)}])
      break
    case constants.editPage.id:
      keyPath = ['editMode', 'id']
      store.update([{keyPath: keyPath, value: !store.getValue(keyPath)}])
      break
    default:
  }
}

/**
 * selectExdef - description
 *
 * @param  {type} _id   _id of the selected exdef
 */
function selectExdef(store, _id) {
  store.update([
    {keyPath: ['selectedExdef'], value: util.getAnItemFromList(store.getValue(['exdefList']), '_id', _id)},
    {keyPath: ['detailsTab'], value: constants.detailsTabName.def}
  ])
}

/**
 * selectTab - description
 *
 * @param  {type} detailsTabName one of detailsTabName of const.js
 */
function selectTab(store, detailsTabName) {
  store.update([{keyPath: ['detailsTab'], value: detailsTabName}])
}
