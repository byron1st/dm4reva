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
  }
  update (list) {
    let copiedStore = copyObj(store)
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
  getStore () {
    return copyObj(store)
  }
}

function copyObj(obj) {
  return JSON.parse(JSON.stringify(obj))
}
