let store = {
  editMode: {
    list: false,
    def: false,
    id: false
  },
  detailsTab: '',
  selectedExdef: ''
}


export default class Store {
  constructor (container) {
    this.container = container
    this.change = this.change.bind(this)
    this.getStore = this.getStore.bind(this)
  }
  change (keyPath, value) {
    let copiedObj = copyObj(store)
    let targetKey = copiedObj
    keyPath.forEach((key) => targetKey = copiedObj[key])
    targetKey = value
    store = copiedObj
    return store
  }
  getStore () {
    return copyObj(store)
  }
}

function copyObj(obj) {
  return JSON.parse(JSON.stringify(obj))
}
