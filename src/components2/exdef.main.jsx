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
      store: this.store.getStore()
    }
  }
  render () {
    let detailsView
    if (this.state.store.selected.exdef._id) detailsView = <Details store={this.state.store} dispatcher={this.dispatcher} />
    else detailsView = <NotSelected />
    return (
      <div>
        <List store={this.state.store} dispatcher={this.dispatcher} />
        {detailsView}
      </div>
    )
  }
}

class NotSelected extends Component {
  render () {
    return (
      <div id='exdefDetails' className='col-md-8'>
        <h1>Select the execution view element type or Add a new one.</h1>
      </div>
    )
  }
}

ReactDOM.render(<Main />, document.getElementById('exdefMain'))
