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
  switch (editPage) {
    case constants.editPage.list:
      let keyPathforList = ['editMode', constants.editPage.list]
      store.update([{keyPath: keyPathforList, value: !store.getValue(keyPathforList)}])
      break
    case constants.editPage.def:
    case constants.editPage.id:
      let keyPathforDefAndId = ['editMode', editPage]
      store.update([{keyPath: keyPathforDefAndId, value: !store.getValue(keyPathforDefAndId)}])
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
    {keyPath: ['updatedExdef'], value: util.getAnItemFromList(store.getValue(['exdefList']), '_id', _id)},
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
