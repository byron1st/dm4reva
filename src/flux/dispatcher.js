export default class Dispatcher {
  constructor (store) {
    this.store = store
    this.actions = {}
  }
  register (typeFuncList) {
    typeFuncList.forEach((typeFunc) => this.actions[typeFunc.type] = typeFunc.func)
  }
  dispatch (action) {
    this.actions[action.type](this.store, action.value)
  }
}
