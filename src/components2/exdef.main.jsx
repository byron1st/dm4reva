'use strict'

import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import {remote, ipcRenderer} from 'electron'
import showdown from 'showdown'

import List from './exdef.list'
import Details from './exdef.details'

import * as util from './util'
import Store from './store'
import Dispatcher from './dispatcher'
import initializeActions from './actions'
import {type as exdefActionType} from './actions.exdef'

class Main extends Component {
  constructor () {
    super()
    this.store = new Store(this)
    this.dispatcher = new Dispatcher(this.store)
    initializeActions(this.dispatcher)
    // this.state = this.store.getStore()
    this.state = {
      exdefList: [],
      store: {}
    }
    this.updateExdefIdRules = this.updateExdefIdRules.bind(this)
    this.updateExdefList = this.updateExdefList.bind(this)
  }
  componentWillMount () {
    this.setState({exdefList: this.props.exdefList, store: this.store.getStore()})
  }
  updateExdefIdRules (_id, newIdRules) {
    let previous = util.getAnItemFromList(this.state.exdefList, '_id', _id)
    let converter = new showdown.Converter()
    let updatedExdef = {
      type: previous.type,
      kind: previous.kind,
      inf: previous.inf,
      _id: _id,
      id_rules: newIdRules
    }
    updatedExdef.id_rules_html = converter.makeHtml(updatedExdef.id_rules)
    let success = ipcRenderer.sendSync('update-exdef', updatedExdef)
    this.updateExdefList(success, util.replaceAnItem(this.state.exdefList, '_id', updatedExdef._id, success))
  }
  updateExdefList (success, newExdefList) {
    if (success) {
      newExdefList.sort(util.sortKindAndType)
      this.setState({exdefList: newExdefList})
    }
  }
  render () {
    console.log(this.state.store)

    let detailsView
    if (this.state.store.selectedExdef) {
      detailsView = <Details
        store={this.state.store}
        dispatcher={this.dispatcher}
        updateExdefIdRules={this.updateExdefIdRules}/>
    }
    else detailsView = <h1>Select an execution view element type from the list</h1>
    return (
      <div>
        <List store={this.state.store} dispatcher={this.dispatcher} />
        {detailsView}
      </div>
    )
  }
}
Main.propTypes = {
  exdefList: PropTypes.array
}

let currentWindow = remote.getCurrentWindow()
ReactDOM.render(<Main exdefList={currentWindow.exdefList} />, document.getElementById('exdefMain'))
ipcRenderer.on('show-loading', (event) => window.$('#progressBar').show())
ipcRenderer.on('hide-loading', (event) => window.$('#progressBar').hide())
