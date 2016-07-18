'use strict'

import React, {Component} from 'react'
import ReactDOM from 'react-dom'

import List from './exdef.list'
import Details from './exdef.details'

import Store from './store'
import Dispatcher from './dispatcher'
import initializeActions from './actions'
import {type as listActionType} from './actions.list'

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
        <AddNewTypeModal dispatcher={this.dispatcher} />
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

class AddNewTypeModal extends Component {
  eraseValues () {
    $('#addNewType').val('')
    $('#addNewKind').val('')
  }
  handleAdd () {
    let newExdefObject = {
      type: $('#addNewType').val(),
      kind: $('#addNewKind').val(),
      inf: [],
      id_rules: '',
      id_rules_html: ''
    }

    this.props.dispatcher.dispatch({type: listActionType.addExdef, value: newExdefObject})
    this.eraseValues()
  }
  render () {
    return (
      <div className='modal fade' data-backdrop='static' id='addModal' role='dialog' aria-labelledby='addModalLabel'>
        <div className='modal-dialog' role='document'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h4 className='modal-title' id='addModalLabel'>Add a new type</h4>
            </div>
            <div className='modal-body'>
              <div class='form-group'>
                <label for='addNewType'>Type</label>
                <input type='text' className='form-control' id='addNewType' defaultValue='' placeholder='the name of a new execution view element type...' />
              </div>
              <div class='form-group'>
                <label for='addNewKind'>Kind</label>
                <input type='text' className='form-control' id='addNewKind' defaultValue='' placeholder='the kind of a new execution view element type...' />
              </div>
            </div>
            <div className='modal-footer'>
              <button className='btn btn-danger' data-dismiss='modal' aria-label='Close' onClick={this.eraseValues.bind(this)}>Cancel</button>
              <button className='btn btn-primary' data-dismiss='modal' aria-label='Close' onClick={this.handleAdd.bind(this)}>Add</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}


ReactDOM.render(<Main />, document.getElementById('mainContent'))
