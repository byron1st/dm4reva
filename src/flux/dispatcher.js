import {uiActionType} from './action.type'
import constants from './const'

export default class Dispatcher {
  constructor (store) {
    this.store = store
  }
  dispatch (action) {
    let updatedStore
    switch (action.type) {
      case uiActionType.toggleEdit:
        toggleEdit(this.store, action.value)
        break
      case uiActionType.selectExdef:
        selectExdef(this.store, action.value)
        break
      case uiActionType.selectTab:
        selectTab(this.store, action.value)
      default:

    }
  }
}

function toggleEdit(store, value) {
  let keyPath
  switch (value) {
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

function selectExdef(store, value) {
  store.update([
    {keyPath: ['selectedExdef'], value: value},
    {keyPath: ['detailsTab'], value: constants.detailsTabName.def}
  ])
}

function selectTab(store, value) {
  store.update([{keyPath: ['detailsTab'], value: value}])
}
