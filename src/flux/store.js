import {remote} from 'electron'

import * as util from './util'

let store = {
  editMode: {
    list: false,
    def: false,
    id: false
  },
  detailsTab: '',
  exdefList: remote.getCurrentWindow().exdefList,
  selected: {
    exdef: {},
    muList: [],
    drList: []
  },
  updated: {
    exdef: {},
    muList: [],
    drList: []
  }
}


export default class Store {
  constructor (container) {
    this.container = container
  }
  update (list) {
    let copiedStore = util.copyObj(store)
    list.forEach((pair) => {
      let walkerObj = copiedStore
      let lastKey
      pair.keyPath.forEach((key, idx) => {
        if (idx !== pair.keyPath.length - 1) walkerObj = walkerObj[key]
        else lastKey = key
      })
      walkerObj[lastKey] = pair.value
    })
    store = copiedStore
    this.container.setState({store: store})
  }
  getValue (keyPath) {
    let walkerObj = store
    keyPath.forEach((key) => walkerObj = walkerObj[key])
    return walkerObj
  }
  copyValue (keyPath) {
    return util.copyObj(this.getValue(keyPath))
  }
  getStore () {
    return util.copyObj(store)
  }
}
