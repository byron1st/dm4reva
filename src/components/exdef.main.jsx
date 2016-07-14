'use strict'

import React, {Component} from 'react'
import ReactDOM from 'react-dom'

import List from './exdef.list'
import Details from './exdef.details'

import Store from './store'
import Dispatcher from './dispatcher'
import initializeActions from './actions'

class Main extends Component {
  constructor () {
    super()
    this.store = new Store(this)
    this.dispatcher = new Dispatcher(this.store)
    initializeActions(this.dispatcher)
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
        <div id="exdefList" >
          <List store={this.state.store} dispatcher={this.dispatcher} />
        </div>
        <div id="exdefMain" >
          <div className='container-fluid'>
            <div className='row'>
              {detailsView}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class NotSelected extends Component {
  render () {
    return (
      <div id='exdefDetails' className='col-md-12'>
        <h3 className='text-center'>Select the execution view element type or<br /> Add a new one.</h3>
      </div>
    )
  }
}

ReactDOM.render(<Main />, document.getElementById('mainContent'))
